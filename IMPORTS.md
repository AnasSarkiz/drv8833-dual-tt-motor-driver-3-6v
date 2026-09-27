# Import audit

19 real imports completed with `tsci import C-number --jlcpcb --use-exact-footprint`. No fabricated packages. Original generated modules remain unchanged. The driver and XOR were imported individually; the remaining 17 imports have per-command logs and exit codes in `artifacts/pre-route/import-results.json`. All 19 current source hashes are in `artifacts/pre-route/import-hashes.json`.

An import is not an independent geometry review. DRV8833 pin labels match the PWP table; its land pattern differs from TI PWP0016C example dimensions and needs reconciliation. Its four imported thermal vias are listed in `references/thermal-structures.json`, including exact positions and sizes. No routing vias were added.

Observed importer limitations: multiple non-IC parts use chip primitives and incomplete electrical metadata. See ISSUES.md.
