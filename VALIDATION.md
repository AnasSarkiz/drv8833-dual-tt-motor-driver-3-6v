# Validation — routed alpha.4 prototype

Run on 2026-09-27. These are software checks and limited visual review, not physical measurements. Current evidence is under `artifacts/routed/logs/`; older pre-route evidence is historical.

| Check | Result | Evidence / scope |
|---|---|---|
| Formatting and TypeScript | PASS | format.log, typecheck.log |
| Native logical netlist | PASS, zero errors/warnings | netlist.log |
| Native placement | PASS, zero errors/warnings | placement.log |
| Full build | PASS | build.log; 7 classified model/schematic warnings remain |
| Complete Circuit JSON schema | PASS, zero rejected records | schema.log; no output edits |
| Fresh native routing checks | PASS, zero findings | routing.log, build.log; rerun independently on generated copper |
| Project regression suite | PASS, 22 tests / 706 assertions | tests.log; pin mapping, ground connectivity, U1 geometry, source and via rules |
| Negative physical-connectivity cases | PASS | Removing ground pours or AOUT1 routes produces disconnections |
| Gerber-mode shorts, all layers, 40 px/mm | PASS | shorts-gerber.log |
| Additional PCB-image shorts mode | INCOMPLETE | shorts-pcb.log; stopped after >10 minutes without output; Gerber-mode check above passed |
| Mechanical geometry | PASS | mechanical.log; 75 × 60 × 1.6 mm, four 3.2 mm holes, 65 × 50 mm centers, 53 courtyards |
| Source and via contract | PASS | build.log; minimum 0.30/0.45 mm and actual 4-layer through vias |
| PCB previews | PASS for generation and visual inspection | All four layer PNG/SVG files |
| Four schematic previews | PASS for generation | Schematic styling/association warnings remain classified |
| BOM/import identity | Unchanged | 46 purchased components / 21 selected C-numbers; stock and assembly qualification remain pending |
| Physical chassis, 3D and assembly fit | NOT RUN | No selected chassis or verified assembly process |
| Electrical/current/thermal/protection qualification | NOT RUN | DESIGN_REVIEW.md and TEST_PLAN.md |
| Public publication | See PUBLICATION.md | Local success and remote build status are recorded separately |

Final geometry: 70 trace records, 64 vias (54 signal/power, six added ground stitches, four U1 thermal vias), and five generated ground-pour polygons across top, inner1 and bottom. Inner1 contains signal routes as well as ground copper.

Remaining build warnings are two reference-prefix conventions (Q1/TH1), two IC-style power-pin warnings on the nine-pad discrete MOSFET Q1, and three schematic reference-text association warnings (F1/D1/TH1). Visible reference labels exist; these warnings are retained, not suppressed. See ISSUES.md. Native routing checks have no findings.

The checked-in generator/schema patches and their focused regression results are documented in TOOLCHAIN.md. The full upstream core test suite and a separate clean execution of the rebuild helper were not run.

One suite run under concurrent image-check CPU load exceeded Bun's default 5-second per-test timeout. The unchanged suite then passed all 22 tests; no timing threshold or assertion was weakened.
