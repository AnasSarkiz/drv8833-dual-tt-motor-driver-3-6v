import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["1A"],
  pin2: ["1B"],
  pin3: ["2Y"],
  pin4: ["GND"],
  pin5: ["2A"],
  pin6: ["2B"],
  pin7: ["1Y"],
  pin8: ["VCC"]
} as const

const pinAttributes = {
  pin4: {requiresGround: true},
  pin8: {requiresPower: true}
} as const

export const SN74LVC2G86DCTR = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C130023"
  ]
}}
      manufacturerPartNumber="SN74LVC2G86DCTR"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="1.99249665mm" pcbY="-0.974852mm" width="0.729996mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="1.99249665mm" pcbY="-0.324866mm" width="0.729996mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="1.99249665mm" pcbY="0.32512mm" width="0.729996mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="1.99249665mm" pcbY="0.975106mm" width="0.729996mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-2.00749535mm" pcbY="0.97536mm" width="0.6999986mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-2.00749535mm" pcbY="0.32512mm" width="0.6999986mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-2.00749535mm" pcbY="-0.32512mm" width="0.6999986mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-2.00749535mm" pcbY="-0.97536mm" width="0.6999986mm" height="0.3999992mm" shape="rect" />
<silkscreenpath route={[{"x":1.4924214499999948,"y":-1.384477799999992},{"x":1.4924214499999948,"y":-1.499920799999991},{"x":-1.5075725500000203,"y":-1.499920799999991}]} />
<silkscreenpath route={[{"x":-1.5075725500000203,"y":1.3851128000000017},{"x":-1.5075725500000203,"y":1.5000732000000099},{"x":1.4924214499999948,"y":1.5000732000000099},{"x":1.4924214499999948,"y":1.384884200000002}]} />
<silkscreenpath route={[{"x":-1.5075725500000203,"y":-1.499920799999991},{"x":-1.5075725500000203,"y":-1.384960399999997}]} />
<silkscreencircle pcbX="1.09232065mm" pcbY="-0.999998mm" radius="0.127mm" />
<silkscreentext text="{NAME}" pcbX="0.02552065mm" pcbY="2.50114mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-2.599379350000021,"y":1.7511400000000066},{"x":2.650420650000001,"y":1.7511400000000066},{"x":2.650420650000001,"y":-1.7460599999999928},{"x":-2.599379350000021,"y":-1.7460599999999928},{"x":-2.599379350000021,"y":1.7511400000000066}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C130023.obj?uuid=a20ad6d9a7994f0eb3ef7aa133f0e895",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C130023.step?uuid=a20ad6d9a7994f0eb3ef7aa133f0e895",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.007575549999984332, y: -0.00006350000000310274, z: -0.0275 },
      }}
      {...props}
    />
  )
}