# Validation — routed alpha.6 prototype

Run 28 September 2026. Current evidence: `artifacts/order-release/logs/`; prior reports are historical. These checks validate design files, not physical boards.

| Check | Result |
|---|---|
| Format and TypeScript | PASS |
| Native netlist | 0 errors / 0 warnings |
| Placement DRC | 0 errors / 0 warnings; CLI also reports one advisory C7 orientation suggestion |
| Full build, strict Circuit JSON schema and routing contract | PASS; 7 classified schematic/model warnings |
| Fresh native routing / physical connectivity | 0 findings |
| Board regression tests | 26 pass / 1,139 assertions, including negative connectivity cases |
| Gerber shorts, four layers, 40 px/mm | No shorts detected |
| Mechanical checks | PASS; 75×60×1.6 mm, four 3.2 mm NPTH holes, 65×50 mm centers |
| Trace/drill measurement | 72 traces / 544 segments / 60 vias; 0 measured drill-clearance violations |
| Actual exported stencil | 110 TOP / 0 BOTTOM flashes; no THT/test-pad paste |
| SMT BOM/CPL | 40 matching designators; all supplier rotations required and verified |
| Live JLC stock | 23 exact types cover five-board placements; C876469 loss allowance/stock reservation still needs final quote |
| Physical motor/current/thermal tests | Not yet run; prototype test plan applies |

Vias: 49 at 0.30/0.45 mm, seven at 0.30/0.60 mm, four U1 thermal vias at 0.3048/0.6096 mm. All span four copper layers. Ground pours cover top, inner1 and bottom; inner1 also carries signals.

Retained warnings: Q1/TH1 reference-prefix conventions; Q1 IC-style power/ground attributes; F1/D1/TH1 schematic-reference association. Visible reference text and electrical connections remain checked. No warnings or DRC were suppressed. The C7 orientation heuristic is advisory and its existing connected copper passes routing checks.

The separate PCB-bitmap shorts mode is not claimed as passing; the completed shorts check uses exported Gerber artwork. Manufacturer CAM, component reservation and assembly preview have not been accepted. [Order readiness and settings](ORDER_READINESS.md).
