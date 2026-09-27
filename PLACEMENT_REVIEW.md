# Placement review — study only

The board has a fixed 75 × 60 mm outline, 1.6 mm thickness and four layers. Four 3.2 mm NPTH mounting holes form a 65 × 50 mm rectangle, with 7 mm diameter hardware reserves and keepouts on all four copper layers. This is the user-approved generic chassis-module arrangement; no specific chassis has been selected. See MECHANICAL.md and the dimensioned mounting template.

There are 53 logical physical features: 46 purchased parts plus 7 bare test pads. Circuit JSON contains 57 PCB component records because the four imported thermal vias also create records. All 46 purchased parts have TOP placement coordinates; bottom purchased count is zero; unplaced purchased count is zero. Through-hole pads span the board.

Latest placement check reports zero courtyard collisions and zero placement DRC errors, but three connector-access warnings remain; the orientation analysis reports no suboptimal placements. They are unresolved, not waived. Imported connector bodies/access still need independent drawing and mating-envelope checks. Schematic quality warnings remain; consult VALIDATION.md and logs.

TOP and BOTTOM review images and four schematic-sheet images are under artifacts/pre-route. They show an unrouted electrical study. All 53 courtyard envelopes are on-board and clear the screw/washer reserves by at least 0.5 mm; the closest is J7 at 0.732 mm beyond the reserved zone. The check is recorded in logs/mechanical.log. The template is dimensioned. Standoff fit, component-height envelopes, connector access and a selected chassis still require a 3D or physical fit check. Direct motor-shaft clearance is not a PCB mounting constraint because the motors are mounted separately. High-current corridors and sense/thermal layout still need to be designed within the approved mechanical boundary.

The retained thermal vias in the TI-derived footprint at U1 are explicitly allowlisted for review only. They are not connected to a plane because there are no copper pours. The minimum via rules are 0.30/0.45 mm; these retained vias are larger at 0.3048/0.6096 mm.

## Revision changes

J1 now faces left; J2/J3 face the bottom edge, with test pads moved clear of their cable entry. R19 was separated from TH1's legend. The U1 footprint was corrected; Q1/F1 changed to lower-loss parts. Native placement reports zero errors and warnings. This validates the native 2D checks, not screwdriver clearance, mating height, 3D body fit or thermal routing. The source retains the generic 75 × 60 mm outline and 65 × 50 mm mounting centers.
