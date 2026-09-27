import { any_circuit_element } from "circuit-json"
import { runAllRoutingChecks } from "@tscircuit/checks"
const input: unknown[] = await Bun.file("dist/index/circuit.json").json()
const circuit = input.map((element) => any_circuit_element.parse(element))
const findings = await runAllRoutingChecks(circuit)
for (const finding of findings) console.log(finding.message)
console.log(`Fresh native routing checks: ${findings.length} findings`)
if (findings.length) process.exit(1)
