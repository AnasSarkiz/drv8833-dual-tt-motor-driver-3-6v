import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type PropsWithChildren,
} from "react"
import type {
  ChipProps,
  FootprintProps,
  FootprintInsertionDirection,
  DiodeProps,
  SymbolProps,
} from "@tscircuit/props"
import { SI7655ADN_T1_GE3 } from "../imports/SI7655ADN_T1_GE3"
import { A_0453003_MR } from "../imports/A_0453003_MR"
import { FuseFootprint } from "./fuse-footprint"
import { SMBJ6_0A } from "../imports/SMBJ6_0A"
import { NCP18XH103F03RB } from "../imports/NCP18XH103F03RB"
import { KF301_5_0_2P } from "../imports/KF301_5_0_2P"
import { A_2_54_1_3P_ } from "../imports/A_2_54_1_3P_"
import { SN74LVC2G86DCTR } from "../imports/SN74LVC2G86DCTR"

export function CommandIndicatorLogic(
  props: Omit<Parameters<typeof SN74LVC2G86DCTR>[0], "pinAttributes">,
) {
  const imported: ReactElement<ChipProps> = SN74LVC2G86DCTR({
    name: props.name,
  })
  return (
    <chip
      {...imported.props}
      {...props}
      schPinArrangement={{
        leftSide: [1, 2, 5, 6],
        rightSide: [7, 3],
        topSide: [8],
        bottomSide: [4],
      }}
      pinAttributes={{
        pin1: { isInput: true },
        pin2: { isInput: true },
        pin3: { isOutput: true, isUsingPushPull: true },
        pin4: { requiresGround: true },
        pin5: { isInput: true },
        pin6: { isInput: true },
        pin7: { isOutput: true, isUsingPushPull: true },
        pin8: { requiresPower: true },
      }}
    />
  )
}

// Preserve supplier geometry and models; electrical semantics belong to the
// design. Raw imports remain unchanged so their provenance is auditable.
function getImportedPart(imported: ReactElement<ChipProps>) {
  const {
    footprint,
    cadModel,
    supplierPartNumbers,
    manufacturerPartNumber,
    symbol,
  } = imported.props
  return {
    footprint,
    cadModel,
    supplierPartNumbers,
    manufacturerPartNumber,
    symbol: withReferenceText(symbol, imported.props.name),
  }
}

function withReferenceText(
  symbol: ChipProps["symbol"],
  referenceDesignator: string,
) {
  if (symbol === undefined) return undefined
  if (
    !isValidElement<PropsWithChildren<SymbolProps>>(symbol) ||
    symbol.type !== "symbol"
  ) {
    throw new Error("Expected an imported JSX symbol")
  }
  return (
    <symbol>
      {symbol.props.children}
      <schematictext
        text={referenceDesignator}
        schX={0}
        schY={0.8}
        fontSize={0.25}
      />
    </symbol>
  )
}

function withInsertionDirection(
  footprint: ChipProps["footprint"],
  insertionDirection: FootprintInsertionDirection,
) {
  if (
    !isValidElement<FootprintProps>(footprint) ||
    footprint.type !== "footprint"
  ) {
    throw new Error("Expected an imported JSX footprint")
  }
  return cloneElement(footprint, { insertionDirection })
}

export function InputTerminal(props: ChipProps) {
  const imported = getImportedPart(KF301_5_0_2P({ name: props.name }))
  return (
    <connector
      {...imported}
      {...props}
      pinLabels={{ pin1: ["pin1"], pin2: ["pin2"] }}
      pinAttributes={{ pin1: { isPassive: true }, pin2: { isPassive: true } }}
      footprint={withInsertionDirection(imported.footprint, "from_y_neg")}
    />
  )
}

export function HostHeader(props: ChipProps) {
  const imported = getImportedPart(A_2_54_1_3P_({ name: props.name }))
  return (
    <connector
      {...imported}
      {...props}
      pinLabels={{ pin1: ["pin1"], pin2: ["pin2"], pin3: ["pin3"] }}
      pinAttributes={{
        pin1: { isPassive: true },
        pin2: { isPassive: true },
        pin3: { isPassive: true },
      }}
      footprint={withInsertionDirection(imported.footprint, "from_above")}
    />
  )
}

export function InputFuse(props: ChipProps) {
  const imported = getImportedPart(A_0453003_MR({ name: props.name }))
  return (
    <fuse
      {...imported}
      {...props}
      currentRating="3A"
      voltageRating="125V"
      footprint={FuseFootprint()}
      pinAttributes={{ pin1: { isPassive: true }, pin2: { isPassive: true } }}
    />
  )
}

export function ReversePolarityMosfet(
  props: Parameters<typeof SI7655ADN_T1_GE3>[0],
) {
  const imported = getImportedPart(SI7655ADN_T1_GE3({ name: props.name }))
  return (
    <chip
      {...imported}
      {...props}
      pinLabels={{
        pin1: ["S1"],
        pin2: ["S2"],
        pin3: ["S3"],
        pin4: ["G"],
        pin5: ["D1"],
        pin6: ["D2"],
        pin7: ["D3"],
        pin8: ["D4"],
        pin9: ["D_EP"],
      }}
      schPinArrangement={{
        leftSide: [4],
        topSide: [1, 2, 3],
        rightSide: [5, 6, 7, 8, 9],
      }}
      pinAttributes={{
        pin1: { isPassive: true, mustBeConnected: true },
        pin2: { isPassive: true, mustBeConnected: true },
        pin3: { isPassive: true, mustBeConnected: true },
        pin4: { isInput: true, mustBeConnected: true },
        pin5: { isPassive: true, mustBeConnected: true },
        pin6: { isPassive: true, mustBeConnected: true },
        pin7: { isPassive: true, mustBeConnected: true },
        pin8: { isPassive: true, mustBeConnected: true },
        pin9: { isPassive: true, mustBeConnected: true },
      }}
    />
  )
}

export function BusTvs(props: DiodeProps) {
  const imported = getImportedPart(SMBJ6_0A({ name: props.name }))
  return (
    <diode
      {...imported}
      {...props}
      pinLabels={{ pin1: ["C", "cathode"], pin2: ["A", "anode"] }}
      pinAttributes={{ pin1: { isPassive: true }, pin2: { isPassive: true } }}
    />
  )
}

export function BoardThermistor(props: ChipProps) {
  const imported = getImportedPart(NCP18XH103F03RB({ name: props.name }))
  return (
    <resistor
      {...imported}
      {...props}
      resistance="10k"
      pinAttributes={{ pin1: { isPassive: true }, pin2: { isPassive: true } }}
    />
  )
}
