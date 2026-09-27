import { any_circuit_element, pcb_component } from "circuit-json"

const circuit: unknown[] = await Bun.file("dist/index/circuit.json").json()
let failures = 0
for (const element of circuit) {
  const parsed = any_circuit_element.safeParse(element)
  if (parsed.success) continue
  failures++
  if (
    typeof element === "object" &&
    element !== null &&
    "type" in element &&
    element.type === "pcb_component"
  ) {
    const component = pcb_component.safeParse(element)
    if (!component.success)
      console.error(JSON.stringify({ element, issues: component.error.issues }))
  } else {
    console.error("Schema rejected:", JSON.stringify(element))
  }
}
console.log(`${failures} schema failures`)
if (failures) process.exit(1)
