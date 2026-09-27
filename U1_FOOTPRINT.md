# U1 footprint and thermal assembly review

Source: [TI DRV8833 datasheet](https://www.ti.com/lit/ds/symlink/drv8833.pdf), PWP0016C drawing 4224559/B, January 2019. `lib/driver-footprint.tsx` implements the land-pattern example rotated 90° so pin 1 is at bottom left. The supplier import is retained unchanged for provenance and its model/part identity; its original land pattern is not used.

| Feature | Implemented geometry |
|---|---|
| 16 lead pads | 0.45 × 1.50 mm; 0.65 mm pitch; rows at Y=±2.90 mm |
| Exposed-pad copper | 5.00 × 3.40 mm, covered by solder mask outside the opening |
| Exposed opening and paste | 2.31 × 2.46 mm centered; zero mask/paste expansion |
| Lead mask expansion | 0.05 mm per edge |
| Four thermal vias | 0.3048 mm drills, 0.6096 mm pads; exact positions in references/thermal-structures.json |

The two coincident pin-17 pads describe one electrical copper area and its smaller exposed center. The installed tool lacks per-side mask-margin implementation. This uses supported covered-pad and exposed-pad geometry; emitted copper/mask/paste records are tested. Export union/mask fidelity must be checked after routing approval before fabrication.

The four retained vias meet the requested 0.30 mm drill / 0.45 mm pad minima. They are a documented alternative to TI's illustrative via array; their thermal performance is not established by the drawing. They need **filled and copper-capped via-in-pad processing**, with a flat reflow surface. The TI stencil example is 0.125 mm thick. Confirm the exact process and paste coverage with the fabricator/assembler; no order or process acceptance exists yet.

These four holes are conductive thermal-via barrels, not mounting posts. With routing disabled they have no completed ground-plane connections. Final routing must connect exposed copper/vias to GND while keeping AISEN/BISEN separate until their shunts. Mechanical fit of the imported 3D model and prototype thermal behavior remain unverified.

`tests/design-connectivity.test.ts` checks all 17 physical pin nets, lead pitch/position/size, thermal copper/opening and emitted paste. The source routing guard hashes this reviewed footprint and allows only the four listed thermal vias. This document is a geometry review, not assembly approval.
