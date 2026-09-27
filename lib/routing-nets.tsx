import { Fragment } from "react"

// Ground is joined by the top, inner1 and bottom copper pours. Every other net
// is assigned explicitly; physical connectivity checks still include GND.
const motorCurrentNets = new Set([
  "VIN",
  "VIN_FUSED",
  "VM",
  "AOUT1",
  "AOUT2",
  "BOUT1",
  "BOUT2",
  "ISEN_A",
  "ISEN_B",
])
const signalNets = [
  "VIN",
  "VIN_FUSED",
  "VM",
  "VIO",
  "AOUT1",
  "AOUT2",
  "BOUT1",
  "BOUT2",
  "ISEN_A",
  "ISEN_B",
  "ENABLE",
  "FAULT_N",
  "LED_VM_A",
  "AIN1",
  "AIN2",
  "BIN1",
  "BIN2",
  "VCP",
  "VINT",
  "HOST_ENABLE",
  "HOST_AIN1",
  "HOST_AIN2",
  "HOST_BIN1",
  "HOST_BIN2",
  "A_CMD",
  "B_CMD",
  "LED_VIO_A",
  "LED_A_CMD_A",
  "LED_B_CMD_A",
  "LED_FAULT_A",
  "TEMP_RAW",
  "TEMP",
]

export function RoutingNets() {
  return (
    <>
      <net name="GND" isGroundNet />
      {signalNets.map((name) => (
        <Fragment key={name}>
          <net
            name={name}
            nominalTraceWidth={motorCurrentNets.has(name) ? "1mm" : "0.25mm"}
            routingPhaseIndex={0}
          />
        </Fragment>
      ))}
    </>
  )
}
