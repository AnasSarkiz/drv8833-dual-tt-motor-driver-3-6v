# Electrical design review — incomplete

Analysis only; no physical measurements or circuit simulation. This file records both calculations and blocking decisions. The candidate cannot pass the routing gate.

## Power architecture

J1 VIN → F1 fuse → Q1 drain, Q1 source → VM. The P-channel gate is at GND; its body diode starts the protected rail in the correct direction. VM feeds U1, two bulk capacitors, local ceramic bypass, the TVS candidate and VM LED. This arrangement does not block returned regenerative current when Q1 is on. U1 GND and exposed pad are separate from the AISEN/BISEN nodes, which each connect to GND only through their own 0.15 ohm shunt.

The store-product target remains **3.0–6.0 V at J1, including supply tolerance**, for two small TT motors. The user's adjustable regulated supply is test equipment, not a restriction on the product. Battery packs and regulated adapters must be assessed by their actual voltage range and ability to accept returned motor energy. Nominal pack labels alone do not establish compatibility; no specific battery pack, USB source or adapter is approved yet.

Q1 is now Vishay **Si7655ADN-T1-GE3, C222495**. Its 9 mΩ maximum at VGS=-2.5 V and 25°C replaces AO3401A's 85 mΩ. Its gate limit is ±12 V and drain rating 20 V. Physical pins 1/2/3 are source (VM), 4 gate (GND), 5/6/7/8 drain (VIN_FUSED); imported pad 9 is the same exposed drain metal. The datasheet bottom view was visually checked. The exact imported land pattern and assembly process still need completion. [Vishay datasheet](https://www.vishay.com/docs/62909/si7655adn.pdf).

F1 is now Littelfuse **0453003.MR, C178991**, a **non-resettable 3 A fuse**. This replaces the PTC; a blown fuse requires fault diagnosis and replacement. Its nominal cold resistance is 22.7 mΩ, not a guaranteed hot maximum. At 25°C use the manufacturer's 75% continuous-current derating: 2.25 A; ambient rerating applies additionally. This is input fault protection, not the per-channel motor limiter. The datasheet allows up to 5 s opening at twice rated current, so it does not guarantee semiconductor survival during every fault. Source fault current and fuse/TVS coordination remain to be closed. [Littelfuse 451/453 datasheet](https://www.littelfuse.com/assetdocs/fuse-451-and-453-datasheet?assetguid=533cd5cc-956c-4243-867f-6ab5a62f6ba1).

At 2 A shared input, Q1 plus F1 contribute approximately 2×(0.009+0.0227)=**0.0634 V** and 0.127 W, versus the prior optimistic 0.29 V. This combines a room-temperature MOSFET maximum with a fuse nominal: it is an estimate, not a system guarantee. A provisional hot-path design budget of Q1≤20 mΩ, F1≤50 mΩ and contacts/copper≤30 mΩ totals 0.20 V at 2 A, leaving VM≥2.8 V for 3.0 V measured at J1. These are acceptance targets to verify, not manufacturer-guaranteed bounds. Supply sag must not pull J1 below 3 V. Reliable simultaneous starts at minimum input remain unverified.

D1 is now **Littelfuse SMBJ6.0A, C83270**, replacing the unverified MSKSEMI candidate. The manufacturer series sheet specifies 6.0 V standoff, 6.67–7.37 V breakdown at 10 mA, and 10.3 V maximum clamp at 58.3 A for its stated pulse condition. Reverse leakage is up to **800 µA**, not the supplier-description number. The 0.046%/°C column is a breakdown temperature coefficient. Do not treat 600 W pulse capability as continuous braking power or scale the clamp by the breakdown coefficient and call it guaranteed. The 10.3 V value leaves only 1.5 V to U1's 11.8 V absolute limit; hot clamping, wiring/layout overshoot and repetitive energy must be budgeted. [Manufacturer SMBJ series sheet, supplier-hosted](https://datasheet.lcsc.com/datasheet/pdf/4ab84a227fae39f9eac85241b8264ead.pdf).

