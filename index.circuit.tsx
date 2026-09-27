import { savedRouting } from "./lib/saved-routing"
import { GroundStitching } from "./lib/ground-stitching"
import { RoutingNets } from "./lib/routing-nets"
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
      routingDisabled={false}
      routeRemaining={false}
      autorouter={{ local: true, allowViaInPad: false }}
      autorouterVersion="beta_pipeline9"
      autorouterEffortLevel="5x"
      minTraceWidth="0.25mm"
      nominalTraceWidth="0.25mm"
      minTraceToPadEdgeClearance="0.15mm"
      minViaEdgeToPadEdgeClearance="0.2mm"
      minBoardEdgeClearance="0.5mm"
      minViaHoleDiameter="0.3mm"
      minViaPadDiameter="0.45mm"
      isViaInPadAllowed={false}
      title="Dual TT Motor Driver — REV A PROTOTYPE"
    >
      <ChassisMounting />
      <RoutingNets />
      <PowerProtection />
      <MotorDriver />
      <ControlDebug />
      <TemperatureTest />
      <GroundStitching />
      <autoroutingphase
        name="reviewed_signal_routes"
        phaseIndex={0}
        pcbTracePaths={savedRouting}
      />
      <copperpour
        name="GND_TOP"
        connectsTo="net.GND"
        layer="top"
        clearance="0.2mm"
        traceMargin="0.6mm"
        coveredWithSolderMask
        boardEdgeMargin="0.5mm"
        useThermalReliefs={false}
      />
      <copperpour
        name="GND_INNER"
        connectsTo="net.GND"
        layer="inner1"
        clearance="0.2mm"
        traceMargin="0.6mm"
        coveredWithSolderMask
        boardEdgeMargin="0.5mm"
        useThermalReliefs={false}
      />
      <copperpour
        name="GND_BOTTOM"
        connectsTo="net.GND"
        layer="bottom"
        clearance="0.2mm"
        traceMargin="0.6mm"
        coveredWithSolderMask
        boardEdgeMargin="0.5mm"
        useThermalReliefs={false}
      />
    </board>
  )
}
