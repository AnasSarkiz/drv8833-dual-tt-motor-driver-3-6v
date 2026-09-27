import { readFileSync } from "node:fs"
import { checkCircuitLock, checkProjectSourceLock } from "./routing-lock"

await checkProjectSourceLock()
if (process.argv[2] !== "--source-only") {
  checkCircuitLock(JSON.parse(readFileSync("dist/index/circuit.json", "utf8")))
}
console.log("PASS: routing lock; 0.30 mm drill / 0.45 mm pad minimums")
