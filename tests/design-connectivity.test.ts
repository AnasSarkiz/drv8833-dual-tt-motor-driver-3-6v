import { expect, test } from "bun:test"
import {
  any_source_component,
  source_port,
  source_net,
  source_trace,
  pcb_smtpad,
  pcb_port,
  pcb_solder_paste,
} from "circuit-json"

const circuit: unknown[] = await Bun.file("dist/index/circuit.json").json()

function records(type: string) {
  return circuit.filter(
    (element) =>
      typeof element === "object" &&
      element !== null &&
      "type" in element &&
      element.type === type,
  )
}

const components = records("source_component").map((element) => {
  const component = any_source_component.parse(element)
  if (component.type !== "source_component")
    throw new Error("Expected a source component")
  return component
})
const ports = records("source_port").map((element) =>
  source_port.parse(element),
)
const nets = records("source_net").map((element) => source_net.parse(element))
const traces = records("source_trace").map((element) =>
  source_trace.parse(element),
)
const pads = records("pcb_smtpad").map((element) => pcb_smtpad.parse(element))
const pcbPorts = records("pcb_port").map((element) => pcb_port.parse(element))

function getPort(referenceDesignator: string, pinNumber: number) {
  const component = components.find(
    (component) => component.name === referenceDesignator,
  )
  expect(component).toBeDefined()
  const matches = ports.filter(
    (port) =>
      port.source_component_id === component!.source_component_id &&
      port.pin_number === pinNumber,
  )
  expect(matches).toHaveLength(1)
  return matches[0]!
}

function getNetNames(referenceDesignator: string, pinNumber: number) {
  const port = getPort(referenceDesignator, pinNumber)
  return [
    ...new Set(
      traces
        .filter((trace) =>
          trace.connected_source_port_ids.includes(port.source_port_id),
        )
        .flatMap((trace) => trace.connected_source_net_ids ?? [])
        .map((netId) => nets.find((net) => net.source_net_id === netId)?.name),
    ),
  ].sort()
}

test("all components render, without component-creation or other error records", () => {
  expect(components).toHaveLength(53)
  expect(
    components.filter(
      (component) => component.supplier_part_numbers?.jlcpcb?.length,
    ),
  ).toHaveLength(46)
  expect(
    circuit.filter(
      (element) =>
        typeof element === "object" &&
        element !== null &&
        "type" in element &&
        String(element.type).endsWith("_error"),
    ),
  ).toHaveLength(0)
})

test("protection parts keep their physical manufacturer pin connections", () => {
  for (const pinNumber of [1, 2, 3])
    expect(getNetNames("Q1", pinNumber)).toEqual(["VM"])
  expect(getNetNames("Q1", 4)).toEqual(["GND"])
  for (const pinNumber of [5, 6, 7, 8, 9])
    expect(getNetNames("Q1", pinNumber)).toEqual(["VIN_FUSED"])
  expect(getNetNames("D1", 1)).toEqual(["VM"])
  expect(getNetNames("D1", 2)).toEqual(["GND"])
  expect(getNetNames("F1", 1)).toEqual(["VIN"])
  expect(getNetNames("F1", 2)).toEqual(["VIN_FUSED"])
})

function getResistance(referenceDesignator: string) {
  const resistor = components.find(
    (component) => component.name === referenceDesignator,
  )
  if (resistor?.ftype !== "simple_resistor")
    throw new Error(`Missing resistor ${referenceDesignator}`)
  return resistor.resistance
}

test("NTC measuring current and host-enable margin stay within the design budget", () => {
  const maximumVioVolts = 5.25
  const minimumDividerResistanceOhms = getResistance("R19") * 0.99
  expect(maximumVioVolts / minimumDividerResistanceOhms).toBeLessThan(0.0001)
  expect(getNetNames("R19", 1)).toEqual(["VIO"])
  expect(getNetNames("R19", 2)).toEqual(["TEMP_RAW"])
  expect(getNetNames("TH1", 1)).toEqual(["TEMP_RAW"])
  expect(getNetNames("TH1", 2)).toEqual(["GND"])
  const maximumSeriesOhms = getResistance("R8") * 1.01
  const minimumPullOhms = getResistance("R13") * 0.99
  const minimumEnableVolts =
    ((2.8 - maximumSeriesOhms * 0.000013) * minimumPullOhms) /
    (minimumPullOhms + maximumSeriesOhms)
  expect(minimumEnableVolts).toBeGreaterThan(2.65)
})

