# Native tscircuit checks — alpha.2 unrouted revision

Run 2026-09-27 with tscircuit 0.0.2646 / CLI 0.1.2167. Source and artifact hashes accompany this revision. Routing remains disabled.

| Command / scope | Result | Evidence |
|---|---|---|
| `tsci check netlist index.circuit.tsx` | 0 errors / warnings | [log](logs/netlist.log) |
| `tsci check source index.circuit.tsx` | See diagnostic-category output | [log](logs/source-diagnostics.log) |
| `tsci check placement index.circuit.tsx` | 0 errors / warnings | [log](logs/placement.log) |
| `tsci check pin_specification index.circuit.tsx` | 0 errors; 2 discrete-Q1 category warnings | [log](logs/pin-specification.log) |
| `tsci check shorts dist/index/circuit.json --mode pcb --layer all` | No shorts in existing copper | [log](logs/shorts.log) |
| `tsci check schematic-placement index.circuit.tsx` | Remaining style/readability suggestions retained | [log](logs/schematic-placement.log) |
| `bun run build` | FAIL at strict generated-schema guard | [log](logs/project-build.log) |
| `bun test` | 15 pass / 1 schema integration failure | [log](logs/tests.log) |

Shorts received prebuilt JSON; no routing solver or Gerber export ran. Native commands can return zero despite warnings, so results come from diagnostics, not exit status alone. Circuit output has no traces/pours and only the four allowlisted U1 thermal vias. Old placement-u1/u2 logs are historical evidence from the earlier study, not the current geometry. Current full-board placement supersedes them. Full schema failure is not hidden by clean native checks.
