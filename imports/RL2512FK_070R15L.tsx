import type { ResistorProps } from "@tscircuit/props"

export const RL2512FK_070R15L = (props: Omit<ResistorProps, "resistance">) => {
  const { name = "R1", ...restProps } = props

  return (
    <resistor
      name={name}
      resistance="150mohm"
      supplierPartNumbers={{
  "jlcpcb": [
    "C876469"
  ]
}}
      manufacturerPartNumber="RL2512FK-070R15L"
      footprint={<footprint>
        <smtpad portHints={["pin2"]} pcbX="3.066288mm" pcbY="0mm" width="1.2825222mm" height="3.4560002mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-3.066288mm" pcbY="0mm" width="1.2825222mm" height="3.4560002mm" shape="rect" />
<silkscreenpath route={[{"x":2.501188799999909,"y":-1.9565873999999894},{"x":3.9361363999998957,"y":-1.9565873999999894},{"x":3.9361363999998957,"y":1.9565874000001031},{"x":2.501188799999909,"y":1.9565874000001031}]} />
<silkscreenpath route={[{"x":-2.5011888000001363,"y":-1.9565873999999894},{"x":-3.9361364000000094,"y":-1.9565873999999894},{"x":-3.9361364000000094,"y":1.9565874000001031},{"x":-2.5011888000001363,"y":1.9565874000001031}]} />
<silkscreentext text="{NAME}" pcbX="0mm" pcbY="2.9558mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.187000000000012,"y":2.2058000000000675},{"x":4.186999999999898,"y":2.2058000000000675},{"x":4.186999999999898,"y":-2.2058000000000675},{"x":-4.187000000000012,"y":-2.2058000000000675},{"x":-4.187000000000012,"y":2.2058000000000675}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C876469.obj?uuid=311a5ea298274ff3b9740151e78a7465",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C876469.step?uuid=311a5ea298274ff3b9740151e78a7465",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012700000070253736, y: 0, z: 0 },
      }}
      {...restProps}
    />
  )
}