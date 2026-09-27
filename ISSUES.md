# Observed tscircuit / toolchain issues

## Open

### TOOL-001 — Generated PCB component offsets violate pinned Circuit JSON schema

- First observed: 2026-09-27.
- Toolchain: tscircuit 0.0.2646, core 0.0.1971, CLI 0.1.2167, circuit-json 0.0.499.
- Reproduction: `tsci build index.circuit.tsx --routing-disabled`, then `bun scripts/check-schema.ts`.
- Expected: unmodified generated Circuit JSON validates against the installed schema.
- Actual: 57 PCB-component records contain numeric display_offset_x/display_offset_y; schema requires strings. The installed core writes resolved numeric offsets in NormalComponent PCB positioning. Current upstream schema was also inspected and still expects strings. The official core 0.0.1993 npm tarball was inspected separately: it still writes numeric component offsets. Dependencies were not changed.
- Evidence: `artifacts/pre-route/circuit.json`, `artifacts/pre-route/logs/schema.log`, `scripts/check-schema.ts`.
- Impact: the schema-aware routing guard and one integration test fail. Copper-specific negative fixtures pass, but the actual candidate gate does not.
- Safe workaround: none applied. Generated JSON, schema and tests are not patched or weakened. Proper next action is a supported upstream serialization fix and a reviewed version update/rebuild.
- Upstream report: none created; no external issue submission authorized.
- Status: OPEN, completed design review blocked; public source publication is authorized as an incomplete draft. Regression: actual-build test in `tests/routing-lock.test.ts` remains failing.

### TOOL-002 — Imported non-IC components produce generic-chip diagnostics

- First observed: 2026-09-27, same toolchain.
- Reproduction: import C474881/C49257/C15127/C20627123/C5331096/C13564 with exact footprints, instantiate with conventional reference prefixes, build unrouted.
- Actual: connector/fuse/MOSFET/TVS/NTC wrappers use `<chip>` and omit electrical attributes or custom symbol reference text. Generated output reports reference-prefix, underspecified-pin, missing-power/ground and styling warnings.
- Evidence: unchanged `imports/` modules, build log and Circuit JSON.
- Impact: physical geometry exists, but warnings cannot be read as completed electrical or schematic verification. Some missing supply-pin warnings are category artifacts for passive parts; real semantics still need source-level typed wrappers or a proper importer fix.
- Workaround applied: none. No warning suppression.
- Upstream report: none.
- Status: OPEN; explicit per-part semantic and symbol review required.

### TOOL-003 — tsci doctor registry configuration check fails

- First observed: 2026-09-27.
- Command: `tsci doctor`, both sandboxed and with network access.
- Actual: registry login check passes; global npm registry authorization-header check fails.
- Impact: registry package dependency setup is not proven healthy. JLC import/search worked and tscircuit dependencies installed from npm. The registry push subsequently SUCCEEDED: 125 files, public release 0.1.0-alpha.1-unrouted. This doctor check does not prevent this push. Registry dependency configuration remains a separate environment check.
- Credentials were not displayed or copied into the repository. Proper next action is the documented registry configuration flow if publishing requires it.
- Status: OPEN environment check; no global credential/config changes made.

### TOOL-004 — Additional generated IDs do not match the pinned schema

- The full schema log now also rejects six board-level silkscreen records with null pcb_component_id and four header pin-1 plated-hole records with null pcb_plated_hole_id.
- Source uses ordinary board-level silkscreen primitives and the unchanged C49257 import. No generated IDs are patched, no decorative components are invented, and no schema acceptance rules are loosened.
- Evidence: artifacts/pre-route/logs/schema.log; total 67 rejected records including TOOL-001. Proper action is an upstream generator/schema compatibility fix, followed by a reviewed toolchain update.
- Status: OPEN. The full project build and actual-output integration test remain FAIL.

## Resolved

The generic chassis arrangement and PUBLIC visibility are confirmed. These were user choices, not tool defects.

## Limitations investigated but not reproduced

No claim that native netlist/placement checks are no-ops: source inspection and real output confirm they run analysis. They can report issues while exiting successfully, so logs and Circuit JSON are reviewed rather than relying on exit codes. The initialization skill download was blocked by sandbox networking; the installed skill was available and read.

## Classified diagnostics

The latest generated JSON has 50 warnings: 9 reference-prefix, 11 underspecified-pin, 12 missing-power-pin, 11 missing-ground-pin, 4 schematic styling, and 3 connector-access warnings. Connector access is a design review blocker, not a confirmed tool defect. All remain visible in the evidence.
