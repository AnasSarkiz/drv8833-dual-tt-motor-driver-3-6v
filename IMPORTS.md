# Import audit

23 selected part types imported with `tsci import C-number --jlcpcb --use-exact-footprint`. No fabricated packages. Original generated modules remain unchanged. The initial imports have logs in `artifacts/pre-route/import-results.json`; revision imports have separate logs in `artifacts/pre-route/logs/`. Unused original imports are retained for provenance and are not BOM rows. The original import hashes remain in `artifacts/pre-route/import-hashes.json`; the current imports are included in `artifacts/routed/hashes.json`.

An import is not an independent geometry review. DRV8833 pin labels match the PWP table. The design uses the TI-derived land pattern in lib/driver-footprint.tsx; see U1_FOOTPRINT.md. Its four ground thermal vias are listed in `references/thermal-structures.json`, including exact positions and sizes. The routed revision adds signal/power and ground-stitching vias; see ROUTING_REVIEW.md. Raw import geometry is unchanged.

Raw non-IC imports use generic chips. lib/parts.tsx supplies native electrical kinds, explicit connector entry directions and reference text while preserving the raw import files. U1 and F1 use separately reviewed manufacturer-derived footprints; see U1_FOOTPRINT.md and ASSEMBLY_PLAN.md. D1 was re-imported as Littelfuse C83270; R4–R7 use C23138 and R19 uses C23206. Q1 now uses Vishay C222495 and F1 uses non-resettable Littelfuse C178991. Import logs are retained. See ISSUES.md.

Alpha.6 adds C318884 (native pushbutton) and C25803 (100 kΩ resistor), imported with the same exact-footprint command. R8 reuses C4190 (2.2 kΩ). Raw imports remain unchanged; button contact pairs are declared by the board circuit using the reviewed manufacturer drawing. New logs and identity records are in `artifacts/button-review/`.
