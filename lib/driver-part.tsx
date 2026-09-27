import type { ReactElement } from "react"
import type { ChipProps } from "@tscircuit/props"
import { DRV8833PWPR } from "../imports/DRV8833PWPR"
import { DriverFootprint } from "./driver-footprint"

export function MotorDriverIc(
  props: Omit<Parameters<typeof DRV8833PWPR>[0], "pinAttributes" | "footprint">,
) {
  const imported: ReactElement<ChipProps> = DRV8833PWPR({ name: props.name })
  return (
    <chip
      {...imported.props}
      {...props}
      footprint={DriverFootprint()}
      schPinArrangement={{
        leftSide: [16, 15, 9, 10, 1],
        rightSide: [2, 4, 7, 5, 3, 6, 8],
        topSide: [12, 11, 14],
        bottomSide: [13, 17],
      }}
      schPinStyle={{
        pin11: { leftMargin: 0.5 },
        pin14: { leftMargin: 0.5 },
        pin3: { topMargin: 0.3 },
        pin8: { topMargin: 0.3 },
      }}
      schWidth={2.8}
      schHeight={2.8}
      pinAttributes={{
        pin1: { isInput: true },
        pin2: { isOutput: true },
        pin3: { isPassive: true },
        pin4: { isOutput: true },
        pin5: { isOutput: true },
        pin6: { isPassive: true },
        pin7: { isOutput: true },
        pin8: { isOutput: true, isUsingOpenDrain: true },
        pin9: { isInput: true },
        pin10: { isInput: true },
        pin11: { isPassive: true },
        pin12: { requiresPower: true },
        pin13: { requiresGround: true },
        pin14: { isOutput: true },
        pin15: { isInput: true },
        pin16: { isInput: true },
        pin17: { requiresGround: true },
      }}
    />
  )
}
