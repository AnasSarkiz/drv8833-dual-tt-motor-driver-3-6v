import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"]
} as const

export const A_0453003_MR = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      symbol={
        <symbol>
          <schematicpath points={[{"x":-0.2,"y":0},{"x":0.2,"y":0}]} strokeColor="#8D2323" />
          <port name="pin2" pinNumber={2} aliases={["2"]} direction="right" schX={0.4} schY={0} schStemLength={0.2} />
          <port name="pin1" pinNumber={1} aliases={["1"]} direction="left" schX={-0.4} schY={0} schStemLength={0.2} />
          <schematicrect schX={0} schY={0} width={0.52} height={0.12} strokeWidth={0.02} color="#880000" />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C178991"
  ]
}}
      manufacturerPartNumber="0453003.MR"
      footprint={<footprint>
        <smtpad portHints={["pin2"]} pcbX="2.329942mm" pcbY="0mm" width="2.9100018mm" height="2.9106114mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-2.329942mm" pcbY="0mm" width="2.9100018mm" height="2.9106114mm" shape="rect" />
<silkscreenpath route={[{"x":-4.064000000000078,"y":1.393266199999971},{"x":-4.064000000000078,"y":-1.4007338000001255}]} />
<silkscreenpath route={[{"x":4.0639999999999645,"y":1.3970000000000482},{"x":4.0639999999999645,"y":-1.3969999999999345}]} />
<silkscreenpath route={[{"x":0.8889999999998963,"y":-1.7779999999999063},{"x":3.8099999999999454,"y":-1.7779999999999063}]} />
<silkscreenpath route={[{"x":3.8099999999999454,"y":1.77800000000002},{"x":1.0015981999999894,"y":1.77800000000002}]} />
<silkscreenpath route={[{"x":-0.88900000000001,"y":-1.7779999999999063},{"x":-3.810000000000059,"y":-1.7779999999999063}]} />
<silkscreenpath route={[{"x":-3.810000000000059,"y":1.77800000000002},{"x":-1.0015982000001031,"y":1.77800000000002}]} />
<silkscreenpath route={[{"x":-0.12095480000004954,"y":0.8255000000001473},{"x":-0.26562082541590826,"y":0.6589035198267084},{"x":-0.3177147483028193,"y":0.44450000000006185},{"x":-0.26562082541590826,"y":0.23009648017330164},{"x":-0.12095480000004954,"y":0.06350000000009004}]} />
<silkscreenpath route={[{"x":-0.12095480000004954,"y":-0.8255000000000337},{"x":0.029069622209703994,"y":-0.679043122377152},{"x":0.11046656624989737,"y":-0.48582955721360577},{"x":0.11046656624989737,"y":-0.27617044278633784},{"x":0.029069622209703994,"y":-0.08295687762279158},{"x":-0.12095480000004954,"y":0.06350000000009004}]} />
<silkscreentext text="{NAME}" pcbX="0mm" pcbY="2.778mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.314000000000078,"y":2.02800000000002},{"x":4.3139999999999645,"y":2.02800000000002},{"x":4.3139999999999645,"y":-2.0279999999999063},{"x":-4.314000000000078,"y":-2.0279999999999063},{"x":-4.314000000000078,"y":2.02800000000002}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C178991.obj?uuid=ceafb183c74347baabbacc2158b065b9",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C178991.step?uuid=ceafb183c74347baabbacc2158b065b9",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012699999956566899, y: 0, z: -1.3 },
      }}
      {...props}
    />
  )
}