import { PowerProtection } from "./lib/power-protection"
import { MotorDriver } from "./lib/motor-driver"
import { ControlDebug } from "./lib/control-debug"
import { TemperatureTest } from "./lib/temperature-test"
import { ChassisMounting } from "./lib/chassis-mounting"
import mechanical from "./references/mechanical.json"

// Standalone chassis module. This is a custom M3 pattern, not a universal chassis standard.
export default function DualTtMotorDriver() {
  return (
    <board
      width={mechanical.board_width_mm}
      height={mechanical.board_height_mm}
      thickness={mechanical.board_thickness_mm}
      layers={4}
      routingDisabled={true}
      minViaHoleDiameter="0.3mm"
      minViaPadDiameter="0.45mm"
      isViaInPadAllowed={true}
      title="Dual TT Motor Driver — UNROUTED / NOT FOR FABRICATION"
    >
      <ChassisMounting />
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
