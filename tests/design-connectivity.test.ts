import { expect, test } from "bun:test"
import {
  any_source_component,
  source_port,
  source_net,
  source_trace,
  source_component_internal_connection,
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
type ElectricalNodeId = string
const electricalEdges: ElectricalNodeId[][] = [
  ...traces.map((trace) => [
    ...trace.connected_source_port_ids,
    ...(trace.connected_source_net_ids ?? []),
  ]),
  ...records("source_component_internal_connection").map(
    (element) =>
      source_component_internal_connection.parse(element).source_port_ids,
  ),
]

function connectedNodes(
  startId: ElectricalNodeId,
  edges: ElectricalNodeId[][],
) {
  const connected = new Set<ElectricalNodeId>([startId])
  let previousSize = 0
  while (previousSize !== connected.size) {
    previousSize = connected.size
    for (const edge of edges) {
      if (edge.some((nodeId) => connected.has(nodeId))) {
        for (const nodeId of edge) connected.add(nodeId)
      }
    }
  }
  return connected
}
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
  expect(components).toHaveLength(54)
  expect(
    components.filter(
      (component) => component.supplier_part_numbers?.jlcpcb?.length,
    ),
  ).toHaveLength(47)
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

test("all ground returns share one electrical network without bypassing the shunts", () => {
  const groundNets = nets.filter((net) => net.name === "GND")
  expect(groundNets).toHaveLength(1)
  const ground = connectedNodes(groundNets[0]!.source_net_id, electricalEdges)
  const requiredGroundPins: [string, number][] = [
    ["J1", 2],
    ["Q1", 4],
    ["C1", 2],
    ["C2", 2],
    ["D1", 2],
    ["LED1", 1],
    ["U1", 13],
    ["U1", 17],
    ["R2", 2],
    ["R3", 2],
    ["C3", 2],
    ["C4", 2],
    ["C5", 2],
    ["J4", 2],
    ["J5", 3],
    ["J6", 3],
    ["R9", 2],
    ["R10", 2],
    ["R11", 2],
    ["R12", 2],
    ["R13", 2],
    ["SW1", 3],
    ["SW1", 4],
    ["U2", 4],
    ["C7", 2],
    ["LED2", 1],
    ["LED3", 1],
    ["LED4", 1],
    ["TH1", 2],
    ["C8", 2],
    ["J7", 3],
    ["TP3", 1],
  ]
  for (const [referenceDesignator, pinNumber] of requiredGroundPins)
    expect(
      ground.has(getPort(referenceDesignator, pinNumber).source_port_id),
    ).toBe(true)
  for (const netName of [
    "VIN",
    "VIN_FUSED",
    "VM",
    "VIO",
    "ISEN_A",
    "ISEN_B",
    "AOUT1",
    "AOUT2",
    "BOUT1",
    "BOUT2",
  ]) {
    const matchingNets = nets.filter((net) => net.name === netName)
    expect(matchingNets).toHaveLength(1)
    expect(ground.has(matchingNets[0]!.source_net_id)).toBe(false)
  }
})

test("ground connectivity detects an isolated exposed pad even when its net is also named GND", () => {
  const groundNet = nets.find((net) => net.name === "GND")!
  const exposedPadId = getPort("U1", 17).source_port_id
  const isolatedGroundNet = {
    ...groundNet,
    source_net_id: "isolated_ground_fixture",
  }
  const disconnectedEdges = electricalEdges.map((edge) =>
    edge.includes(exposedPadId)
      ? edge.map((nodeId) =>
          nodeId === groundNet.source_net_id
            ? isolatedGroundNet.source_net_id
            : nodeId,
        )
      : edge,
  )
  expect(isolatedGroundNet.name).toBe(groundNet.name)
  expect(
    connectedNodes(groundNet.source_net_id, electricalEdges).has(exposedPadId),
  ).toBe(true)
  expect(
    connectedNodes(groundNet.source_net_id, disconnectedEdges).has(
      exposedPadId,
    ),
  ).toBe(false)
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

test("the normally open disable button connects only ENABLE and ground through the correct contact pairs", () => {
  const button = components.find((component) => component.name === "SW1")!
  expect(button.ftype).toBe("simple_push_button")
  expect(button.supplier_part_numbers?.jlcpcb).toEqual(["C318884"])
  for (const pinNumber of [1, 2])
    expect(getNetNames("SW1", pinNumber)).toEqual(["ENABLE"])
  for (const pinNumber of [3, 4])
    expect(getNetNames("SW1", pinNumber)).toEqual(["GND"])
  const contactPairs = records("source_component_internal_connection")
    .map((element) => source_component_internal_connection.parse(element))
    .filter((pair) => pair.source_component_id === button.source_component_id)
    .map((pair) =>
      pair.source_port_ids
        .map(
          (id) => ports.find((port) => port.source_port_id === id)!.pin_number,
        )
        .sort(),
    )
  expect(contactPairs).toEqual([
    [1, 2],
    [3, 4],
  ])
  const enableId = getPort("U1", 1).source_port_id
  const groundId = getPort("SW1", 3).source_port_id
  const hostId = getPort("J4", 3).source_port_id
  expect(connectedNodes(enableId, electricalEdges).has(groundId)).toBe(false)
  const pressedEdges = [
    ...electricalEdges,
    [getPort("SW1", 1).source_port_id, groundId],
  ]
  expect(connectedNodes(enableId, pressedEdges).has(groundId)).toBe(true)
  // The host must still be isolated by R8 when the switch is pressed.
  expect(connectedNodes(enableId, pressedEdges).has(hostId)).toBe(false)
  expect(getNetNames("R8", 1)).toEqual(["HOST_ENABLE"])
  expect(getNetNames("R8", 2)).toEqual(["ENABLE"])
  const maximumPressedCurrentAmps = 5.25 / (getResistance("R8") * 0.99)
  expect(maximumPressedCurrentAmps).toBeLessThan(0.0025)
  // Manufacturer contact resistance is 100 milliohms maximum.
  expect(maximumPressedCurrentAmps * 0.1).toBeLessThan(0.5)
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
