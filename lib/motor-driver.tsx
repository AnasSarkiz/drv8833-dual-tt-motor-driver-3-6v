import { MotorDriverIc } from "./driver-part"
import { CL21A106KAYNNNE } from "../imports/CL21A106KAYNNNE"
import { CL10A225KO8NNNC } from "../imports/CL10A225KO8NNNC"
import { A_0603B103K500NT } from "../imports/A_0603B103K500NT"
import { RL2512FK_070R15L } from "../imports/RL2512FK_070R15L"
import { InputTerminal } from "./parts"
import { SchematicNote } from "./schematic-note"

export function MotorDriver() {
  return (
    <>
      <schematicsheet name="Dual_Motor_Driver" sheetIndex={1} />
      <schematicsection
        name="bridge"
        displayName="Two H-bridges; independent raw current sense"
      />
      <schematicsection
        name="driver_support"
        displayName="Local bypass and charge pump"
      />
      <MotorDriverIc
        name="U1"
        pcbX={0}
        pcbY={0}
        schX={0}
        schY={0}
        schSheetName="Dual_Motor_Driver"
        schSectionName="bridge"
        connections={{
          nSleep: "net.ENABLE",
          AIN1: "net.AIN1",
          AIN2: "net.AIN2",
          BIN1: "net.BIN1",
          BIN2: "net.BIN2",
          AOUT1: "net.AOUT1",
          AOUT2: "net.AOUT2",
          BOUT1: "net.BOUT1",
          BOUT2: "net.BOUT2",
          AISEN: "net.ISEN_A",
          BISEN: "net.ISEN_B",
          nFault: "net.FAULT_N",
          VM: "net.VM",
          VCP: "net.VCP",
          VINT: "net.VINT",
          GND1: "net.GND",
          GND2: "net.GND",
        }}
      >
        <SchematicNote
          schX={-4.6}
          schY={-3.4}
          lines={[
            "U1: dual H-bridge for two brushed DC motors",
            "IC VM: 2.7-10.8 V; board input target: 3-6 V",
            "Current chop: 1.33 A/channel nominal (R2/R3)",
            "Continuous board current: requires thermal testing",
          ]}
        />
      </MotorDriverIc>
      <RL2512FK_070R15L
        name="R2"
        schOrientation="vertical"
        pcbX={-8}
        pcbY={-9}
        pcbRotation={180}
        schX={-5}
        schY={-7}
        schSheetName="Dual_Motor_Driver"
        schSectionName="bridge"
        connections={{ pin1: "net.ISEN_A", pin2: "net.GND" }}
      />
      <RL2512FK_070R15L
        name="R3"
        schOrientation="vertical"
        pcbX={8}
        pcbY={-9}
        schX={5}
        schY={-7}
        schSheetName="Dual_Motor_Driver"
        schSectionName="bridge"
        connections={{ pin1: "net.ISEN_B", pin2: "net.GND" }}
      />
      <InputTerminal
        name="J2"
        pcbX={-3}
        pcbY={-24}
        schX={-10}
        schY={0}
        schSheetName="Dual_Motor_Driver"
        schSectionName="bridge"
        connections={{ pin1: "net.AOUT1", pin2: "net.AOUT2" }}
      >
        <SchematicNote schX={-1.4} schY={1.2} lines={["J2: MOTOR A"]} />
      </InputTerminal>
      <InputTerminal
        name="J3"
        pcbX={11}
        pcbY={-24}
        schX={10}
        schY={0}
        schSheetName="Dual_Motor_Driver"
        schSectionName="bridge"
        connections={{ pin1: "net.BOUT1", pin2: "net.BOUT2" }}
      >
        <SchematicNote schX={-1.4} schY={1.2} lines={["J3: MOTOR B"]} />
      </InputTerminal>
      <CL21A106KAYNNNE
        name="C3"
        schOrientation="vertical"
        pcbX={-4.3}
        pcbY={6.5}
        schX={-10}
        schY={8}
        schSheetName="Dual_Motor_Driver"
        schSectionName="driver_support"
        connections={{ pin1: "net.VM", pin2: "net.GND" }}
      />
      <CL21A106KAYNNNE
        name="C4"
        schOrientation="vertical"
        pcbX={4.3}
        pcbY={7}
        schX={-6}
        schY={8}
        schSheetName="Dual_Motor_Driver"
        schSectionName="driver_support"
        connections={{ pin1: "net.VM", pin2: "net.GND" }}
      />
      <CL10A225KO8NNNC
        name="C5"
        schOrientation="vertical"
        pcbX={-0.975}
        pcbY={5.65}
        pcbRotation={90}
        schX={0}
        schY={8}
        schSheetName="Dual_Motor_Driver"
        schSectionName="driver_support"
        connections={{ pin1: "net.VINT", pin2: "net.GND" }}
      />
      <A_0603B103K500NT
        name="C6"
        schOrientation="vertical"
        pcbX={0.975}
        pcbY={5.65}
        pcbRotation={90}
        schX={6}
        schY={8}
        schSheetName="Dual_Motor_Driver"
        schSectionName="driver_support"
        connections={{ pin1: "net.VCP", pin2: "net.VM" }}
      />
    </>
  )
}
