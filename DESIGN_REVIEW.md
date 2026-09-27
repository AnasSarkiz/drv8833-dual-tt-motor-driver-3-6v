# Electrical design review — incomplete

Analysis only; no physical measurements or circuit simulation. This file records both calculations and blocking decisions. The candidate cannot pass the routing gate.

## Power architecture

J1 VIN → F1 PTC → Q1 drain, Q1 source → VM. The P-channel gate is at GND; its body diode starts the protected rail in the correct direction. VM feeds U1, two bulk capacitors, local ceramic bypass, the TVS candidate and VM LED. This arrangement does not block returned regenerative current when Q1 is on. U1 GND and exposed pad are separate from the AISEN/BISEN nodes, which each connect to GND only through their own 0.15 ohm shunt.

The AO3401A catalog gives 85 milliohm at VGS=-2.5 V. At 2 A shared input this alone means 0.17 V and 0.34 W at that stated condition; hot resistance will increase. The PTC catalog lists up to 60 milliohm initial/post-trip-related resistance needing exact datasheet interpretation, adding 0.12 V at 2 A. These two optimistic room-temperature terms consume nearly the entire 0.30 V budget between 3.0 V input and the driver's 2.7 V minimum, before wires, connector resistance, copper, tolerances or sag. **3.0 V input is not supported by the current evidence.** Select a lower-loss path or explicitly revise the input minimum before approval.

The nominal input target is 3–6 V, subject to actual-source tolerances. The candidate SMBJ6.0A's 6 V standoff cannot be assumed compatible with a nominal 6 V supply whose positive tolerance exceeds 6 V. Exact MSKSEMI clamp limits, overshoot, temperature and energy remain unverified. No unrelated manufacturer's SMBJ6.0A curve may be substituted. Input PTC hold/trip derating and prospective source fault current also remain open.

Two 220 uF capacitors give 440 uF nominal and 352 uF at -20% tolerance. Ignoring losses, a returned 1 mJ starting at 6 V raises the bus to sqrt(6²+2×0.001/0.000352)=6.46 V; 10 mJ raises it to 9.64 V. These energies are examples, not measured TT motor energy. Required stored kinetic/inductive energy, ESR, ripple current and lifetime must be established. The bus-energy solution is not approved.

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

0.2/0.15 ≈ 1.333 A nominal; shunt dissipation I²R≈0.267 W. Resistor-only ±1% gives 1.320–1.347 A, excluding the comparator threshold, switching blanking and temperature. The candidate shunt's catalog TCR is ±600 ppm/°C; a 75°C rise permits ±4.5% resistance drift before initial tolerance. This is a material current-limit uncertainty and motivates a lower-TCR alternative. No guaranteed chopping bound or 1 A/channel continuous rating has been established. Both-channel thermal loss and copper/thermal-via performance await a mechanically viable layout. Host blocked-motor timeout is required; FAULT_N is not a dedicated stall detector.

## Logic and LED preliminary calculations

A 1k series resistor and 10k pull-down attenuate host high to roughly 0.909×VIO before internal pulls/leakage. At 3.3 V the ideal result is 3.0 V. Worst host VOH, resistor tolerances and input current must preserve the stricter nSLEEP high threshold as well as U2 input thresholds. The [SN74LVC2G86 datasheet](https://www.ti.com/lit/ds/symlink/sn74lvc2g86.pdf) provides partial-power-down support; a complete injection/hot-plug review is still open.

2.2k LED resistors give approximately 0.36–1.82 mA for green VF=2.2–2.0 V and rails=3–6 V, ignoring tolerance and gate-output drop. Red fault LED at 5.25 V, VF=1.8 V, ideal low and -1% R draws 1.58 mA; 10k pull-up adds at most 0.53 mA, totaling 2.11 mA before external host loading. This is below the driver's 5 mA characterized sink test, but host VOL margin, LED low-current brightness and unpowered output behavior need verification. Command LEDs indicate XOR input state even during sleep.

## Temperature analysis

At 25°C with equal nominal 10k resistors, TEMP=VIO/2. NTC dissipation is VIO²/(4×10k): 0.272 mW at 3.3 V and 0.625 mW at 5 V. With the catalog 1 mW/°C dissipation constant this suggests roughly 0.27/0.63°C self-heating, dependent on the real board environment. Divider source impedance is 5k at 25°C plus the 1k output resistor. With 100nF the nominal RC is 0.6 ms, about 3 ms for five time constants. The upper bound approaches 1.1 ms as NTC resistance rises. A specific host ADC acquisition limit is required.

R_NTC=10k×TEMP/(VIO−TEMP), assuming a ratiometric VIO reference and negligible ADC load. Use the exact Murata resistance-temperature table for temperature conversion; it has not yet been obtained, so no arbitrary beta conversion or accuracy claim is supplied. Open sensor approaches VIO and short approaches GND. Host code must treat both endpoints as faults. Sensor placement currently remains preliminary.

## Power-state review

| VM | VIO | Host state | Current conclusion |
|---|---|---|---|
| absent | absent | high impedance | No powered motor operation |
| present | absent | high impedance | External pulls request sleep/coast; verify leakage physically |
| absent | present | low commands/enable | Driver unpowered; interface injection review open |
| present | present | low enable | Sleep requested |
| present | present | high enable and valid commands | Normal operation requested; wait after wake |
| present | absent | high driven pins | Unsupported sequencing; no independent VIO interlock implemented |
| either | transitioning | hot plug | Connector bounce/ESD/injection not yet qualified |

Do not allow powered host outputs into an unpowered receiving device until the full allowed-current path is verified. FAULT and TEMP backfeed analysis is unfinished. No external connector-level ESD solution or test standard is yet selected. Series resistors are not certification or comprehensive ESD protection.

## Blocking design decisions

Motor mounting geometry; exact source and input minimum; low-loss input protection; bus transient/energy solution; bulk ripple/ESR; MLCC derating; low-TCR shunts; complete power-state/injection review; external-port protection; NTC table/ADC assumptions; independently verified footprints/paste/models; thermal/current capability. These are design issues, separate from software defects in ISSUES.md.

MCU, firmware flashing, USB, crystal, radio, charger and encoder: NOT APPLICABLE to this external-controller baseline.
