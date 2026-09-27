import assert from "node:assert/strict"
import { any_circuit_element } from "circuit-json"
import mechanical from "../references/mechanical.json"

// Check real emitted geometry using the same runtime available in cloud builds.
const input: unknown[] = await Bun.file("dist/index/circuit.json").json()
const circuit = input.map((element) => any_circuit_element.parse(element))
const boards = circuit.filter((element) => element.type === "pcb_board")
assert.equal(boards.length, 1, "Expected exactly one board")
const board = boards[0]!
assert.equal(board.width, mechanical.board_width_mm)
assert.equal(board.height, mechanical.board_height_mm)
assert.equal(board.thickness, mechanical.board_thickness_mm)
assert.equal(board.num_layers, 4)
assert.deepEqual(board.center, { x: 0, y: 0 })
const holes = circuit.filter((element) => element.type === "pcb_hole")
const keepouts = circuit.filter((element) => element.type === "pcb_keepout")
assert.equal(holes.length, 4)
assert.equal(mechanical.holes.length, 4)
assert.equal(keepouts.length, 4)
const courtyards: {
  name: string
  bounds: [number, number, number, number]
}[] = []
for (const element of circuit) {
  let bounds: [number, number, number, number]
  if (element.type === "pcb_courtyard_outline") {
    const xs = element.outline.map((point) => point.x)
    const ys = element.outline.map((point) => point.y)
    bounds = [
      Math.min(...xs),
      Math.max(...xs),
      Math.min(...ys),
      Math.max(...ys),
    ]
  } else if (element.type === "pcb_courtyard_rect") {
    assert.equal(
      element.ccw_rotation ?? 0,
      0,
      "Rotated courtyard requires polygon bounds",
    )
    bounds = [
      element.center.x - element.width / 2,
      element.center.x + element.width / 2,
      element.center.y - element.height / 2,
      element.center.y + element.height / 2,
    ]
  } else if (element.type === "pcb_courtyard_circle") {
    bounds = [
      element.center.x - element.radius,
      element.center.x + element.radius,
      element.center.y - element.radius,
      element.center.y + element.radius,
    ]
  } else continue
  const component = circuit.find(
    (part) =>
      part.type === "pcb_component" &&
      part.pcb_component_id === element.pcb_component_id,
  )
  assert(component?.type === "pcb_component")
  const source = circuit.find(
    (part) =>
      part.type === "source_component" &&
      part.source_component_id === component.source_component_id,
  )
  assert(source?.type === "source_component")
  assert(bounds[0] >= -board.width / 2)
  assert(bounds[1] <= board.width / 2)
  assert(bounds[2] >= -board.height / 2)
  assert(bounds[3] <= board.height / 2)
  courtyards.push({ name: source.name, bounds })
}
assert.equal(
  courtyards.length,
  53,
  "Every purchased component and test pad needs a courtyard",
)
console.log(
  "Board: 75 x 60 x 1.6 mm; four-layer; custom chassis mounting pattern",
)
for (const expected of mechanical.holes) {
  const xMm = expected.x_mm
  const yMm = expected.y_mm
  const matches = holes.filter((hole) => hole.x === xMm && hole.y === yMm)
  assert.equal(matches.length, 1)
  assert.equal(matches[0]!.hole_shape, "circle")
  assert.equal(matches[0]!.hole_diameter, mechanical.hole_diameter_mm)
  const keepout = keepouts.filter(
    (part) =>
      part.shape === "circle" && part.center.x === xMm && part.center.y === yMm,
  )
  assert.equal(keepout.length, 1)
  assert.deepEqual(keepout[0]!.layers, ["top", "inner1", "inner2", "bottom"])
  assert(keepout[0]!.shape === "circle")
  assert.equal(keepout[0]!.radius, mechanical.hardware_keepout_radius_mm)
  const clearances = courtyards
    .map(({ name, bounds: [left, right, bottom, top] }) => {
      const gapMm =
        Math.hypot(
          Math.max(left - xMm, 0, xMm - right),
          Math.max(bottom - yMm, 0, yMm - top),
        ) - mechanical.hardware_keepout_radius_mm
      assert(
        gapMm >= 0.5,
        `${name} is too close to ${expected.name}: ${gapMm.toFixed(3)} mm`,
      )
      return { name, gapMm }
    })
    .sort((a, b) => a.gapMm - b.gapMm)
  const nearest = clearances[0]!
  console.log(
    `${expected.name}: (${xMm}, ${yMm}) mm; drill 3.2 mm; nearest courtyard ${nearest.name}, gap ${nearest.gapMm.toFixed(3)} mm beyond 7 mm hardware zone`,
  )
}
console.log(
  "PASS: outline, four NPTH holes, four-layer keepouts and 53 courtyard envelopes",
)
console.log(
  "NOT VERIFIED: any particular chassis, connector mating envelope, screw/tool access in 3D",
)
