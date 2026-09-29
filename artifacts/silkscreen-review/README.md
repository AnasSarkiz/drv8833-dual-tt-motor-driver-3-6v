# Bottom evaluation label — alpha.8

The bottom silkscreen reads:

> For evaluation only;  
> not FCC approved for resale.

Both lines use 1.8 mm lettering, centered at (0, 25) mm and (0, 22.5) mm. The exported stroke width is 0.162 mm. Visual inspection confirms clearance from through-hole pads, vias and mounting hardware zones. Bottom text is mirrored in the top-down layer drawing so it reads correctly when the physical board is viewed from underneath.

- [Bottom layer preview](../routed/pcb-bottom.png)
- [Fabrication artwork ZIP with the label](jlc-fabrication-bottom-label.zip)
- [Native combined export](dual-tt-bottom-label-gerbers.zip)
- [Artwork comparison and generated label records](verification.json)

Netlist: zero errors/warnings. Placement DRC: zero errors/warnings; the existing C7 orientation advisory remains. Format, TypeScript, build, schema, mechanical and physical-connectivity checks pass. All 27 existing tests / 1,139 assertions pass. No new tests or check exemptions were added for this silkscreen-only change.

All non-silkscreen PCB records and electrical connectivity records are identical to the previous build. After ignoring export timestamps and resolving aperture-number renumbering, comparison against the alpha.6 manufacturing artwork finds exactly one changed file: `B_SilkScreen.gbr`. Copper, drills, outline, top silkscreen, solder mask and paste are unchanged.

The fabrication ZIP contains only native Gerber/drill files. J1–J7 still require manual assembly; retain the existing separate SMT assembly files and manufacturing notes. The native combined export's all-component pick-and-place file still has the documented J4–J7 orientation warnings.

See [publication status](../../PUBLICATION.md) for GitHub and tscircuit verification. The older alpha.6 order packet remains a historical export without the new label. No stock refresh, production order or regulatory approval is implied.
