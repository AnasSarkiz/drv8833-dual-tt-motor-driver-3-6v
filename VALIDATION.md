# Validation — incomplete draft

All results are automated checks or limited visual/analytical review. No simulation or physical measurement occurred.

| Check | Status | Evidence / limitation |
|---|---|---|
| Isolated workspace | PASS | New directory; prior motor projects untouched |
| Exact tscircuit version / lockfile | PASS | TOOLCHAIN.md, package.json, bun.lock |
| TypeScript | PASS | artifacts/pre-route/logs/typecheck.log |
| Logical netlist | PASS (tool coverage) | logs/netlist.log: 0 errors, 0 warnings; not independent electrical signoff |
| Standard unrouted CLI build | PASS with warnings | logs/build.log; 50 classified warnings remain |
| Courtyard collision check | PASS (study placement only) | logs/placement.log: 0 collisions, 0 placement errors |
| Connector accessibility / orientation | BLOCKED | Three access warnings; no orientation suggestions; mating/tool envelopes unverified |
| Source routing lock | PASS | Literal root lock and configuration checks; no autorouter or copper-pour elements |
| Generated raw routed geometry inventory | PASS | 0 pcb_trace, 0 pcb_copper_pour; 4 explicit footprint thermal vias |
| Full generated-schema guard | FAIL | TOOL-001, 67 schema violations: 57 component offsets, 6 board-level silkscreen IDs and 4 header plated-hole IDs |
| Guard tests | FAIL overall | 8 pass / 1 fails on actual generated JSON; negative routed fixture rejected |
| Four sheets generated | PASS (existence only) | Four schematic PNG/SVG files |
| Schematic quality | BLOCKED | logs/schematic-placement.log plus visual review; oversized IC symbol/whitespace and warnings need cleanup |
| Candidate supplier imports | PASS (import only) | 19 real modules with hashes; 46 purchased parts |
| Stock / final BOM verification | BLOCKED | C25804 stock lookup empty; independent datasheet/assembly checks unfinished |
| Chassis-module outline and mounting holes | PASS (2D geometry) | 75 × 60 mm; four 3.2 mm NPTH holes; 65 × 50 mm centers; logs/mechanical.log |
| Fit to a specific chassis | NOT RUN | User has no chassis yet; custom mounting pattern and template provided |
| 3D fit and thermal-paste assembly review | NOT RUN | Imported model URLs exist; geometry and process unverified |
| Electrical protection and thermal signoff | BLOCKED | DESIGN_REVIEW.md records open calculations and selections |
| Physical routed connectivity | NOT RUN | NOT ROUTED — BY DESIGN |
| Prototype tests | NOT RUN | TEST_PLAN.md; no hardware |
| Onboard MCU / crystal / programming | NOT APPLICABLE | External-controller baseline |
| Public repository publication | See PUBLICATION.md | User authorized both repositories; actual remote results recorded separately |

Visual inspection of the top preview confirms four mounting holes/keepouts, test pads and no routed copper. The mechanical template was visually checked; no physical fit measurement occurred. The driver sheet is generated but its IC symbol is oversized and some labels are crowded. Neither has been marked placement/assembly approved. No manufacturing exports, routing-difficulty solver, signal router or purchasing workflow was run.
