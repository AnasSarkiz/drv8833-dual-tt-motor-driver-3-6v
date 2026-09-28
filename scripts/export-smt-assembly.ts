import { mkdirSync } from "node:fs"
import { any_circuit_element } from "circuit-json"
import {
  convertCircuitJsonToPickAndPlaceCsv,
  convertCircuitJsonToPickAndPlaceRows,
} from "circuit-json-to-pnp-csv"

// Assembly scope: top SMT reflow, followed by manually fitted J1–J7.
const circuit = (
  (await Bun.file("dist/index/circuit.json").json()) as unknown[]
).map((element) => any_circuit_element.parse(element))
const smtComponentIds = new Set(
  circuit
    .filter((element) => element.type === "pcb_smtpad")
    .map((pad) => pad.pcb_component_id),
)
const smtCircuit = circuit.filter(
  (element) =>
    element.type !== "pcb_component" ||
    smtComponentIds.has(element.pcb_component_id),
)
const options = { supplier: "jlcpcb", requireSupplierRotation: true } as const
const placements = convertCircuitJsonToPickAndPlaceRows(smtCircuit, options)
if (
  placements.length !== 39 ||
  placements.some((placement) => placement.layer !== "top")
)
  throw new Error("Expected exactly 39 top SMT placements")
const destination = "artifacts/order-release"
mkdirSync(destination, { recursive: true })
await Bun.write(
  `${destination}/jlc-smt-cpl.csv`,
  convertCircuitJsonToPickAndPlaceCsv(smtCircuit, options),
)
await Bun.write(
  `${destination}/smt-designators.json`,
  JSON.stringify(
    placements.map((placement) => placement.designator),
    null,
    2,
  ) + "\n",
)
console.log(
  "Exported 39 SMT placements with required, verified JLCPCB rotations; J1–J7 are manually fitted",
)