Two 220 µF capacitors give 440 µF nominal and 352 µF at -20%. Ignoring losses, returned energy of 1 mJ from 6 V raises VM to 6.46 V; 10 mJ raises it to 9.64 V. These are examples, not measured TT-motor energies. Required braking/reversal energy, pulse repetition, bulk ESR/ripple/lifetime and transient clamp temperature remain open. **The regenerative-energy solution is not approved.** Q1 conducts returned current when on; it is not a reverse-current blocker. Do not assume a bench supply or power bank can absorb this energy.

## Driver pin audit

Compared with [TI DRV8833 PWP pin table](https://www.ti.com/lit/ds/symlink/drv8833.pdf):

| Pad | Imported signal | Intended net |
|---|---|---|
| 1 | nSleep | ENABLE |
| 2 | AOUT1 | AOUT1 |
| 3 | AISEN | ISEN_A |
| 4 | AOUT2 | AOUT2 |
| 5 | BOUT2 | BOUT2 |
| 6 | BISEN | ISEN_B |
| 7 | BOUT1 | BOUT1 |
| 8 | nFault | FAULT_N |
| 9 | BIN1 | BIN1 |
| 10 | BIN2 | BIN2 |
| 11 | VCP | VCP |
| 12 | VM | VM |
| 13 | GND1 | GND |
| 14 | VINT | VINT |
| 15 | AIN2 | AIN2 |
| 16 | AIN1 | AIN1 |
| 17 | GND2 / exposed pad | GND |

C6 is VCP-to-VM, not VCP-to-GND. C5 bypasses VINT, with no external VINT load. C3/C4 provide 20 uF nominal VM ceramic capacitance; exact DC-bias/temperature curves must establish the effective minimum. Driver PWM strategy, fault recovery and wake timing still need a consolidated worst-case review.

## Current limit and thermal targets

The [TI DRV8833 datasheet](https://www.ti.com/lit/ds/symlink/drv8833.pdf) specifies a 160/200/240 mV current-trip threshold at the table's stated conditions. With 0.15 Ω ±1%, the calculated range is **1.056–1.616 A** at those conditions; nominal 1.333 A. Including a ±600 ppm/°C shunt TCR over a 75°C change expands the resistor scenario to **1.011–1.692 A**. That is not a guaranteed all-temperature IC limit. Switching blanking and motor inductance can permit additional overshoot. Nominal shunt dissipation is 0.267 W; the upper resistor/threshold scenario is about 0.406 W. Shunt pulse/derating and a lower-TCR alternative remain under review.

At the datasheet's 85°C, 5 V resistance condition, a bridge's combined maximum on-resistance is 0.600 Ω: two channels at 1 A imply about 1.2 W conduction loss. At the 2.7 V condition the estimate is 1.3 W. These extrapolations exclude switching and other losses. An engineering junction target of 125°C at 40°C ambient and 1.3 W requires effective thermal resistance below 65°C/W before those extra losses. The datasheet fixture is not this board. Copper spreading, filled thermal vias, enclosure airflow and actual motor duty need verification. **1 A/channel continuous remains a target, not a product rating.** FAULT_N is not a stall detector; the host needs a blocked-motor timeout.

## Host interface and indicators

R4–R8 are now **330 Ω ±1% C23138**, replacing 1 kΩ; 10 kΩ pull-downs remain. At worst resistor ratio the input sees about 0.9674×host VOH before leakage. With host VOH=2.8 V, nSLEEP's stated 13 µA input current gives approximately 2.705 V, above its 2.5 V high threshold. Commands allowing 33 µA driver plus 5 µA XOR leakage give approximately 2.697 V. This calculation uses the datasheet's stated input-current test conditions; it is not a universal host guarantee. For a 5 V host, require matching VIO and verify loaded VOH against U2's 0.7×VIO requirement; a 4.4 V host-high target provides useful margin at VIO≤5.25 V. Input edge rate and loading still need oscilloscope qualification.

Use VIO from the same host rail: 3.3 V or 5 V, with no arbitrary mixed-voltage modes. The [SN74LVC2G86](https://www.ti.com/lit/ds/symlink/sn74lvc2g86.pdf) allows inputs to 5.5 V and supports partial power-down; its input edge-rate limits still apply. Series resistance is not a complete connector ESD solution.

Worst preliminary FAULT loading at 5.25 V is about 2.11 mA from LED5 and its 10 kΩ pull-up, leaving margin below the 5 mA characterized sink condition. Limit additional external loading and verify host low threshold against 0.5 V. LED1 indicates VM, LED2 VIO, LED3/4 unequal channel commands, LED5 asserted fault. Command LEDs can light while asleep; none measures rotation.

## Temperature interface correction

The [Murata NCP18XH103F03RB specification](https://www.murata.com/products/productdetail?partno=NCP18XH103F03RB) lists 0.1 mA maximum measuring current at 25°C. The original equal-10 kΩ divider exceeded this. **R19 is now 56 kΩ ±1% C23206.** Even at VIO=5.25 V and R19=-1%, divider current stays below 94.7 µA as NTC resistance approaches zero. At 25°C nominal TEMP/VIO is 10/(56+10)=0.151515: 0.500 V at 3.3 V or 0.758 V at 5 V. Estimated self-heating at the upper rail is about 0.065°C using the typical dissipation constant; the actual board environment changes it.

Use R_NTC=56000×TEMP/(VIO−TEMP), assuming negligible ADC loading and a ratiometric reference. TEMP is a raw board-temperature signal, not an automatic cutoff or motor/junction reading. The full manufacturer R/T table and final accuracy budget remain open; the 25/50 beta value must not be used as a guaranteed full-range conversion.

R20=1 kΩ and C8=100 nF give roughly 0.95 ms at 25°C and a nominal cold limit of 5.7 ms. Allow at least 35 ms initial settling, subject to capacitor tolerance. The host must use a high-impedance ADC and suitable acquisition time; its input must accept the complete 0–VIO range. Open/short sensor readings approach rail endpoints and require host fault handling.

## Power states and motor commands

TI explicitly allows digital inputs before VM. U2 supports powered-off inputs within its specified range. This resolves the earlier blanket prohibition on host-first power-up; it does not authorize every hot-plug or backfeed configuration.

| VM | Host VIO | Host commands | Design behavior / condition |
|---|---|---|---|
| absent | absent | high impedance | No driven motor operation |
| present | absent | high impedance | External pulls request sleep/coast; leakage/default state requires prototype confirmation |
| absent | present | valid 0–VIO levels | Host-first sequencing allowed by the IC specifications; keep ENABLE low |
| present | present | ENABLE low | Sleep requested |
| present | present | ENABLE high | Wait at least 1 ms after waking; set motor commands deliberately |
| returns after interruption | present | ENABLE already high | Motor may restart immediately; host must handle supply recovery and hold sleep during initialization |
| either | VIO powered independently of an unpowered host | FAULT/TEMP connected | Unsupported: those outputs can backfeed the host |
| either | changing | hot plug / long leads | Connector bounce, transients and ESD not qualified |

Drive PWM on the command inputs, not nSLEEP. Both low request coast, unequal inputs drive, both high request brake. A brake command and rapid reversal require the unresolved energy review above. Before initialization or mode changes, deassert ENABLE and choose a controlled restart sequence. VIO is an input, never a board power output.

## Remaining pre-routing decisions

Close the bus-energy budget and fault-source assumptions, capacitor bias/ripple review, shunt pulse/TCR choice, exact footprints and assembly process, connector access in 3D, and external-port ESD/interface limits. Software schema defects are tracked separately in ISSUES.md. All physical tests remain NOT RUN. The generic 75 × 60 mm chassis module and mounting pattern are accepted; no specific chassis is required to continue. MCU, crystal, USB, firmware flashing, radio, charger and encoder are NOT APPLICABLE to this external-controller design.
