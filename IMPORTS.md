# Import audit

21 selected part types imported with `tsci import C-number --jlcpcb --use-exact-footprint`. No fabricated packages. Original generated modules remain unchanged. The initial imports have logs in `artifacts/pre-route/import-results.json`; revision imports have separate logs in `artifacts/pre-route/logs/`. Unused original imports are retained for provenance and are not BOM rows. All current source hashes are in `artifacts/pre-route/import-hashes.json`.

An import is not an independent geometry review. DRV8833 pin labels match the PWP table. The design uses the TI-derived land pattern in lib/driver-footprint.tsx; see U1_FOOTPRINT.md. Its four ground thermal vias are listed in `references/thermal-structures.json`, including exact positions and sizes. No routing vias were added.

Raw non-IC imports use generic chips. lib/parts.tsx supplies native electrical kinds, explicit connector entry directions and reference text while preserving the raw import files. U1 and F1 use separately reviewed manufacturer-derived footprints; see U1_FOOTPRINT.md and ASSEMBLY_PLAN.md. D1 was re-imported as Littelfuse C83270; R4–R8 use C23138 and R19 uses C23206. Q1 now uses Vishay C222495 and F1 uses non-resettable Littelfuse C178991. Import logs are retained. See ISSUES.md.
