# Assembly plan — prototype SMT packet

39 purchased SMD parts on TOP; 7 through-hole connectors inserted from TOP (3 terminals and 4 headers). Seven test pads, four footprint thermal vias and the routing/stitching vias are PCB features. No bottom purchased components. No DNP parts. No approved substitutions. The board is now routed; assembly process qualification and a fabrication order remain pending.

TOP SMT reflow precedes manual/selective through-hole soldering. JLC catalog stock does not establish turnkey THT assembly. Service eligibility, sourcing fees, panelization, minimum board constraints and final quote remain unverified.

Inspect U1 pin 1 and soldered exposed pad; confirm Q1 G/S/D orientation, TVS cathode, both bulk capacitor positive pads and every LED polarity. Red and green imported LEDs have different numeric anode/cathode mappings; connections use semantic labels. Verify connector drills against actual pin diagonal and tolerances before release.

U1 now uses the TI-derived footprint in `lib/driver-footprint.tsx`, with 0.45 × 1.50 mm lead pads, corrected thermal opening and explicit paste. See [U1_FOOTPRINT.md](U1_FOOTPRINT.md). Its four retained thermal vias require filled and copper-capped processing and assembler review of the 0.125 mm stencil example. No completed process approval is claimed.

Q1 is now Vishay C222495 in PowerPAK1212-8S. Imported lead pads are 0.405 × 0.990 mm with 3.860 mm overall row span; drain copper is 2.235 × 1.725 mm. These match [Vishay AN826 land dimensions](https://www.vishay.com/docs/72597/72597.pdf); lead pitch is 0.650 mm per the [current case outline](https://www.vishay.com/docs/63919/ppak1212-8s.pdf). Original pad 9 is exposed DRAIN, not ground. It must join pins 5–8 on VIN_FUSED. Reflow and under-package inspection are needed; hand-iron rework is not the recommended process. The generated stencil has been inspected; imported 3D model alignment is not dimensionally qualified.

F1 is now non-resettable Littelfuse C178991. Its raw import's oversized pads were replaced by `lib/fuse-footprint.tsx`: two 1.96 × 3.15 mm pads, 2.95 mm inner gap, from the [manufacturer recommended layout](https://www.littelfuse.com/assetdocs/fuse-451-and-453-datasheet?assetguid=533cd5cc-956c-4243-867f-6ab5a62f6ba1). Rounded printed dimensions give 6.87 mm outer span versus 6.86 mm annotated. The original imported model and part identity are retained. The fuse is unpolarized and now rotated 90° on the PCB for clearance.

Thermal-pad paste, reflow profile, moisture handling, tall capacitor clearances, screw/tool access, header mating access and motor-side solder-tail clearance remain blocked pending final geometry and exact process. CAD models exist as import URLs but have not been dimensionally verified. No 3D-fit PASS is claimed.

Mounting proposal: four M3 insulating standoffs, nominally 10 mm tall, with screws/washers contained within each 7 mm hardware zone. Hole positions and 2D courtyard clearances pass the mechanical check; standoff height, actual screw lengths, mating access and chassis fit are not physically verified. See MECHANICAL.md.

Alpha.5 manufacturing files are in [artifacts/order-release](artifacts/order-release/MANUFACTURING_NOTES.md). The actual Gerbers have 106 TOP paste flashes and no BOTTOM paste. Through-hole connectors and bare test pads have no paste. All 39 automatic SMT placements pass required JLCPCB supplier-orientation verification, including LEDs. The seven manual connectors are in their own BOM. These files resolve the prior export findings; final quote, CAM and assembly preview remain manufacturer steps.
