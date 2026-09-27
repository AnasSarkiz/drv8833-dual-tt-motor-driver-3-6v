import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import type { AnyCircuitElement } from "circuit-json"
import {
  convertCircuitJsonToPcbSvg,
  convertCircuitJsonToSchematicSvg,
} from "circuit-to-svg"
import { Resvg } from "@resvg/resvg-js"

// Preview the unmodified generator output, even when the separate schema gate fails.
// A render is evidence of appearance only, not evidence of validation passing.
const circuit: AnyCircuitElement[] = JSON.parse(
  readFileSync("dist/index/circuit.json", "utf8"),
)
const destination = "artifacts/pre-route"
mkdirSync(destination, { recursive: true })
function savePreview(svg: string, name: string) {
  writeFileSync(`${destination}/${name}.svg`, svg)
  writeFileSync(`${destination}/${name}.png`, new Resvg(svg).render().asPng())
}
for (const layer of ["top", "bottom"] as const) {
  savePreview(
    convertCircuitJsonToPcbSvg(circuit, {
      layer,
      width: 1600,
      height: 1200,
      showCourtyards: true,
    }),
    `pcb-${layer}-unrouted`,
  )
}
for (const sheet of circuit.filter(
  (element) => element.type === "schematic_sheet",
)) {
  savePreview(
    convertCircuitJsonToSchematicSvg(circuit, {
      schematicSheetId: sheet.schematic_sheet_id,
      width: 1800,
      height: 1250,
    }),
    `schematic-${sheet.name}`,
  )
}
writeFileSync(
  `${destination}/circuit.json`,
  readFileSync("dist/index/circuit.json"),
)
console.log(
  "Review previews saved; schematic/assembly/mechanical approval remains blocked",
)
