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

### TOOL-002 — Imported component kinds and native pin-check coverage

- Source: real exact-footprint supplier imports use generic chips for non-IC parts.
- Implemented: typed wrappers in `lib/parts.tsx` provide native connectors, fuse, diode and thermistor semantics, entry directions and reference text; U1/U2 have explicit pin attributes. Raw imported geometry remains auditable.
- Q1 now has nine footprint pads, with the repeated source/drain terminals specified and tested. The installed native MOSFET API only accepts three logical pins, so the nine-pad device uses a generic chip and all pins require connection. The native power/ground check treats every multi-pin chip as an IC and reports two missing-supply warnings. Q1 is a discrete switch with no separate IC supply pins; assigning fake supply requirements would misrepresent it. These two warnings are classified and remain visible.
- Build reference-prefix warnings for Q1 (generic chip) and TH1 (NTC represented as a resistor) are likewise classified; reference designators are deliberate. No diagnostic suppression was added.
- Status: source definitions improved; multi-pin MOSFET modeling/check coverage remains a tool limitation. Per-pin regression assertions protect the actual connections independently.

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

## Local generator investigation

See [references/core-schema-fix/README.md](references/core-schema-fix/README.md) for the isolated core 0.0.1993 checkout, exact base commit, source patch and before/after regression logs. The prepared fix covers component/group offset strings and automatic rectangular-pad hole IDs. Five focused tests, typechecking and package/declaration build pass. No local dependency link, generated-JSON patch, released version or upstream acceptance is claimed.

Board/group silkscreen additionally requires a coordinated schema/API change: changing null owner IDs to undefined still fails the current required-string contract. The separate failing reproduction is retained. This is why the partial generator patch cannot make this project's full gate pass.

### TOOL-005 — Schematic pin-spacing prop ignored by core

During schematic review, `schPinSpacing` was accepted by the installed props but emitted pins remained at 0.2 mm spacing. Current core's `_computeSchematicBoxDimensions` also hard-codes `const pinSpacing = 0.2`. No core patch for this has been applied. The board source removes the ineffective prop and uses documented per-pin margins to separate functional power/sense groups; current previews show the actual result. No upstream report submitted.

## Classified diagnostics

The native pin check now reports zero errors and two Q1 category warnings described above. Native placement reports zero errors and warnings. Schematic orientation/padding suggestions remain visible and are reviewed separately; they are not routed DRC. All actual schema failures remain blocking. Updated command results are in VALIDATION.md and artifacts/pre-route/check-results.md.

An earlier sandboxed build emitted 46 supplier-part lookup warnings because network requests failed. The final network-enabled build completed the lookups with zero part-not-found warnings. This was an environment restriction, not evidence that those parts are unavailable. The separate C25804 assembly-stock query remains unresolved.
