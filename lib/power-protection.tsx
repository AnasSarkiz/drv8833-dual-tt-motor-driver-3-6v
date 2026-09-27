import { ReversePolarityMosfet } from "./parts"
import { InputFuse } from "./parts"
import { InputTerminal } from "./parts"
import { VZH221M1CTR_0607 } from "../imports/VZH221M1CTR_0607"
import { BusTvs } from "./parts"
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
      <InputTerminal
        name="J1"
        pcbX={-28}
        pcbY={10}
        pcbRotation={270}
        schX={-12}
        schY={4}
        schSheetName="Power_Protection"
        schSectionName="power_path"
        connections={{ pin1: "net.VIN", pin2: "net.GND" }}
      />
      <InputFuse
        name="F1"
        pcbX={-19}
        pcbY={11}
        pcbRotation={90}
        schX={-6}
        schY={4}
        schSheetName="Power_Protection"
        schSectionName="power_path"
        connections={{ pin1: "net.VIN", pin2: "net.VIN_FUSED" }}
      />
      <ReversePolarityMosfet
        name="Q1"
        pcbX={-12}
        pcbY={11}
        schX={0}
        schY={4}
        schSheetName="Power_Protection"
        schSectionName="power_path"
        connections={{
          pin1: "net.VM",
          pin2: "net.VM",
          pin3: "net.VM",
          pin4: "net.GND",
          pin5: "net.VIN_FUSED",
          pin6: "net.VIN_FUSED",
          pin7: "net.VIN_FUSED",
          pin8: "net.VIN_FUSED",
          pin9: "net.VIN_FUSED",
        }}
      />
      <VZH221M1CTR_0607
        name="C1"
        schOrientation="vertical"
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
        schOrientation="vertical"
        pcbX={-12}
        pcbY={0}
        schX={-4}
        schY={-4}
        schSheetName="Power_Protection"
        schSectionName="bus_storage"
        connections={{ pin1: "net.VM", pin2: "net.GND" }}
      />
      <BusTvs
        name="D1"
        pcbX={-28}
        pcbY={-10}
        schX={2}
        schY={-4}
        schSheetName="Power_Protection"
        schSectionName="bus_storage"
        connections={{ pin1: "net.VM", pin2: "net.GND" }}
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
