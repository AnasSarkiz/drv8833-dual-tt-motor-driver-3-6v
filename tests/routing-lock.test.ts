import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { pcb_trace } from "circuit-json"
import { checkCircuitLock, checkSourceLock } from "../scripts/routing-lock"

const circuit: unknown[] = JSON.parse(
  readFileSync("dist/index/circuit.json", "utf8"),
)
const fixture = [
  {
    type: "pcb_board",
    pcb_board_id: "test_board",
    center: { x: 0, y: 0 },
    width: 10,
    height: 10,
    thickness: 1.6,
    num_layers: 4,
    material: "fr4",
    min_via_hole_diameter: 0.3,
    min_via_pad_diameter: 0.45,
  },
  ...circuit.filter(
    (element) =>
      typeof element === "object" &&
      element !== null &&
      "type" in element &&
      ["pcb_via", "source_trace", "source_net"].includes(String(element.type)),
  ),
]
const locked = "export default () => <board routingDisabled={true} />"

describe("pre-route safety lock", () => {
  test("accepts the actual unrouted build and reviewed footprint vias", () =>
    expect(() => checkCircuitLock(circuit)).not.toThrow())
  test("accepts a literal source lock", () =>
    expect(() => checkSourceLock(locked, "index.circuit.tsx")).not.toThrow())
  test("rejects missing source lock", () =>
    expect(() =>
      checkSourceLock("export default () => <board />", "index.circuit.tsx"),
    ).toThrow())
  test("rejects nested routing override", () =>
    expect(() =>
      checkSourceLock(
        "export default () => <board routingDisabled={true}><group routingDisabled={false} /></board>",
        "index.circuit.tsx",
      ),
    ).toThrow("literal true"))
  test("rejects board prop spreads", () =>
    expect(() =>
      checkSourceLock(
        "export default () => <board routingDisabled={true} {...options} />",
        "index.circuit.tsx",
      ),
    ).toThrow("spreads"))
  test("rejects a schema-valid deliberately routed fixture", () => {
    const routed = pcb_trace.parse({
      type: "pcb_trace",
      pcb_trace_id: "forbidden_fixture",
      route: [
        { route_type: "wire", x: 0, y: 0, width: 0.3, layer: "top" },
        { route_type: "wire", x: 2, y: 0, width: 0.3, layer: "top" },
      ],
    })
    expect(() => checkCircuitLock([...fixture, routed])).toThrow(
      "Routed copper forbidden",
    )
  })
  test("rejects unreviewed signal vias", () => {
    const existing = checkCircuitLock(fixture).find(
      (element) => element.type === "pcb_via",
    )!
    expect(() =>
      checkCircuitLock([
        ...fixture,
        { ...existing, pcb_via_id: "signal_via", x: 10 },
      ]),
    ).toThrow("Unreviewed via")
  })
  test("rejects changed via minimums", () => {
    const changed = checkCircuitLock(fixture).map((element) =>
      element.type === "pcb_board"
        ? { ...element, min_via_pad_diameter: 0.4 }
        : element,
    )
    expect(() => checkCircuitLock(changed)).toThrow("via minimums changed")
  })
  test("rejects unknown schema elements", () =>
    expect(() =>
      checkCircuitLock([...fixture, { type: "invented_copper" }]),
    ).toThrow())
})
