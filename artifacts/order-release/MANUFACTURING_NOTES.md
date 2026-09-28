# Dual TT motor driver — alpha.6 prototype fabrication and assembly

Quantity: 5 PCBs. Board: 75 × 60 mm, 1.6 mm thick, FR-4, four layers. Stack: F_Cu / In1_Cu / In2_Cu / B_Cu. Outer copper 1 oz; inner copper at least 0.5 oz. No controlled-impedance requirement. Green solder mask, white silkscreen, ENIG finish.

**Via covering: Epoxy-filled & Capped (resin filled, copper plated over, flat).** Apply to all 0.3000 mm and 0.3048 mm via drills, including the four thermal vias under U1. Do not substitute tenting or ink plugging. Do not fill connector plated holes or the four 3.2 mm non-plated mounting holes. Follow the supplied mask openings. Keep mounting holes non-plated.

U1 via centers, in Gerber/board coordinates (mm): (+0.500126,+0.499872), (-0.499872,+0.499872), (+0.500126,-0.500126), (-0.499872,-0.500126). Verify the exact drill positions against the supplied drill file and thermal-structure reference before CAM approval. U1 has 0.3048 mm via drills and 0.6096 mm pads; other vias have ≥0.30 mm drill / ≥0.45 mm pad.

TOP SMT assembly only: 40 components per PCB, 200 placements in this batch. Use jlc-smt-bom.csv and jlc-smt-cpl.csv together. CPL units are mm; origin is the board center, X right/Y up. Do not add an origin offset to only one file. All SMT rotations were matched to supplier footprints. Confirm pin 1 and polarity in the assembler’s preview: U1, U2, Q1, D1, C1/C2 and LED1–LED5. Confirm SW1 contact-row orientation against the supplied placement file; 90° rotation is not interchangeable.

J1–J7 are fitted and soldered manually after reflow, all inserted from TOP; not included in the automated SMT BOM/CPL. Supply 15 KF301-5.0-2P terminals and 20 straight 1×3 2.54 mm headers for five boards. Square header pads identify pin 1. Match J1/J2/J3 wire-entry direction to the outline drawing. Bare TP1–TP7 need no components or paste.

Stencil: TOP only, 110 apertures; B_Paste is empty. Start assembler review with 0.125 mm thickness, matching the TI U1 stencil example. U1 exposed-pad aperture is 2.31 × 2.46 mm; solderable exposed opening is the same. Confirm paste/reflow suitability and inspect U1/Q1 hidden joints. Use manufacturer lead-free reflow limits and moisture handling.

Select confirmation of production files. Confirm filled/capped via-in-pad processing, SMT placement preview, finished mask/paste and component availability before releasing production. C876469 has only 12 available-to-order units for 10 placements at the recorded stock check; quote loss allowance and reserve stock. No substitutions without electrical/footprint review.

Source: https://jlcpcb.com/help/article/pcb-via-covering and the checked-in U1_FOOTPRINT.md. This packet is an engineering prototype, without an established continuous-current or thermal rating.

SW1 is a momentary HOLD TO DISABLE control: motors coast while held; releasing can restart them. It does not disconnect supply power. After assembly, verify released/pressed contact mapping with no motors attached before the first powered test.
