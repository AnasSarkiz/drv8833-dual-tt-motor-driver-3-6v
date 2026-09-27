# Order review — HOLD

Reviewed the public routed revision `0.1.0-alpha.4-routed`, source commit `f57b21c`, on 27 September 2026 for **five boards**. The board is routed, but **the current files are not approved for an assembled-board order**. This audit did not change the circuit, footprints or copper. No order or component reservation was made.

## What passed

- Fresh native netlist and placement checks; full build, strict Circuit JSON schema, mechanical/routing guards and native routing checks.
- All 22 existing tests, including physical-connectivity negative controls. Seven previously classified source/schematic warnings remain; see [VALIDATION.md](VALIDATION.md). No electrical/routing errors were reported.
- Gerber-based shorts check, all four copper layers, at 40 pixels/mm: **no shorts detected**. This checks generated artwork, not a physical manufactured board.
- Supplemental measurement of **all 70 trace records / 587 nonzero planar segments**, all 64 vias and connector/mounting drills: no measured drill-to-trace, drill-to-pad, drill-to-pour or plated-drill-spacing violation against the reviewed JLC limits. The four M3 mounting holes remain non-plated with their hardware clearances.
- All **21 exact JLCPCB part numbers** have enough listed available-order quantity for the **230 components placed across five boards**, before the assembler's final attrition allowance. See the [dated stock table](artifacts/order-review/STOCK.md).

Evidence: [check results](artifacts/order-review/checks.json), [native build log](artifacts/order-review/logs/build.log), [shorts log](artifacts/order-review/logs/shorts-gerber.log), [per-trace inventory](artifacts/order-review/trace-inventory.csv), [measured geometry](artifacts/order-review/trace-geometry.json). The separate PCB bitmap shorts mode is not claimed as passing; the completed shorts evidence uses Gerber mode.

## Items to resolve before ordering

| Priority | Finding | Required action |
|---|---|---|
| Layout | U1 AISEN → R2 is 8.58 mm long, including **4.63 mm at 0.25 mm width** and 2.57 mm at 0.30 mm. This path carries bridge current, not just a high-impedance measurement signal. | Shorten/widen the current return and review shunt placement and ground return. Include trace resistance in the current-limit estimate. Passing minimum-width DRC does not establish the intended current rating. |
| Layout | U1 VINT → C5 takes **8.80 mm and two layer transitions**; VCP → C6 takes 7.02 mm with two transitions. | Bring these connections closer and simplify the bypass/charge-pump loops, then rerun routing and shorts checks. TI calls for these capacitors close to their pins. |
| Assembly export | The exported stencil contains **127 top and 14 bottom paste flashes**, despite having no bottom SMD parts. Paste exists at all 14 circular through-hole pads on both sides, and all seven bare test pads on top. | Remove unintended paste in the canonical footprint/source settings, regenerate the export, and review the actual stencil. The plan is SMT followed by THT soldering, not an approved pin-in-paste process. |
| Assembly orientation | The exporter explicitly cannot verify rotations for **LED1–LED4**, and for the four headers J4–J7. | Verify supplier pin-1/polarity orientation and assembly preview. Supply a reviewed CPL; separate manually fitted connectors if that remains the chosen assembly process. |
| Fabrication process | The four thermal vias under U1 are inside its exposed solder area. | Specify and obtain a quote for **filled and copper-capped via-in-pad** processing and review thermal-pad paste with the assembler. Ordinary tenting is not the documented process for this footprint. |
| Sourcing | R2/R3, **C876469**, need 10 placements. The page shows 37 in stock but only **13 available to order**. | Confirm the PCBA loss allowance and availability immediately before releasing the order. A replacement would need electrical and footprint review; none was silently substituted. |

The narrow power-track finding is a layout recommendation based on the actual current path, not a claim that 0.25 mm automatically fails JLC fabrication. As a rough check, a 35 µm copper centerline model gives about 14 mΩ for the AISEN route before accounting for pad spreading, ground return, tolerance and temperature. That is significant relative to the 150 mΩ shunt; it is not a calibrated current-limit or thermal model.

