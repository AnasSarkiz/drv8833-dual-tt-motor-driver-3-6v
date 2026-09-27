# Working reference board comparison

Reviewed 2026-09-27 from the public tscircuit source, without rebuilding, routing, or modifying the reference board.

The user reports that an ordered board from [imrishabh18/rp2040-motor-controller](https://tscircuit.com/imrishabh18/rp2040-motor-controller) works. The exact ordered revision is uncertain. The latest release is **1.0.28**, dated September 26; its own README identifies **1.0.21** as the previously delivered iteration. That makes 1.0.21 a useful additional comparison, not a confirmed identification of the user's hardware. The user's report is recorded as physical-use evidence for their unit; no new measurements were performed here.

| Item | Delivered-iteration reference, v1.0.21 | Latest reference, v1.0.28 | Dual TT draft |
|---|---|---|---|
| Motor/control architecture | DRV8847, RP2040, NEMA 17 application | DRV8825, RP2040, STEP/DIR | DRV8833; two independent TT motors; external controller |
| Motor supply design | 9 V USB-PD | 20 V USB-PD | 3–6 V at the input terminal |
| Mechanical design | 42.30 × 42.32 mm motor cap; 31 mm mounting square | Same NEMA 17 outline | 75 × 60 mm chassis module; 65 × 50 mm mounting centers |
| Input protection/storage | 2 A PTC, SMBJ11CA, 220 µF bulk | PTC, reverse-current diode, SMBJ22CAQ, 22 µF/50 V bulk | Low-loss MOSFET, 3 A non-resettable fuse, SMBJ6.0A, 2 × 220 µF bulk |
| Temperature interface | TMP102 plus hardware sleep interlock and firmware | Same general interlock architecture | NTC output to host; no automatic cutoff |
| Minimum via sizes | 0.30 mm drill / 0.45 mm pad | 0.30 mm drill / 0.45 mm pad | Same minimums; four declared thermal vias are larger |

Version-specific sources: [v1.0.21](https://tscircuit.com/imrishabh18/rp2040-motor-controller?version=1.0.21), [v1.0.28](https://tscircuit.com/imrishabh18/rp2040-motor-controller?version=1.0.28). Retrieval identifiers and source hashes are in `references/rp2040-reference.json`.

## Changes and decisions from this comparison

- **Check ground by electrical connectivity.** Matching labels can hide separate ground networks across nested circuits. New tests traverse actual source-trace and internal-connection edges, check all 30 required ground returns, and keep power, outputs and sense inputs separate from ground. A deliberate exposed-pad disconnection with another net still named GND must be detected. These are logical checks; physical ground continuity remains a post-routing check.
- **Retain local bypassing and short high-current loops.** The reference uses local capacitors and wider motor/power copper. Apply that placement/routing principle with our driver's pin map and current/thermal calculations; copying its nominal widths would not establish our current rating. No copper was added in this review.
- **Review an outside-pad thermal-via option.** The latest reference places six tented thermal vias beyond its driver pad. This is a useful manufacturing alternative to evaluate for our U1. It does not yet replace our declared four-via, filled/capped option: the packages, heat paths, and paste requirements differ.
- **Keep the TT electrical and mechanical requirements.** The reference's NEMA 17 hole pattern and 9/20 V supply circuits do not establish fit or suitability for 3–6 V TT motors. TI specifies an 8.2 V minimum for DRV8825, so it cannot replace DRV8833 in this input range. See the [DRV8825](https://www.ti.com/lit/ds/symlink/drv8825.pdf) and [DRV8833](https://www.ti.com/lit/ds/symlink/drv8833.pdf) datasheets.
- **Keep temperature claims accurate.** The reference's autonomous temperature interlock is a separate function from our raw NTC output. Our host remains responsible for temperature handling; no interlock or onboard MCU was added.

The reference uses different pinned dependencies and board-specific patches. Its successful hardware use and automated checks are useful evidence, but do not resolve the independently reproduced schema failures in our current pinned toolchain. Power-spike, current, thermal, and assembly limits in PRE_ROUTING_REVIEW.md remain open. Routing remains disabled.
