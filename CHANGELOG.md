# Changelog

## 0.1.0-alpha.3 — routed prototype, 2026-09-27

Completed all signal/power routes and ground copper with six additional ground stitches. Preserved the 75 × 60 mm chassis outline, M3 mounting pattern and 0.30/0.45 mm via minima. Added validated native saved routes, strict physical-connectivity regression cases, all-layer previews and passing routing evidence. Canonical generator/schema fixes are included as explicit, reproducible local packages with source patches. Physical assembly/current/thermal qualification remains pending.


## 0.1.0-alpha.1 — electrical study, 2026-09-27

- Initialized isolated tscircuit workspace and pinned the stable tscircuit release.
- Imported 19 real supplier component types and drafted four electrical sheets.
- Added 0.30 mm via-hole / 0.45 mm via-pad minimums and source/build routing lock.
- Added negative guard tests and preserved the generated-schema failure.
- Recorded candidate BOM, sourcing results, preliminary calculations and open review gates.
- Added a 75 × 60 × 1.6 mm chassis-module outline, four 3.2 mm M3 mounting holes on 65 × 50 mm centers, four-layer hardware keepouts, measured courtyard checks and a printable template.
- Reoriented passive parts and moved the diagnostic header to clear the mounting hardware; placement orientation analysis is clean.
- User authorized public GitHub and tscircuit publication; actual results are in PUBLICATION.md. No routing or fabrication release.

## 0.1.0-alpha.2 — unrouted electrical and placement revision

Lower-loss Q1 and non-resettable F1; documented Littelfuse TVS; corrected NTC excitation and host input resistors; TI-derived U1 footprint/paste; manufacturer F1 footprint; native connector directions and electrical wrappers; pin/geometry/current-margin regression checks. Mounting remains 75 × 60 mm with four M3-clearance holes. Strict schema gate remains failing on documented upstream defects. Not approved for routing, fabrication or sale.

## Working-reference review — 2026-09-27

Compared the user's working RP2040 board's delivered-iteration and latest sources. Added logical ground-network and deliberately disconnected-ground regressions. Hardware, parts, dimensions and routing lock are unchanged; full schema validation still fails.
