import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import type { AnyCircuitElement } from "circuit-json"
import {
  convertCircuitJsonToPcbSvg,
  convertCircuitJsonToSchematicSvg,
} from "circuit-to-svg"
import { Resvg } from "@resvg/resvg-js"

// Preview the unmodified, validated generator output.
const circuit: AnyCircuitElement[] = JSON.parse(
  readFileSync("dist/index/circuit.json", "utf8"),
)
const destination = "artifacts/routed"
mkdirSync(destination, { recursive: true })
function savePreview(svg: string, name: string) {
  writeFileSync(`${destination}/${name}.svg`, svg)
  writeFileSync(`${destination}/${name}.png`, new Resvg(svg).render().asPng())
}
for (const layer of ["top", "inner1", "inner2", "bottom"] as const) {
  savePreview(
    convertCircuitJsonToPcbSvg(circuit, {
      layer,
      width: 1600,
      height: 1200,
      showCourtyards: false,
    }),
    `pcb-${layer}`,
  )
}
writeFileSync(
  `${destination}/mounting-template.png`,
  new Resvg(readFileSync("artifacts/pre-route/mounting-template.svg", "utf8"), {
    fitTo: { mode: "width", value: 1500 },
  })
    .render()
    .asPng(),
)
writeFileSync(
  `${destination}/mounting-template.svg`,
  readFileSync("artifacts/pre-route/mounting-template.svg"),
)
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
  "Routed prototype previews saved; physical qualification is separate",
)
