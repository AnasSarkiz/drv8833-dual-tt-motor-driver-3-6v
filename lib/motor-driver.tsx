import { DRV8833PWPR } from "../imports/DRV8833PWPR"
import { CL21A106KAYNNNE } from "../imports/CL21A106KAYNNNE"
import { CL10A225KO8NNNC } from "../imports/CL10A225KO8NNNC"
import { A_0603B103K500NT } from "../imports/A_0603B103K500NT"
import { RL2512FK_070R15L } from "../imports/RL2512FK_070R15L"
import { KF301_5_0_2P } from "../imports/KF301_5_0_2P"

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
      <DRV8833PWPR
        name="U1"
        pcbX={0}
        pcbY={0}
        schX={0}
        schY={0}
        schWidth={5}
        schHeight={7}
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
      />
      <RL2512FK_070R15L
        name="R2"
        pcbX={-4.5}
        pcbY={-7}
        schX={-5}
        schY={-7}
        schSheetName="Dual_Motor_Driver"
        schSectionName="bridge"
        connections={{ pin1: "net.ISEN_A", pin2: "net.GND" }}
      />
      <RL2512FK_070R15L
        name="R3"
        pcbX={5}
        pcbY={-7}
        schX={5}
        schY={-7}
        schSheetName="Dual_Motor_Driver"
        schSectionName="bridge"
        connections={{ pin1: "net.ISEN_B", pin2: "net.GND" }}
      />
      <KF301_5_0_2P
        name="J2"
        pcbX={-3}
        pcbY={-17}
        schX={-10}
        schY={0}
        schSheetName="Dual_Motor_Driver"
        schSectionName="bridge"
        connections={{ pin1: "net.AOUT1", pin2: "net.AOUT2" }}
      />
      <KF301_5_0_2P
        name="J3"
        pcbX={11}
        pcbY={-17}
        schX={10}
        schY={0}
        schSheetName="Dual_Motor_Driver"
        schSectionName="bridge"
        connections={{ pin1: "net.BOUT1", pin2: "net.BOUT2" }}
      />
      <CL21A106KAYNNNE
        name="C3"
        pcbX={-3}
        pcbY={5.5}
        schX={-10}
        schY={8}
        schSheetName="Dual_Motor_Driver"
        schSectionName="driver_support"
        connections={{ pin1: "net.VM", pin2: "net.GND" }}
      />
      <CL21A106KAYNNNE
        name="C4"
        pcbX={2}
        pcbY={6}
        schX={-5}
        schY={8}
        schSheetName="Dual_Motor_Driver"
        schSectionName="driver_support"
        connections={{ pin1: "net.VM", pin2: "net.GND" }}
      />
      <CL10A225KO8NNNC
        name="C5"
        pcbX={-5.5}
        pcbY={1.5}
        pcbRotation={180}
        schX={0}
        schY={8}
        schSheetName="Dual_Motor_Driver"
        schSectionName="driver_support"
        connections={{ pin1: "net.VINT", pin2: "net.GND" }}
      />
      <A_0603B103K500NT
        name="C6"
        pcbX={5.5}
        pcbY={3}
        schX={6}
        schY={8}
        schSheetName="Dual_Motor_Driver"
        schSectionName="driver_support"
        connections={{ pin1: "net.VCP", pin2: "net.VM" }}
      />
    </>
  )
}
