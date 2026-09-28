import { expect, test } from "bun:test"
import { any_circuit_element } from "circuit-json"
import { convertCircuitJsonToPickAndPlaceRows } from "circuit-json-to-pnp-csv"

const circuit = (
  (await Bun.file("dist/index/circuit.json").json()) as unknown[]
).map((element) => any_circuit_element.parse(element))
const sourceComponents = circuit.filter(
  (element) => element.type === "source_component",
)
const pcbComponents = circuit.filter(
  (element) => element.type === "pcb_component",
)
const pads = circuit.filter((element) => element.type === "pcb_smtpad")
const stencilApertures = circuit.filter(
  (element) => element.type === "pcb_solder_paste",
)
const purchasedSmtIds = new Set(
  pcbComponents
    .filter((component) => {
      const source = sourceComponents.find(
        (source) =>
          source.source_component_id === component.source_component_id,
      )
      return (
        source?.supplier_part_numbers?.jlcpcb?.length &&
        pads.some((pad) => pad.pcb_component_id === component.pcb_component_id)
      )
    })
    .map((component) => component.pcb_component_id),
)

test("stencil contains only top purchased-SMT apertures, never bare test pads or THT", () => {
  expect(purchasedSmtIds.size).toBe(39)
  expect(stencilApertures).toHaveLength(106)
  for (const aperture of stencilApertures) {
    expect(aperture.layer).toBe("top")
    const pad = pads.find((pad) => pad.pcb_smtpad_id === aperture.pcb_smtpad_id)
    expect(pad).toBeDefined()
    expect(purchasedSmtIds.has(pad!.pcb_component_id!)).toBe(true)
  }
  for (const id of purchasedSmtIds)
    expect(
      stencilApertures.some((aperture) =>
        pads.some(
          (pad) =>
            pad.pcb_smtpad_id === aperture.pcb_smtpad_id &&
            pad.pcb_component_id === id,
        ),
      ),
    ).toBe(true)
})

test("all 39 automated SMT placements have verified supplier rotations", () => {
  const smtCircuit = circuit.filter(
    (element) =>
      element.type !== "pcb_component" ||
      purchasedSmtIds.has(element.pcb_component_id),
  )
  const placements = convertCircuitJsonToPickAndPlaceRows(smtCircuit, {
    supplier: "jlcpcb",
    requireSupplierRotation: true,
  })
  expect(placements).toHaveLength(39)
  expect(
    placements.filter((placement) => /^LED[1-5]$/.test(placement.designator)),
  ).toHaveLength(5)
})

test("U1 bypasses remain local and the AISEN current path retains its wider copper", () => {
  for (const routeIndex of [51, 52]) {
    const trace = circuit.find(
      (element) =>
        element.type === "pcb_trace" &&
        element.pcb_trace_id === `saved_phase_null_0_${routeIndex}`,
    )
    if (trace?.type !== "pcb_trace")
      throw new Error("Missing driver bypass route")
    expect(
      trace.route.every(
        (point) => point.route_type === "wire" && point.layer === "top",
      ),
    ).toBe(true)
    let lengthMm = 0
    for (let index = 1; index < trace.route.length; index++) {
      const previous = trace.route[index - 1]!
      const point = trace.route[index]!
      if (previous.route_type !== "wire" || point.route_type !== "wire")
        throw new Error("Bypass must stay on top copper")
      lengthMm += Math.hypot(point.x - previous.x, point.y - previous.y)
    }
    expect(lengthMm).toBeLessThan(2.2)
  }
  const senseTrace = circuit.find(
    (element) =>
      element.type === "pcb_trace" &&
      element.pcb_trace_id === "saved_phase_null_0_28",
  )
  if (senseTrace?.type !== "pcb_trace")
    throw new Error("Missing AISEN current route")
  let narrowLengthMm = 0
  for (let index = 1; index < senseTrace.route.length; index++) {
    const previous = senseTrace.route[index - 1]!
    const point = senseTrace.route[index]!
    if (previous.route_type !== "wire" || point.route_type !== "wire")
      throw new Error("AISEN must stay on top copper")
    expect(previous.width).toBeGreaterThanOrEqual(0.4)
    if (previous.width < 0.6)
      narrowLengthMm += Math.hypot(point.x - previous.x, point.y - previous.y)
  }
  expect(narrowLengthMm).toBeLessThan(2)
})
