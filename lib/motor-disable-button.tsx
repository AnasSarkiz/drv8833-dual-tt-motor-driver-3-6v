import { TS_1187A_B_A_B } from "../imports/TS_1187A_B_A_B"
import { A_0603WAF2201T5E } from "../imports/A_0603WAF2201T5E"
import { A_0603WAF1003T5E } from "../imports/A_0603WAF1003T5E"
import { SchematicNote } from "./schematic-note"

export function MotorDisableButton() {
  return (
    <>
      <schematicsection
        name="enable_input"
        displayName="Enable input network"
      />
      <schematicsection name="disable_button" displayName="Momentary disable" />
      <A_0603WAF2201T5E
        name="R8"
        pcbX={17}
        pcbY={1}
        pcbRotation={180}
        schX={-10}
        schY={-6}
        schSheetName="Control_Debug"
        schSectionName="enable_input"
        connections={{ pin1: "net.HOST_ENABLE", pin2: "net.ENABLE" }}
      />
      <A_0603WAF1003T5E
        name="R13"
        pcbX={12}
        pcbY={1}
        schOrientation="vertical"
        schX={-4}
        schY={-6}
        schSheetName="Control_Debug"
        schSectionName="enable_input"
        connections={{ pin1: "net.ENABLE", pin2: "net.GND" }}
      />
      <TS_1187A_B_A_B
        name="SW1"
        pcbX={17}
        pcbY={24}
        schX={-4}
        schY={-12}
        schSheetName="Control_Debug"
        schSectionName="disable_button"
        // Manufacturer top view: A-B and C-D are the two permanent pairs.
        internallyConnectedPins={[
          ["pin1", "pin2"],
          ["pin3", "pin4"],
        ]}
        connections={{
          pin1: "net.ENABLE",
          pin2: "net.ENABLE",
          pin3: "net.GND",
          pin4: "net.GND",
        }}
      >
        <SchematicNote
          schX={-3}
          schY={-1.7}
          lines={[
            "SW1: HOLD TO DISABLE; motors coast",
            "Release returns host control; motion can restart",
          ]}
        />
      </TS_1187A_B_A_B>
      <silkscreentext
        text="HOLD TO DISABLE"
        pcbX={17}
        pcbY={20}
        fontSize={0.9}
      />
    </>
  )
}
