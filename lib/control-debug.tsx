import { Fragment } from "react"
import { CommandIndicatorLogic } from "./parts"
import { HostHeader } from "./parts"
import { A_0603WAF3300T5E } from "../imports/A_0603WAF3300T5E"
import { A_0603WAF1002T5E } from "../imports/A_0603WAF1002T5E"
import { A_0603WAF2201T5E } from "../imports/A_0603WAF2201T5E"
import { CC0603KRX7R9BB104 } from "../imports/CC0603KRX7R9BB104"
import { KT_0603YG } from "../imports/KT_0603YG"
import { KT_0603R } from "../imports/KT_0603R"

const commands = ["AIN1", "AIN2", "BIN1", "BIN2", "ENABLE"] as const

export function ControlDebug() {
  return (
    <>
      <schematicsheet name="Control_Debug" sheetIndex={2} sheetSize="ANSI_B" />
      <schematicsection
        name="host"
        displayName="Host input — VIO is an input"
      />
      <schematicsection
        name="indicators"
        displayName="Command indication, not shaft motion"
      />
      <HostHeader
        name="J4"
        pcbX={24}
        pcbY={16}
        schX={-18}
        schY={8}
        schSheetName="Control_Debug"
        schSectionName="host"
        connections={{
          pin1: "net.VIO",
          pin2: "net.GND",
          pin3: "net.HOST_ENABLE",
        }}
      />
      <HostHeader
        name="J5"
        pcbX={24}
        pcbY={9}
        schX={-18}
        schY={2}
        schSheetName="Control_Debug"
        schSectionName="host"
        connections={{
          pin1: "net.HOST_AIN1",
          pin2: "net.HOST_AIN2",
          pin3: "net.GND",
        }}
      />
      <HostHeader
        name="J6"
        pcbX={24}
        pcbY={2}
        schX={-18}
        schY={-4}
        schSheetName="Control_Debug"
        schSectionName="host"
        connections={{
          pin1: "net.HOST_BIN1",
          pin2: "net.HOST_BIN2",
          pin3: "net.GND",
        }}
      />
      {commands.map((command, index) => (
        <Fragment key={command}>
          <A_0603WAF3300T5E
            name={`R${4 + index}`}
            pcbX={17}
            pcbY={17 - index * 4}
            pcbRotation={180}
            schX={-10}
            schY={10 - index * 4}
            schSheetName="Control_Debug"
            schSectionName="host"
            connections={{
              pin1: `net.HOST_${command}`,
              pin2: `net.${command}`,
            }}
          />
          <A_0603WAF1002T5E
            name={`R${9 + index}`}
            schOrientation="vertical"
            pcbX={12}
            pcbY={17 - index * 4}
            schX={-4}
            schY={10 - index * 4}
            schSheetName="Control_Debug"
            schSectionName="host"
            connections={{ pin1: `net.${command}`, pin2: "net.GND" }}
          />
        </Fragment>
      ))}
      <CommandIndicatorLogic
        name="U2"
        pcbX={6}
        pcbY={11}
        schX={3}
        schY={1}
        schSheetName="Control_Debug"
        schSectionName="indicators"
        connections={{
          "1A": "net.AIN1",
          "1B": "net.AIN2",
          "2A": "net.BIN1",
          "2B": "net.BIN2",
          "1Y": "net.A_CMD",
          "2Y": "net.B_CMD",
          VCC: "net.VIO",
          GND: "net.GND",
        }}
      />
      <CC0603KRX7R9BB104
        name="C7"
        schOrientation="vertical"
        pcbX={1}
        pcbY={11}
        schX={3}
        schY={9}
        schSheetName="Control_Debug"
        schSectionName="indicators"
        connections={{ pin1: "net.VIO", pin2: "net.GND" }}
      />
      <A_0603WAF1002T5E
        name="R14"
        pcbX={24}
        pcbY={-5}
        schX={10}
        schY={-7}
        schSheetName="Control_Debug"
        schSectionName="indicators"
        connections={{ pin1: "net.VIO", pin2: "net.FAULT_N" }}
      />
      {(["VIO", "A_CMD", "B_CMD"] as const).map((rail, index) => (
        <Fragment key={rail}>
          <A_0603WAF2201T5E
            name={`R${15 + index}`}
            pcbX={-7 + index * 5}
            pcbY={17}
            schX={10}
            schY={10 - index * 4}
            schSheetName="Control_Debug"
            schSectionName="indicators"
            connections={{ pin1: `net.${rail}`, pin2: `net.LED_${rail}_A` }}
          />
          <KT_0603YG
            name={`LED${2 + index}`}
            pcbX={-7 + index * 5}
            pcbY={21}
            schX={16}
            schY={10 - index * 4}
            schSheetName="Control_Debug"
            schSectionName="indicators"
            connections={{ anode: `net.LED_${rail}_A`, cathode: "net.GND" }}
          />
        </Fragment>
      ))}
      <A_0603WAF2201T5E
        name="R18"
        pcbX={24}
        pcbY={-10}
        schX={10}
        schY={-3}
        schSheetName="Control_Debug"
        schSectionName="indicators"
        connections={{ pin1: "net.VIO", pin2: "net.LED_FAULT_A" }}
      />
      <KT_0603R
        name="LED5"
        pcbX={29}
        pcbY={-10}
        schX={16}
        schY={-3}
        schSheetName="Control_Debug"
        schSectionName="indicators"
        connections={{ anode: "net.LED_FAULT_A", cathode: "net.FAULT_N" }}
      />
    </>
  )
}