test("every driver pin matches the TI PWP pin table and intended circuit", () => {
  const expectedNets = [
    "ENABLE",
    "AOUT1",
    "ISEN_A",
    "AOUT2",
    "BOUT2",
    "ISEN_B",
    "BOUT1",
    "FAULT_N",
    "BIN1",
    "BIN2",
    "VCP",
    "VM",
    "GND",
    "VINT",
    "AIN2",
    "AIN1",
    "GND",
  ]
  expectedNets.forEach((netName, index) =>
    expect(getNetNames("U1", index + 1)).toEqual([netName]),
  )
  expect(getNetNames("C6", 1)).toEqual(["VCP"])
  expect(getNetNames("C6", 2)).toEqual(["VM"])
  expect(getNetNames("R2", 1)).toEqual(["ISEN_A"])
  expect(getNetNames("R3", 1)).toEqual(["ISEN_B"])
})

test("driver copper, mask opening and paste match the rotated TI drawing", () => {
  const driverPorts = pcbPorts.filter((port) =>
    ports.some(
      (sourcePort) =>
        sourcePort.source_port_id === port.source_port_id &&
        sourcePort.source_component_id === getPort("U1", 1).source_component_id,
    ),
  )
  const driverPads = pads.filter((pad) =>
    driverPorts.some((port) => port.pcb_port_id === pad.pcb_port_id),
  )
  expect(driverPads).toHaveLength(18)
  for (let pinNumber = 1; pinNumber <= 16; pinNumber++) {
    const sourcePort = getPort("U1", pinNumber)
    const pcbPort = driverPorts.find(
      (port) => port.source_port_id === sourcePort.source_port_id,
    )!
    const pad = driverPads.find(
      (pad) => pad.pcb_port_id === pcbPort.pcb_port_id,
    )!
    expect(pad.shape).toBe("rect")
    if (pad.shape !== "rect")
      throw new Error("Expected rectangular TI lead pad")
    expect(pad.width).toBe(0.45)
    expect(pad.height).toBe(1.5)
    expect(pad.x).toBeCloseTo(
      -2.275 + (pinNumber <= 8 ? pinNumber - 1 : 16 - pinNumber) * 0.65,
      6,
    )
    expect(pad.y).toBe(pinNumber <= 8 ? -2.9 : 2.9)
  }
  const thermalPort = driverPorts.find(
    (port) => port.source_port_id === getPort("U1", 17).source_port_id,
  )!
  const thermalPads = driverPads.filter(
    (pad) => pad.pcb_port_id === thermalPort.pcb_port_id,
  )
  expect(thermalPads).toHaveLength(2)
  const coveredPad = thermalPads.find((pad) => pad.is_covered_with_solder_mask)
  const exposedPad = thermalPads.find((pad) => !pad.is_covered_with_solder_mask)
  expect(coveredPad).toMatchObject({ shape: "rect", width: 5, height: 3.4 })
  expect(exposedPad).toMatchObject({
    shape: "rect",
    width: 2.31,
    height: 2.46,
    soldermask_margin: 0,
  })
  const paste = records("pcb_solder_paste").map((element) =>
    pcb_solder_paste.parse(element),
  )
  expect(
    paste.filter(
      (aperture) => aperture.pcb_smtpad_id === coveredPad!.pcb_smtpad_id,
    ),
  ).toHaveLength(0)
  expect(
    paste.filter(
      (aperture) => aperture.pcb_smtpad_id === exposedPad!.pcb_smtpad_id,
    ),
  ).toEqual([
    expect.objectContaining({ shape: "rect", width: 2.31, height: 2.46 }),
  ])
})
