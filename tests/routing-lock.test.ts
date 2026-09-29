import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { checkCircuitLock, checkSourceLock } from "../scripts/routing-lock"

const circuit = JSON.parse(readFileSync("dist/index/circuit.json", "utf8"))
// Validate the shared baseline once; each negative fixture still runs the full guard.
const parsed = checkCircuitLock(circuit)
const enabled = "export default () => <board routingDisabled={false} />"

describe("authorized routed-board contract", () => {
  test("accepts the generated routed board and reviewed thermal vias", () =>
    expect(() => checkCircuitLock(circuit)).not.toThrow())
  test("accepts explicit routing authorization in source", () =>
    expect(() => checkSourceLock(enabled, "index.circuit.tsx")).not.toThrow())
  test("rejects missing routing state", () =>
    expect(() =>
      checkSourceLock("export default () => <board />", "index.circuit.tsx"),
    ).toThrow())
  test("rejects disabled routing", () =>
    expect(() =>
      checkSourceLock(
        "export default () => <board routingDisabled={true} />",
        "index.circuit.tsx",
      ),
    ).toThrow("literal false"))
  test("rejects a bare routingDisabled flag", () =>
    expect(() =>
      checkSourceLock(
        "export default () => <board routingDisabled />",
        "index.circuit.tsx",
      ),
    ).toThrow("literal false"))
  test("rejects board prop spreads", () =>
    expect(() =>
      checkSourceLock(
        "export default () => <board routingDisabled={false} {...options} />",
        "index.circuit.tsx",
      ),
    ).toThrow("spreads"))
  test("rejects a board with all routes removed", () => {
    expect(() =>
      checkCircuitLock(
        parsed.filter((element) => element.type !== "pcb_trace"),
      ),
    ).toThrow("no routed traces")
  })
  // Each independent negative fixture gets its own unchanged runner deadline.
  test.each([
    { dimension: "drill", geometry: { hole_diameter: 0.29 } },
    { dimension: "pad", geometry: { outer_diameter: 0.44 } },
  ])("rejects undersized generated via $dimension", ({ geometry }) => {
    const via = parsed.find((element) => element.type === "pcb_via")!
    expect(() =>
      checkCircuitLock([
        ...parsed,
        { ...via, pcb_via_id: "undersized_via", x: 10, ...geometry },
      ]),
    ).toThrow("Via minimum violated")
  })
  test("rejects changed board via minimums", () => {
    expect(() =>
      checkCircuitLock(
        parsed.map((element) =>
          element.type === "pcb_board"
            ? { ...element, min_via_pad_diameter: 0.4 }
            : element,
        ),
      ),
    ).toThrow("via minimums changed")
  })
  test("rejects changed thermal via geometry", () => {
    expect(() =>
      checkCircuitLock(
        parsed.map((element) =>
          element.type === "pcb_via" && element.pcb_via_id === "pcb_via_0"
            ? { ...element, x: element.x + 1 }
            : element,
        ),
      ),
    ).toThrow("thermal via geometry")
  })
  test("rejects a missing inner ground plane", () => {
    expect(() =>
      checkCircuitLock(
        parsed.filter((element) => element.type !== "pcb_copper_pour"),
      ),
    ).toThrow("Missing inner ground plane")
  })
  test("rejects unknown schema elements", () =>
    expect(() =>
      checkCircuitLock([...circuit, { type: "invented_copper" }]),
    ).toThrow("schema rejects"))
})
