# Prototype test plan — ALL PHYSICAL TESTS NOT RUN

No board has been manufactured. No simulation or laboratory result is claimed. Final numerical supply/current/thermal limits must be settled before executing hazardous tests.

1. Record motor part/lot, board revision, supply limits, host/firmware, ambient and calibrated instruments. Confirm motor/shaft/gearbox/fastener fit and component clearance against a sample.
2. Inspect polarity, lead soldering and exposed pad; measure unpowered rail resistance and shorts.
3. Power from a low-current limited source with ENABLE low. Stop on unexpected current, heating, odor or a wrong rail. Check VIO and TEMP ranges before attaching a host.
4. Exercise VM-first, VIO-first, power removal, reset and disconnected host. Require no unintended motor drive; confirm FAULT/TEMP do not backfeed an unpowered host beyond its specified limit.
5. Verify both channels' coast/forward/reverse/brake commands and all five LEDs. Confirm command LEDs may remain lit during sleep. Check wake delay before enabling PWM.
6. Run low-duty no-load starts, then controlled load and simultaneous starts. Sweep the intended PWM range only after host timing and motor-current assumptions are approved.
7. Measure per-channel chopping and shunt temperature with brief controlled blocked-rotor pulses. Use a host timeout, conservative current limit and immediate stop. No unlimited stall test. Define current min/max from reviewed comparator/shunt tolerances first.
8. Capture reversal, braking, both-channel stop, hot plug and source disconnect bus waveforms using an energy-limited setup. Require VM to remain within the reviewed operating envelope, with absolute maximum as a hard abort threshold; final margin must be defined before testing.
9. Test actual lowest input under full specified load, wiring and both-channel starts. Require VM at U1 ≥2.7 V with margin. The present 3 V input target is not approved.
10. Perform both-channel thermal soak at the specified ambient/load/duty only after the copper and thermal design are validated. Establish component-temperature limits with derating, below relevant ratings; derive continuous board rating from measurements.
11. Compare TEMP to an independent board-temperature probe across the intended range; validate source impedance, filter settling and ADC acquisition. Force NTC open/short and require host disable plus explicit sensor-fault handling.
12. Verify fault reporting and recovery. Store raw waveforms and results, including failed runs.

Use differential or isolated methods on H-bridge outputs. Never attach an earth-referenced scope ground clip to a switching motor terminal. Final test acceptance tables, temperature limits, supply margin and PWM endpoints remain blocked by the design review; this is a plan, not release evidence.
