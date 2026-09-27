import { AO3401A } from "../imports/AO3401A"
import { A_1812L300_24GR } from "../imports/A_1812L300_24GR"
import { KF301_5_0_2P } from "../imports/KF301_5_0_2P"
import { VZH221M1CTR_0607 } from "../imports/VZH221M1CTR_0607"
import { SMBJ6_0A } from "../imports/SMBJ6_0A"
import { A_0603WAF2201T5E } from "../imports/A_0603WAF2201T5E"
import { KT_0603YG } from "../imports/KT_0603YG"

export function PowerProtection() {
  return (
    <>
      <schematicsheet name="Power_Protection" sheetIndex={0} />
      <schematicsection
        name="power_path"
        displayName="Input protection — candidate, review open"
      />
      <schematicsection
        name="bus_storage"
        displayName="Bus storage and transient mitigation"
      />
      <KF301_5_0_2P
        name="J1"
        pcbX={-28}
        pcbY={10}
        schX={-12}
        schY={4}
        schSheetName="Power_Protection"
        schSectionName="power_path"
        connections={{ pin1: "net.VIN", pin2: "net.GND" }}
      />
      <A_1812L300_24GR
        name="F1"
        pcbX={-18}
        pcbY={11}
        schX={-6}
        schY={4}
        schSheetName="Power_Protection"
        schSectionName="power_path"
        connections={{ pin1: "net.VIN", pin2: "net.VIN_FUSED" }}
      />
      <AO3401A
        name="Q1"
        pcbX={-12}
        pcbY={11}
        schX={0}
        schY={4}
        schSheetName="Power_Protection"
        schSectionName="power_path"
        connections={{ D: "net.VIN_FUSED", S: "net.VM", G: "net.GND" }}
      />
      <VZH221M1CTR_0607
        name="C1"
        pcbX={-22}
        pcbY={0}
        schX={-8}
        schY={-4}
        schSheetName="Power_Protection"
        schSectionName="bus_storage"
        connections={{ pin1: "net.VM", pin2: "net.GND" }}
      />
      <VZH221M1CTR_0607
        name="C2"
        pcbX={-12}
        pcbY={0}
        schX={-3}
        schY={-4}
        schSheetName="Power_Protection"
        schSectionName="bus_storage"
        connections={{ pin1: "net.VM", pin2: "net.GND" }}
      />
      <SMBJ6_0A
        name="D1"
        pcbX={-28}
        pcbY={-10}
        schX={2}
        schY={-4}
        schSheetName="Power_Protection"
        schSectionName="bus_storage"
        connections={{ C: "net.VM", A: "net.GND" }}
      />
      <A_0603WAF2201T5E
        name="R1"
        pcbX={-19}
        pcbY={-10}
        schX={8}
        schY={-2}
        schSheetName="Power_Protection"
        schSectionName="bus_storage"
        connections={{ pin1: "net.VM", pin2: "net.LED_VM_A" }}
      />
      <KT_0603YG
        name="LED1"
        pcbX={-14}
        pcbY={-10}
        schX={8}
        schY={-6}
        schSheetName="Power_Protection"
        schSectionName="bus_storage"
        connections={{ anode: "net.LED_VM_A", cathode: "net.GND" }}
      />
    </>
  )
}
