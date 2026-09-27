# Chassis mounting — revision A study

The user selected a standalone chassis-mounted module and has not selected a chassis. The PCB uses ordinary M3 hardware with a **custom 65 × 50 mm rectangular hole pattern**. This is a practical module size, not a standardized pattern or a claim of direct fit to every TT chassis. Motors attach to their chassis or brackets separately; short wires connect them to J2/J3.

| Feature | Design dimension |
|---|---|
| PCB outline | 75 × 60 mm |
| Thickness / stack | 1.6 mm / four layers |
| Mounting holes | Four 3.2 mm non-plated holes, for M3 screws |
| Hole centers | 65 × 50 mm; each center 5 mm from two adjacent edges |
| Coordinates about board center | H1 (−32.5, +25), H2 (+32.5, +25), H3 (−32.5, −25), H4 (+32.5, −25) mm |
| Hardware reserve | 7 mm diameter at every hole, copper keepout on all four layers |
| Proposed spacers | Four M3 insulating standoffs, 10 mm tall; check actual solder-tail clearance |
| Via minima | 0.30 mm drill / 0.45 mm copper pad; these are unrelated to mounting-hole size |

[Mounting template](artifacts/pre-route/mounting-template.svg) is drawn in physical millimeters. Print at 100% and check the 50 mm scale with a ruler. It is a mechanical review aid, not a PCB fabrication package. The canonical dimensions are in `references/mechanical.json`; source holes, keepouts and template use that file.

Use a flat chassis deck or adapter that accepts this hole rectangle, with room beyond the board for wiring. Do not drill a purchased chassis until you check its motor, wheel, battery and structural clearances. Use insulating standoffs over metal; washers and screw heads must fit within the reserved 7 mm diameter. Clearance to connector housings, mated plugs, wire bends and the screwdriver requires a physical or verified 3D check. Vertical headers need access from above; screw terminals also need top tool access. Fastener lengths depend on the actual chassis thickness and standoff thread depth and are not selected yet.

The real generated output is checked for board size, all four holes/keepouts and all 53 component/test-pad courtyard envelopes by `scripts/check-mechanical.py`. Each component courtyard must clear every hardware reserve by at least 0.5 mm. This geometric check is independent of, and does not bypass, the failing full Circuit JSON schema gate.

Research supports the mounting arrangement: [Adafruit's TT chassis](https://www.adafruit.com/product/3796) places the TT motors on its side walls and provides holes/slots for controller boards on the deck. Its [dimension drawing](https://cdn-shop.adafruit.com/product-files/3796/3796_diagram_2.jpg) does not define a universal controller-board pattern. That discontinued chassis was used as a reference only; this PCB is not advertised as matching its existing holes. Actual chassis fit and enclosure heights remain unverified until a chassis is selected.