TI's [DRV8833 layout guidance](https://www.ti.com/lit/ds/symlink/drv8833.pdf), section 10.1, supports short local VM/VINT/VCP connections. Its [motor-driver layout guide](https://www.ti.com/lit/an/slva959b/slva959b.pdf) explains minimizing current-path impedance and keeping shunts close to the power stage. The latter's separate differential-amplifier examples are not a requirement to add differential sensing pins to this DRV8833.

## Trace-shape review

All four rendered copper layers and all 70 individual paths were inspected. The [three trace sheets](artifacts/order-review/trace-atlas-1.svg), [sheet 2](artifacts/order-review/trace-atlas-2.svg), [sheet 3](artifacts/order-review/trace-atlas-3.svg) isolate every path; each panel is individually scaled, with actual width and length listed. They supplement the board-layer views; they are not a substitute for clearance checks.

Ten routes have centerline turns over 90° after excluding sub-0.05 mm rounding segments. These are **review flags**, not ten shorts or ten fabrication failures:

| Saved route index | Net | Assessment |
|---:|---|---|
| 12 | VM | Small reversal at a capacitor pad; largely absorbed in wide pad/track copper. Simplify when rerouting. |
| 13 | VM | Tiny same-net centerline crossing/backtrack near (-17.5, 1.25) mm; the 1 mm copper merges into a solid bend. Not a short between nets. |
| 19 | VIO | Unnecessary bends/backtrack in the C7 bypass route on inner2. Shorten the local bypass connection. |
| 26 | BOUT1 | Small bend during a width transition; review alongside the motor-current neck widths. |
| 35 | FAULT_N | Small via-approach jog; cleanup item. |
| 47 | BIN1 | Extra bend near U2 routing and three layer transitions; simplify if local placement is adjusted. |
| 52 | VINT | Bypass detour described above; prioritize this over cosmetic cleanup. |
| 58 | A_CMD | Hairpin near (-2.684, 16.860) mm on inner1; simplify. |
| 59 | B_CMD | Backtrack near (7.611, 11.177) mm on inner1; simplify. |
| 66 | TEMP | Very short reversal near a via; cleanup item. |

The remaining paths have no flagged substantial acute centerline turns or proper self-crossings under this measurement. Their complete width distributions remain in the geometry report. AOUT2 also has 2.95 mm at 0.25 mm width; VM and other outputs have narrow pin escapes. These need review as complete current paths, including vias and the selected copper weights. The long TEMP_RAW route is about 45.75 mm; assess PWM noise coupling during prototype tests.

## Fabrication and assembly limits

The requested **0.30 mm drill / 0.45 mm pad** is consistent with JLCPCB's current rigid-board via guidance: the diameter difference is 0.15 mm. Do not confuse the separate component-PTH annular-ring rule with the via rule. The smallest component-PTH radial ring here is approximately 0.237 mm. All routed traces are at least 0.25 mm wide. These dimensions are feasible; they do not approve the whole assembly. [JLCPCB rigid-board capabilities](https://jlcpcb.com/capabilities/pcb-capabilities).

The minimum measured different-net via-drill-to-trace clearance is 0.325 mm; via-drill-to-pad is 0.300 mm, and via-drill-to-pour is 0.273 mm. Keep four-layer stack-up/copper weights explicit in the order. Three silkscreen labels use 0.8 mm text (`U1`, `F1`, and the voltage/prototype label), below JLC's listed 1 mm text-height guidance; enlarge them for legibility before release.

The [JLC via-covering guide](https://jlcpcb.com/help/article/pcb-via-covering) describes filled/capped options and limits; use the correct option and identify the four U1 thermal vias. A final quote, BOM/CPL match, polarity review, stencil review and CAM acceptance have not been completed. The review export is deliberately named `review-only-NOT-FOR-ORDER.zip`.

After these layout and assembly items are closed, a five-board **engineering prototype order** can be considered. Physical motor startup/stall, braking/regeneration, supply tolerance, temperature and current-limit testing then establish operating limits. Those tests are required before a store release; they are not a circular prerequisite to obtaining the first engineering prototypes.
