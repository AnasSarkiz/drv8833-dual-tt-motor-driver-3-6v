import { readFileSync } from "node:fs"
import { createHash } from "node:crypto"
import ts from "typescript"
import { any_circuit_element } from "circuit-json"
import thermalStructures from "../references/thermal-structures.json"

const forbiddenElements = new Set([
  "pcbtrace",
  "copperpour",
  "fanout",
  "autoroutingphase",
  "breakout",
  "tracehint",
])
const forbiddenAttributes = new Set([
  "manualEdits",
  "pcbRouteCache",
  "autorouter",
  "circuitJson",
])

export function checkSourceLock(source: string, filename: string) {
  const syntax = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  let boards = 0
  const visit = (node: ts.Node): void => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(syntax)
      if (forbiddenElements.has(tag))
        throw new Error(`${filename}: forbidden routing element ${tag}`)
      if (tag === "via" && filename !== "imports/DRV8833PWPR.tsx")
        throw new Error(`${filename}: unreviewed via`)
      let locked = false
      for (const attribute of node.attributes.properties) {
        if (ts.isJsxSpreadAttribute(attribute)) {
          if (tag === "board")
            throw new Error(
              "Root board spreads cannot override the routing lock",
            )
          continue
        }
        const name = attribute.name.getText(syntax)
        if (forbiddenAttributes.has(name))
          throw new Error(`${filename}: forbidden routing attribute ${name}`)
        if (name === "routingDisabled") {
          const initializer = attribute.initializer
          locked =
            initializer === undefined ||
            (ts.isJsxExpression(initializer) &&
              initializer.expression?.kind === ts.SyntaxKind.TrueKeyword)
          if (!locked)
            throw new Error(`${filename}: routingDisabled must be literal true`)
        }
      }
      if (tag === "board") {
        boards++
        if (filename !== "index.circuit.tsx" || !locked)
          throw new Error("Only the locked canonical board is permitted")
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(syntax)
  if (filename === "index.circuit.tsx" && boards !== 1)
    throw new Error("Exactly one root board is required")
}

export function checkCircuitLock(input: unknown) {
  if (!Array.isArray(input)) throw new Error("Circuit JSON must be an array")
  const circuit = input.map((element, index) => {
    const parsed = any_circuit_element.safeParse(element)
    if (!parsed.success)
      throw new Error(
        `Circuit JSON schema rejects element ${index} (${element?.type ?? "unknown"}); inspect scripts/check-schema.ts`,
      )
    return parsed.data
  })
  const boards = circuit.filter((element) => element.type === "pcb_board")
  if (boards.length !== 1)
    throw new Error("Exactly one generated board is required")
  const board = boards[0]!
  if (
    board.num_layers !== 4 ||
    board.min_via_hole_diameter !== 0.3 ||
    board.min_via_pad_diameter !== 0.45
  )
    throw new Error("Board stackup or via minimums changed")
  for (const element of circuit) {
    if (element.type === "pcb_trace" || element.type === "pcb_copper_pour")
      throw new Error(`Routed copper forbidden: ${element.type}`)
    if (element.type !== "pcb_via") continue
    const allowed = thermalStructures.vias.find(
      (via) => via.id === element.pcb_via_id,
    )
    if (
      !allowed ||
      Math.abs(element.x - allowed.x_mm) > 1e-6 ||
      Math.abs(element.y - allowed.y_mm) > 1e-6 ||
      element.hole_diameter !== allowed.drill_mm ||
      element.outer_diameter !== allowed.pad_mm
    )
      throw new Error("Unreviewed via or changed thermal geometry")
    if (element.hole_diameter < 0.3 || element.outer_diameter < 0.45)
      throw new Error("Via minimum violated")
    if (element.layers.join(",") !== "top,inner1,inner2,bottom")
      throw new Error("Thermal via span changed")
    const trace = circuit.find(
      (trace) =>
        trace.type === "source_trace" &&
        trace.source_trace_id === element.source_trace_id,
    )
    const ground = circuit.find(
      (net) => net.type === "source_net" && net.name === "GND",
    )
    if (
      trace?.type !== "source_trace" ||
      ground?.type !== "source_net" ||
      !trace.connected_source_net_ids?.includes(ground.source_net_id)
    )
      throw new Error("Thermal via is not assigned to GND")
  }
  if (
    circuit.filter((element) => element.type === "pcb_via").length !==
    thermalStructures.vias.length
  )
    throw new Error("Thermal via count changed")
  return circuit
}

export async function checkProjectSourceLock() {
  for (const filename of [
    "index.circuit.tsx",
    ...Array.from(new Bun.Glob("{lib,imports}/**/*.tsx").scanSync(".")),
  ]) {
    checkSourceLock(readFileSync(filename, "utf8"), filename)
  }
  const imported = readFileSync("imports/DRV8833PWPR.tsx")
  if (
    createHash("sha256").update(imported).digest("hex") !==
    thermalStructures.import_sha256
  )
    throw new Error(
      "Thermal footprint import changed; review and update allowlist",
    )
  const config = JSON.parse(readFileSync("tscircuit.config.json", "utf8"))
  if (
    config.mainEntrypoint !== "index.circuit.tsx" ||
    config.previewComponentPath !== "index.circuit.tsx" ||
    config.build?.routingDisabled !== true ||
    config.alwaysUseLatestTscircuitOnCloud !== false
  )
    throw new Error(
      "Build/preview configuration does not preserve the reviewed source lock",
    )
}
