# Reproducible local generator fixes

These are **unpublished local builds**, not upstream releases. The board's package manifest and lockfile use the checked-in archives in `vendor/` explicitly. No installed dependency or generated board JSON is edited at runtime.

Canonical upstream commits are in `core-base.txt` and `circuit-json-base.txt`. The patches contain source changes, regression tests and visual snapshots. `scripts/rebuild-toolchain-fixes.py` fetches those exact sources into a new temporary directory, applies the patches, validates and packages them. It does not modify an existing tscircuit checkout.

The fixes make generated position metadata match its string schema, give rectangular-pad plated holes real generated IDs, omit absent component ownership on board mounting holes/artwork, and model board/group artwork ownership as optional in Circuit JSON. Invalid owner values still fail validation. Copper geometry and electrical checks are not weakened.

Validation: the schema suite passed 397 tests / 1,899 assertions. Core's focused regression tests, TypeScript and package/declaration build passed; the complete upstream core suite was not run. Logs are alongside the patches. All real board elements are still parsed against the complete schema.

No upstream issue, PR or npm publication has been made. These archives travel with this board for reproducibility while the canonical fixes await separate upstream review.

Saved-route fixes accept the actual copper layers of plated connector pads and preserve existing via contacts with their local trace widths. The six saved-route regression tests pass (39 assertions), including invalid anchors/layers/coverage and existing fanout cases. The generated board is still checked by the complete native routing checks. No electrical check is bypassed.
