# Validation — incomplete alpha.2 draft

All results below are automated checks or limited visual/analytical review, run on 2026-09-27. No simulation or physical measurement occurred. Actual source/artifact hashes are in artifacts/pre-route/hashes.json.

| Check | Status | Evidence / limitation |
|---|---|---|
| Pinned toolchain and TypeScript | PASS | TOOLCHAIN.md and logs/typecheck.log; dependencies unchanged |
| Logical netlist | PASS within native coverage | logs/netlist.log, 0 errors / warnings |
| Driver/protection physical pin mapping, NTC excitation, host margin, U1 pads/paste | PASS | logs/design-connectivity.log; emitted-output regression tests |
| Native pin specifications | PASS with classified warnings | logs/pin-specification.log: 0 errors, 2 Q1 category warnings; ISSUES.md TOOL-002 |
| Native placement | PASS | logs/placement.log: 0 errors, 0 warnings |
| Existing unrouted copper shorts | PASS within check coverage | logs/shorts.log; prebuilt JSON input, no router or Gerber export invoked |
| Source routing lock | PASS | logs/source-lock.log; only four declared thermal vias allowed |
| Routed-geometry inventory | PASS | 0 pcb_trace, 0 pcb_copper_pour; 4 declared U1 thermal vias |
| Full generated-schema guard / project build | FAIL | logs/schema.log and project-build.log; 67 rejected records, TOOL-001/004 |
| Complete test suite | FAIL overall | logs/tests.log; 13 pass / 1 actual-output schema test fails |
| Four schematic previews | PASS for generation | Four PNG/SVG sheets; functional groups and labels improved |
| Schematic final approval | BLOCKED | logs/schematic-placement.log; remaining style findings and final review |
| Sourced imports | PASS for import only | 46 purchased parts, 21 selected C-numbers; BOM.md and import hashes |
| Final component and assembly selection | BLOCKED | C25804 stock unresolved; passive/connector qualification and exact process not complete |
| Outline / mounting geometry | PASS in 2D | logs/mechanical.log: 75 × 60 mm, 4 × 3.2 mm NPTH, 65 × 50 mm centers, 53 courtyards |
| Particular chassis fit | NOT RUN | User chose a generic module; dimensioned template provided |
| U1 land/paste source geometry | PASS for reviewed emitted geometry | U1_FOOTPRINT.md and regression assertions; fabrication export fidelity still untested |
| 3D / filled-via assembly process | BLOCKED | Model alignment, body/tool envelopes and assembler confirmation remain open |
| Electrical protection / ratings | BLOCKED | DESIGN_REVIEW.md: hot-path loss, bus-energy/clamp, capacitor and shunt qualification |
| Physical routed connectivity | NOT RUN | NOT ROUTED — BY DESIGN |
| Prototype tests / selling readiness | NOT RUN | TEST_PLAN.md; no hardware evidence |
| Onboard MCU / crystal / programming | NOT APPLICABLE | External-controller module |
| Public publication | See PUBLICATION.md | Source publication is separate from build/approval success |

Top-view inspection confirms four mounting holes, separated component courtyards, corrected U1 thermal geometry and no routed copper. U2 is clear in the native 2D checks. These checks do not prove 3D clearance or thermal performance. The tested partial upstream generator patch is evidence only; this project still uses its published pinned dependencies and keeps the strict failing gate.
