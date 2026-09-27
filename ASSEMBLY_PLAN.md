# Assembly plan — review incomplete

39 purchased SMD parts on TOP; 7 through-hole connectors inserted from TOP (3 terminals and 4 headers). Seven test pads and four footprint thermal vias are PCB features. No bottom purchased components. No DNP parts. No approved substitutions. Assembly of an unrouted PCB is not authorized or useful.

TOP SMT reflow precedes manual/selective through-hole soldering. JLC catalog stock does not establish turnkey THT assembly. Service eligibility, sourcing fees, panelization, minimum board constraints and final quote remain unverified.

Inspect U1 pin 1 and soldered exposed pad; confirm Q1 G/S/D orientation, TVS cathode, both bulk capacitor positive pads and every LED polarity. Red and green imported LEDs have different numeric anode/cathode mappings; connections use semantic labels. Verify connector drills against actual pin diagonal and tolerances before release.

The imported U1 lead pads are approximately 0.35 × 1.30 mm, row centers ±2.85 mm, pitch 0.65 mm; exposed pad is 2.74 × 2.74 mm. TI's PWP0016C example uses 0.45 × 1.50 mm lead pads, row span 5.8 mm and 2.46 × 2.31 mm exposed opening (rotated to the import orientation as appropriate). Alternative land patterns may be valid, but this difference is not yet justified. Its four vias require an explicit fill/plug/tent and stencil/paste review; no completed process approval is claimed.

Thermal-pad paste, reflow profile, moisture handling, tall capacitor clearances, screw/tool access, header mating access and motor-side solder-tail clearance remain blocked pending final geometry and exact process. CAD models exist as import URLs but have not been dimensionally verified. No 3D-fit PASS is claimed.

Mounting proposal: four M3 insulating standoffs, nominally 10 mm tall, with screws/washers contained within each 7 mm hardware zone. Hole positions and 2D courtyard clearances pass the mechanical check; standoff height, actual screw lengths, mating access and chassis fit are not physically verified. See MECHANICAL.md.
