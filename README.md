# Dual TT motor driver — UNROUTED / INCOMPLETE REVIEW

Hardware revision A-study; package 0.1.0-alpha.2. **NOT FOR FABRICATION.** This is an electrical draft, not an approved assembly-ready board. No routing approval has been received.

The reference motor is [Adafruit TT motor 3777](https://www.adafruit.com/product/3777). The user selected a **chassis-mounted board**, with the two motors mounted separately. The board is **75 × 60 × 1.6 mm**, with four **3.2 mm non-plated M3 holes on 65 × 50 mm centers**. Each screw/washer has a 7 mm diameter keepout on all four layers. This is a custom module pattern; no chassis has been chosen, so compatibility with existing chassis holes is not claimed. See [MECHANICAL.md](MECHANICAL.md) and the [printable mounting template](artifacts/pre-route/mounting-template.svg).

The four-layer source sets `routingDisabled={true}`, minimum via drill **0.30 mm** and minimum via pad **0.45 mm**. The four original driver-footprint thermal vias are 0.3048/0.6096 mm and exceed these minimums. They are explicitly listed in `references/thermal-structures.json`. There are zero signal/power routes or copper pours. Physical connectivity is **NOT ROUTED — BY DESIGN**.

The design has 46 purchased parts, 21 selected imported part types, five LEDs, seven bare test pads, separate A/B shunts and an NTC divider. Nominal current chopping is approximately 1.33 A/channel; this is not a continuous board rating. The 3–6 V motor input and 1 A/channel continuous objectives remain unverified. The revised low-loss MOSFET and non-resettable 3 A fuse improve the 3 V margin, but hot-path loss and regenerative transients remain unverified. See [DESIGN_REVIEW.md](DESIGN_REVIEW.md).

The product input target is 3.0–6.0 V **at the connector including tolerance**; the adjustable supply is for testing. F1 is non-resettable: diagnose the fault and replace the fuse after it blows. See the power-source and host interface conditions in DESIGN_REVIEW.md.

## Draft connector pinout

All pin numbers are component pin numbers. Header geometry and assembly orientation remain under review.

| Connector | Pin 1 | Pin 2 | Pin 3 |
|---|---|---|---|
| J1 input | VIN | GND | — |
| J2 motor A | AOUT1 | AOUT2 | — |
| J3 motor B | BOUT1 | BOUT2 | — |
| J4 host power/enable | VIO input | GND | ENABLE / nSLEEP |
| J5 channel A | AIN1 | AIN2 | GND |
| J6 channel B | BIN1 | BIN2 | GND |
| J7 diagnostics | FAULT_N | TEMP | GND |

VIO is supplied by the host: match 3.3 V logic with 3.3 V VIO, or 5 V logic with 5 V VIO. It is not a power output. Mixed-voltage configurations are not approved. Pull-downs hold all commands and ENABLE low with disconnected high-impedance host pins. The host must drive ENABLE low before initialization, set commands to coast, then enable and wait at least 1 ms before PWM. Use command inputs for speed PWM, not nSLEEP. Both inputs low request coast, unequal inputs request drive, both high request brake; direction depends on motor wiring. All timing and sequencing require prototype confirmation.

LED1 indicates protected VM; LED2 VIO; LED3/4 unequal A/B commands (they can light while the driver sleeps); LED5 asserted fault. No LED measures rotation. TEMP measures local board temperature, not motor winding or silicon junction temperature. Its revised 56 kΩ/10 kΩ divider gives TEMP≈0.1515×VIO at 25°C; it is not an automatic cutoff. TP1/2 expose raw switching sense nodes, not calibrated ADC current telemetry. TP3 is GND; TP4 VM; TP5 VIO; TP6 FAULT_N; TP7 TEMP.

## Review and reproduction

- [BOM.md](BOM.md), [bom.json](bom.json), [IMPORTS.md](IMPORTS.md)
- [VALIDATION.md](VALIDATION.md), [ROUTING_GATE.md](ROUTING_GATE.md), [ISSUES.md](ISSUES.md)
- [ASSEMBLY_PLAN.md](ASSEMBLY_PLAN.md), [PLACEMENT_REVIEW.md](PLACEMENT_REVIEW.md), [TEST_PLAN.md](TEST_PLAN.md)
- [TOOLCHAIN.md](TOOLCHAIN.md)

Use `bun install --frozen-lockfile`, `bun run typecheck`, `bun run build`, then `bun test`. The strict build/test gate currently fails on the documented generated-schema defect. Do not bypass it. `bun run render` produces review-only images from unmodified output and is not validation.

GitHub account verified: AnasSarkiz. The user authorized PUBLIC GitHub and tscircuit repositories. Publication results are recorded in [PUBLICATION.md](PUBLICATION.md). No manufacturing package or order has been generated.

![Unrouted top view](artifacts/pre-route/pcb-top-unrouted.png)
