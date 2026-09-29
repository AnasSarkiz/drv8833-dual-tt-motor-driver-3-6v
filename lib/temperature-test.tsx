import { HostHeader } from "./parts"
import { A_0603WAF1001T5E } from "../imports/A_0603WAF1001T5E"
import { A_0603WAF5602T5E } from "../imports/A_0603WAF5602T5E"
import { BoardThermistor } from "./parts"
import { CC0603KRX7R9BB104 } from "../imports/CC0603KRX7R9BB104"
import { SchematicNote } from "./schematic-note"

export function TemperatureTest() {
  return (
    <>
      <schematicsheet name="Temperature_Test" sheetIndex={3}>
        <SchematicNote
          schX={-9}
          schY={-4.2}
          lines={[
            "TH1: local board-temperature sensor, 10k NTC at 25 C",
            "TEMP = 0.1515 x VIO at 25 C (nominal)",
            "Host must monitor TEMP; no automatic thermal cutoff",
          ]}
        />
      </schematicsheet>
      <schematicsection
        name="temperature"
        displayName="Local board temperature — not motor or junction"
      />
      <schematicsection
        name="diagnostic"
        displayName="Status and temperature connector"
      />
      <schematicsection name="testpads" displayName="Labeled test access" />
      <A_0603WAF5602T5E
        name="R19"
        schOrientation="vertical"
        pcbX={-6}
        pcbY={10}
        pcbRotation={180}
        schX={-8}
        schY={4}
        schSheetName="Temperature_Test"
        schSectionName="temperature"
        connections={{ pin1: "net.VIO", pin2: "net.TEMP_RAW" }}
      />
      <BoardThermistor
        name="TH1"
        schRotation={-180}
        pcbX={-9}
        pcbY={7}
        pcbRotation={180}
        schX={-8}
        schY={-2}
        schSheetName="Temperature_Test"
        schSectionName="temperature"
        connections={{ pin1: "net.TEMP_RAW", pin2: "net.GND" }}
      />
      <A_0603WAF1001T5E
        name="R20"
        pcbX={29}
        pcbY={-15}
        schX={-2}
        schY={1}
        schSheetName="Temperature_Test"
        schSectionName="temperature"
        connections={{ pin1: "net.TEMP_RAW", pin2: "net.TEMP" }}
      />
      <CC0603KRX7R9BB104
        name="C8"
        schOrientation="vertical"
        pcbX={24}
        pcbY={-15}
        pcbRotation={180}
        schX={3}
        schY={-2}
        schSheetName="Temperature_Test"
        schSectionName="temperature"
        connections={{ pin1: "net.TEMP", pin2: "net.GND" }}
      />
      <HostHeader
        name="J7"
        pcbX={26}
        pcbY={-20}
        pcbRotation={180}
        schX={10}
        schY={4}
        schSheetName="Temperature_Test"
        schSectionName="diagnostic"
        connections={{ pin1: "net.FAULT_N", pin2: "net.TEMP", pin3: "net.GND" }}
      >
        <SchematicNote
          schX={-6}
          schY={2.4}
          lines={[
            "J7: DIAGNOSTICS TO HOST",
            "FAULT_N: active low; TEMP: analog output",
          ]}
        />
      </HostHeader>
      {(
        ["ISEN_A", "ISEN_B", "GND", "VM", "VIO", "FAULT_N", "TEMP"] as const
      ).map((netName, index) => (
        <testpoint
          key={netName}
          name={`TP${index + 1}`}
          footprintVariant="pad"
          padDiameter="1.2mm"
          footprint={
            <footprint>
              <smtpad
                shape="circle"
                radius={0.6}
                solderPasteMargin={-0.6}
                portHints={["pin1"]}
              />
              <courtyardcircle radius={0.85} />
            </footprint>
          }
          pcbX={
            netName === "ISEN_B" ? 14 : netName === "VM" ? -20 : -16 + index * 4
          }
          pcbY={netName === "ISEN_B" ? -13 : netName === "VM" ? -7 : -15}
          schX={-14 + index * 4}
          schY={-9}
          schSheetName="Temperature_Test"
          schSectionName="testpads"
          connections={{ pin1: `net.${netName}` }}
        />
      ))}
    </>
  )
}
