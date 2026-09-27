import { getFullConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"
import { expect, test } from "bun:test"
import { any_circuit_element } from "circuit-json"
import {
  checkEachPcbPortConnectedToPcbTraces,
  checkTracesAreContiguous,
} from "@tscircuit/checks"
const input: unknown[] = await Bun.file("dist/index/circuit.json").json()
const circuit = input.map((element) => any_circuit_element.parse(element))
test("every physical port and trace is connected", () => {
  expect(
    checkEachPcbPortConnectedToPcbTraces(structuredClone(circuit)),
  ).toEqual([])
  expect(checkTracesAreContiguous(structuredClone(circuit))).toEqual([])
})
test("removing the ground pours exposes disconnected ground pads", () => {
  const withoutPours = structuredClone(circuit).filter(
    (element) => element.type !== "pcb_copper_pour",
  )
  const errors = checkEachPcbPortConnectedToPcbTraces(withoutPours)
  expect(errors.some((error) => error.message.includes("GND"))).toBe(true)
})
test("removing a motor-output route exposes physical disconnection", () => {
  const motorNet = circuit.find(
    (element) => element.type === "source_net" && element.name === "AOUT1",
  )
  if (motorNet?.type !== "source_net") throw new Error("Missing AOUT1")
  const netMap = getFullConnectivityMapFromCircuitJson(circuit)
  const motorNetId = netMap.getNetConnectedToId(motorNet.source_net_id)
  const withoutMotorRoute = structuredClone(circuit).filter(
    (element) =>
      element.type !== "pcb_trace" ||
      netMap.getNetConnectedToId(element.pcb_trace_id) !== motorNetId,
  )
  expect(
    checkEachPcbPortConnectedToPcbTraces(withoutMotorRoute).length +
      checkTracesAreContiguous(withoutMotorRoute).length,
  ).toBeGreaterThan(0)
})
