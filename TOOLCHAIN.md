# Toolchain

Pinned on 2026-09-27. Bun 1.3.9; TypeScript 5.9.3; Biome 2.5.14. `bun.lock` is the dependency lockfile. Registry automatic dependency upgrades are disabled.

| Package | Version |
|---|---|
| tscircuit | 0.0.2646 |
| @tscircuit/cli | 0.1.2167 |
| @tscircuit/core | 0.0.1993-dualtt.6, local archive |
| @tscircuit/circuit-json-util | 0.0.116-dualtt.1, local archive |
| circuit-json | 0.0.506-dualtt.1, local archive |
| @tscircuit/props | 0.0.666 |
| @tscircuit/checks | 0.0.221 |
| @tscircuit/capacity-autorouter | 0.0.938 |

The three active local archives in `vendor/` are unpublished builds from canonical upstream source, not npm releases. Exact base commits, complete patches, tests and logs are in [references/toolchain-fixes](references/toolchain-fixes/README.md). Fixes cover position metadata serialization, real plated-hole IDs, optional board-artwork ownership, physical layer anchors on saved routes at plated connectors, and preservation of local trace widths beside saved vias. Electrical and copper-clearance checks remain unchanged.

The schema suite passed 397 tests / 1,899 assertions. Focused core regression tests, TypeScript and package/declaration builds passed; six saved-route regression cases passed 39 assertions. The complete upstream core suite was not run. `scripts/rebuild-toolchain-fixes.py` documents a clean rebuild from the pinned upstream sources; that complete helper has not been executed from scratch. No installed dependency or generated board JSON is patched at runtime, and the user's separate core checkout was not changed.

`index.circuit.tsx` is the canonical board entrypoint. `lib/saved-routing.ts` holds native-generated route paths consumed through the supported `autoroutingphase` API. All 32 non-GND nets are explicitly assigned to this phase; GND is joined by pours and authored stitching. The default rerender validates route anchors and recreates the copper. `routeRemaining={false}` prevents an extra autorouting pass; it does not disable full physical-connectivity or routing checks.

Commands used for final validation: `tsci check netlist`, `tsci check placement`, `tsci check pin_specification`, `tsci check source`, `tsci check trace-length net.VM`, `tsci build`, native `runAllRoutingChecks`, full schema parsing, project tests, mechanical checks and Gerber-mode shorts. `bun run render` converts unmodified generated Circuit JSON to images.

The earlier partial investigation in `references/core-schema-fix/` is historical. The complete fixes above supersede its unresolved status. No upstream issue, PR or npm publication was made.

The registry runtime preloads dependency symlinks and does not provide Python. The mechanical gate therefore also has a native Bun/TypeScript implementation, equivalent to the original Python check. The cloud build command performs a forced frozen-lockfile install before the complete project build, so preloaded libraries cannot create a mixed dependency graph. No check is omitted.

Alpha.5 additionally removes automatic paste from THT pads, resolves two-terminal orientation with sub-micron imported coordinate rounding, invalidates old unknown-orientation cache entries, and supports outline keepouts in the current schema. No footprint coordinates, polarity or copper are changed by the orientation classifier. Six new/updated assembly regression cases pass; all 25 board tests pass. The utility library’s full run had 137 passes and one unrelated renderer-snapshot mismatch. The core artwork snapshot also differs in one path’s rendering. Both mismatches were reproduced with the prior source and left unchanged; baseline evidence is in references/toolchain-fixes. Type/declaration builds and the changed-function tests pass. The rebuild helper is a source recipe; a complete fresh dependency rebuild has not been rerun.
