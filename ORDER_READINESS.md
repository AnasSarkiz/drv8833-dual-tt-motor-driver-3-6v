# Order readiness — five-board engineering prototype

The alpha.6 layout and manufacturing exports pass the design checks. The earlier current-path, capacitor-placement, stencil and SMT-orientation findings are resolved. **The files are ready for a five-board prototype quote and final manufacturer preview. No order has been placed or accepted.**

## Button revision

SW1 now provides **HOLD TO DISABLE** control. R8 is 2.2 kΩ and R13 is 100 kΩ to limit pressed GPIO current while preserving enable-high margin. Release may restart motion. Use this alpha.6 packet for the button-equipped board; the previous alpha.5 artwork has no button. [Circuit, contact mapping and validation](BUTTON_REVIEW.md).

## Resolved

- U1 AISEN→R2 is now 7.75 mm long: minimum 0.40 mm, only 1.82 mm below 0.60 mm, and 4.30 mm at 1.00 mm. Previously it included 4.63 mm at 0.25 mm. A simple 35 µm copper estimate falls from about 14 mΩ to about 5.6 mΩ; this is not a calibrated current or thermal rating.
- VINT→C5 and VCP→C6 are each 2.05 mm, on top copper without vias. Previously they were 8.80 mm and 7.02 mm with two layer transitions each. C3/C4 and nearby routes were adjusted to maintain clearance.
- Actual Gerber paste: **110 top apertures, zero bottom apertures**. No paste on any bare test pad or through-hole connector. Through-hole paste was corrected in the canonical generator source.
- All **40 automated SMT placements**, including all five LEDs, pass required supplier-orientation verification. A sub-micron imported LED offset and stale orientation cache were corrected in the generator toolchain. Supplier data confirm the local pin-1 polarity. The unkeyed J1–J7 connectors are deliberately in a separate manual assembly list.
- Via minima remain **0.30 mm drill / 0.45 mm pad**. Four 3.2 mm mounting holes remain non-plated. Filled/capped processing is explicitly specified in the manufacturing notes.

## Evidence

Native netlist: zero errors/warnings. Placement DRC: zero errors/warnings. Build, strict schema, mechanical gates and fresh native routing checks pass. All **26 board tests / 1,139 assertions** pass. The all-layer Gerber shorts check at 40 px/mm reports **no shorts**. Measurement covers all 72 traces, 544 segments and 60 vias, with no measured drill-clearance violations. See [logs](artifacts/order-release/logs), [geometry report](artifacts/order-release/trace-geometry.json), [layer previews](artifacts/routed/pcb-top.svg).

The placement command returns an advisory C7 rotation suggestion even with zero placement DRC errors. Its existing connected route passes copper checks; it was left alone. Harmless same-net bends, seven classified schematic/model warnings and small silkscreen text were also left alone as requested. No DRC or test was disabled.

## Files and order settings

- Upload [fabrication artwork](artifacts/order-release/jlc-fabrication.zip).
- For top-side SMT assembly use [SMT BOM](artifacts/order-release/jlc-smt-bom.csv) and [verified SMT CPL](artifacts/order-release/jlc-smt-cpl.csv): 40 components per board.
- Obtain and fit [J1–J7 separately](artifacts/order-release/manual-tht-bom.csv): seven connectors per board, 35 for the batch.
- Apply [manufacturing notes](artifacts/order-release/MANUFACTURING_NOTES.md): four layers, 1.6 mm, 1 oz outer copper, at least 0.5 oz inner copper, ENIG and **Epoxy-filled & Capped** vias. Confirm production files so the via-in-pad finish and placement preview can be checked before production.

All 23 part types cover five-board placement quantities in the [fresh stock check](artifacts/order-release/STOCK.md). **C876469 is tight: 12 available to order for 10 placements.** The final quote must confirm loss allowance and reserve stock. Do not approve a silent substitute.

The native combined export is retained for provenance. Its full-board CPL warns about unkeyed J4–J7; use the separate SMT BOM/CPL supplied above, not that full-board CPL for automated placement. No assembler preview, paid quote, CAM acceptance or inventory reservation is claimed.

This release is for engineering prototypes. Motor startup/stall, supply spikes, temperature and continuous-current testing remain necessary before selling the board. They are not prerequisites to obtaining the first prototypes.
