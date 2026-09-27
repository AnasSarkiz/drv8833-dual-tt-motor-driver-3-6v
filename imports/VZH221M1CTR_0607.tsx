import type { CapacitorProps } from "@tscircuit/props"

export const VZH221M1CTR_0607 = (props: Omit<CapacitorProps, "capacitance">) => {
  const { name = "C1", ...restProps } = props

  return (
    <capacitor
      name={name}
      capacitance="220uF"
      polarized
      supplierPartNumbers={{
  "jlcpcb": [
    "C285392"
  ]
}}
      manufacturerPartNumber="VZH221M1CTR-0607"
      footprint={<footprint>
        <smtpad portHints={["pin2"]} pcbX="-2.554986mm" pcbY="0mm" width="3.2599884mm" height="1.1500104mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="2.554986mm" pcbY="0mm" width="3.2599884mm" height="1.1500104mm" shape="rect" />
<silkscreenpath route={[{"x":-3.391153999999915,"y":0.6074155999998538},{"x":-3.391153999999915,"y":3.3761679999998933},{"x":1.9650455999999394,"y":3.3761679999998933},{"x":3.361182000000099,"y":1.9800315999999611},{"x":3.361182000000099,"y":0.6074155999998538}]} />
<silkscreenpath route={[{"x":-3.391153999999915,"y":-0.6074156000000812},{"x":-3.391153999999915,"y":-3.376168000000007},{"x":1.9650455999999394,"y":-3.376168000000007},{"x":3.361182000000099,"y":-1.9800316000000748},{"x":3.361182000000099,"y":-0.6074156000000812}]} />
<silkscreentext text="{NAME}" pcbX="0mm" pcbY="4.3782mm" anchorAlignment="center" fontSize="1mm" />
<fabricationnotepath route={[{"x":2.790012200000092,"y":-0.6599936000000071},{"x":2.790012200000092,"y":0.6599935999998934},{"x":2.5920192000000952,"y":0.6599935999998934},{"x":2.5920192000000952,"y":-0.6599936000000071},{"x":2.790012200000092,"y":-0.6599936000000071}]} strokeWidth="0.254mm" />
<fabricationnotepath route={[{"x":3.0870144000000437,"y":-0.09900920000006863},{"x":3.0870144000000437,"y":0.09900919999995494},{"x":2.295016999999916,"y":0.09900919999995494},{"x":2.295016999999916,"y":-0.09900920000006863},{"x":3.0870144000000437,"y":-0.09900920000006863}]} strokeWidth="0.254mm" />
<fabricationnotepath route={[{"x":-3.1169863999999734,"y":-0.09900920000006863},{"x":-3.1169863999999734,"y":0.09900919999995494},{"x":-2.324988999999846,"y":0.09900919999995494},{"x":-2.324988999999846,"y":-0.09900920000006863},{"x":-3.1169863999999734,"y":-0.09900920000006863}]} strokeWidth="0.254mm" />
<courtyardoutline outline={[{"x":-4.441000000000031,"y":3.6281999999999925},{"x":4.441000000000031,"y":3.6281999999999925},{"x":4.441000000000031,"y":-3.6281999999999925},{"x":-4.441000000000031,"y":-3.6281999999999925},{"x":-4.441000000000031,"y":3.6281999999999925}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C285392.obj?uuid=a5bc445325c3463c806debd37226ad2e",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C285392.step?uuid=a5bc445325c3463c806debd37226ad2e",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: -0.05 },
      }}
      {...restProps}
    />
  )
}