# Work required before routing

> Historical review from before routing. Current routing and validation status is documented in ROUTING_REVIEW.md and VALIDATION.md. Earlier routing holds/schema failures below describe that historical revision and are superseded.

Review date: 2026-09-27. The user wants a store product for common TT motors; the test bench's regulator does not define its sole power source. Target input remains 3–6 V at the connector including tolerance. Routing is disabled, with no routing approval requested for this incomplete revision.

The user's working RP2040 motor board is now a documented comparison in [REFERENCE_BOARD_REVIEW.md](REFERENCE_BOARD_REVIEW.md). Its delivered and latest designs differ; the comparison adds logical ground-connectivity regression coverage and an outside-pad thermal-via option for review. It does not change our hardware, supply target, or routing state.

## Completed in this revision

- Replaced Q1 with Vishay C222495 and F1 with Littelfuse C178991 to reduce power-path voltage loss. F1 is now a non-resettable fuse. Added actual physical pin-net regression coverage.
- Replaced D1 with documented Littelfuse SMBJ6.0A C83270 and audited the clamp/leakage data.
- Corrected R19 to 56 kΩ to meet the NTC measuring-current limit. Reduced host series resistors to 330 Ω for better high-level margin.
- Derived U1 lead, thermal-copper, mask and paste geometry from TI's drawing. Kept four documented thermal vias and established filled/capped via-in-pad as the proposed process.
- Added proper component wrappers, connector entry directions and pin attributes. Moved motor connectors/test pads and separated the TH1/R19 legends. Native 2D placement is clear.
- Expanded current-limit, thermal, host-first power, FAULT loading and TEMP calculations. No physical ratings are asserted.

## Open before a complete routing-approval package

| Item | Remaining work |
|---|---|
| Regenerative energy and source faults | Bound braking/reversal energy and repetition, hot TVS clamp plus layout overshoot, bulk ripple/ESR and fuse coordination. No universal supply compatibility claim. |
| Component qualification | Finish MLCC DC-bias, shunt TCR/pulse and exact passive/connector footprint review; resolve C25804 supplier stock. |
| Assembly and mechanical | Confirm via fill/cap and stencil process, Q1 paste/mask, connector drill fit, screwdriver/mating space and imported-model alignment. |
| Schematics | Add visible value/part annotations to the custom F1/D1/TH1 symbols and finish the page layout review. Remaining native orientation/padding findings are style suggestions, not electrical errors. |
| Software compatibility | Published core still emits schema-invalid offsets/IDs. Local reproductions and a tested partial generator fix exist; board-level silkscreen ownership additionally needs schema/API agreement. No generated output or validation has been patched. |

## Not a reason to delay independent work

A particular purchased chassis is not required: the accepted generic module is 75 × 60 mm with four 3.2 mm holes on 65 × 50 mm centers. It is not a universal chassis fit. Physical startup, overshoot, thermal, EMI and durability tests follow an approved routed prototype; they remain mandatory before selling a claimed performance rating. GitHub-to-registry automatic synchronization is separate from the PCB design.

The next review must present the updated BOM, all four schematics, assembly plan and placement together. Only explicit approval of that complete revision permits routing. See DESIGN_REVIEW.md, U1_FOOTPRINT.md, VALIDATION.md and ISSUES.md for evidence and limits.
