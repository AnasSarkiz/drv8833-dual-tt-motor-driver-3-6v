import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"]
} as const

export const A_2_54_1_3P_ = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C49257"
  ]
}}
      manufacturerPartNumber="2.54-1*3P针"
      footprint={<footprint>
        <platedhole  portHints={["pin3"]} pcbX="2.5337008mm" pcbY="0mm" outerDiameter="1.5999968mm" holeDiameter="1.1000232mm" shape="circle" />
<platedhole  portHints={["pin2"]} pcbX="-0.0062992mm" pcbY="0mm" outerDiameter="1.5999968mm" holeDiameter="1.1000232mm" shape="circle" />
<platedhole  portHints={["pin1"]} pcbX="-2.5462992mm" pcbY="0mm" holeWidth="1.1000232mm" holeHeight="1.1000232mm" outerWidth="1.5748mm" outerHeight="1.5999968mm" rectPad={true} pcbRotation="0deg" shape="pill" />
<silkscreenpath route={[{"x":-1.9112991999999736,"y":1.2699999999999818},{"x":-3.816299200000003,"y":1.2699999999999818},{"x":-3.816299200000003,"y":-1.2700000000000102},{"x":3.8037008000000014,"y":-1.2700000000000102},{"x":3.8037008000000014,"y":1.2699999999999818}]} />
<silkscreenpath route={[{"x":3.8037008000000014,"y":1.2699999999999818},{"x":-1.9112991999999736,"y":1.2699999999999818}]} />
<silkscreentext text="{NAME}" pcbX="-0.0189992mm" pcbY="2.27mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.091699199999937,"y":1.5199999999999818},{"x":4.053700800000001,"y":1.5199999999999818},{"x":4.053700800000001,"y":-1.5200000000000102},{"x":-4.091699199999937,"y":-1.5200000000000102},{"x":-4.091699199999937,"y":1.5199999999999818}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C49257.obj?uuid=c023159e66794c6e8fc0907055f01d55",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C49257.step?uuid=c023159e66794c6e8fc0907055f01d55",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: -2.533700799999999, y: 0, z: -0.000005999999999950489 },
      }}
      {...props}
    />
  )
}