# Placement review — routed prototype

The outline is 75 × 60 × 1.6 mm with four copper layers. Four 3.2 mm NPTH holes form a 65 × 50 mm rectangle, with 7 mm hardware keepouts on all layers. This is the accepted generic chassis-module arrangement, not a specific chassis fit claim.

All 47 purchased components are on top, together with seven bare test pads. There are 54 checked courtyards and 64 PCB-component records (including ten explicitly authored thermal/ground vias). Native placement DRC reports zero errors and warnings; the CLI’s separate C7 orientation suggestion is advisory. Every courtyard is inside the outline and clears each hardware reserve by at least 0.5 mm; J7 is the closest at 0.732 mm beyond the hardware zone. See `artifacts/order-release/logs/build.log`.

J1 faces the left edge; motor connectors J2/J3 face the bottom. The shunts are adjacent to the driver, with nearby ground stitches. C3/C4 and the sense/VM test-pad positions were adjusted to permit clean routing. U2's 2D courtyard is clear. Four layer previews are in `artifacts/routed/`.

The four U1 holes are conductive thermal vias, not mounting posts. Their 0.3048 mm drills / 0.6096 mm pads exceed the requested minima and now connect to GND copper. Six further ground stitches support the shunts, C3 and logic ground; all routes and pours are checked together for physical continuity.

Connector mating envelopes, tool access, standoff height, imported 3D model alignment and physical chassis fit remain unverified. Routing and 2D checks do not establish thermal performance or assembly readiness. See ASSEMBLY_PLAN.md and TEST_PLAN.md.

Alpha.5 capacitor positions: C3 (−4.3, 6.5), C4 (4.3, 7), C5 (−0.975, 5.65), C6 (0.975, 5.65) mm. C5/C6 rotate 90°. Both small-capacitor pin routes are now 2.05 mm without vias. All affected routes and courtyards were rechecked.
