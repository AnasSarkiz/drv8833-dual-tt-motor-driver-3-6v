import { PowerProtection } from "./lib/power-protection"
import { MotorDriver } from "./lib/motor-driver"
import { ControlDebug } from "./lib/control-debug"
import { TemperatureTest } from "./lib/temperature-test"

// Electrical study only: outline and mounting holes await the actual mounting arrangement.
export default function DualTtMotorDriver() {
  return (
    <board
      layers={4}
      routingDisabled={true}
      minViaHoleDiameter="0.3mm"
      minViaPadDiameter="0.45mm"
      isViaInPadAllowed={true}
      title="Dual TT Motor Driver — UNROUTED / MECHANICAL FIT PENDING"
    >
      <net name="GND" isGroundNet />
      <net name="VM" isPowerNet />
      <net name="VIO" isPowerNet />
      <PowerProtection />
      <MotorDriver />
      <ControlDebug />
      <TemperatureTest />
    </board>
  )
}
