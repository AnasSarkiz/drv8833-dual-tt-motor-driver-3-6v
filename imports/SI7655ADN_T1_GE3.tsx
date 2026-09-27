import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["S1"],
  pin2: ["S2"],
  pin3: ["S3"],
  pin4: ["G"],
  pin5: ["D1"],
  pin6: ["D2"],
  pin7: ["D3"],
  pin8: ["D4"],
  pin9: ["pin9"]
} as const

export const SI7655ADN_T1_GE3 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C222495"
  ]
}}
      manufacturerPartNumber="SI7655ADN-T1-GE3"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-0.974979mm" pcbY="-1.434973mm" width="0.405003mm" height="0.9899904mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-0.324993mm" pcbY="-1.434973mm" width="0.405003mm" height="0.9899904mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="0.324993mm" pcbY="-1.434973mm" width="0.405003mm" height="0.9899904mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="0.974979mm" pcbY="-1.434973mm" width="0.405003mm" height="0.9899904mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="0.974979mm" pcbY="1.434973mm" width="0.405003mm" height="0.9899904mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="0.324993mm" pcbY="1.434973mm" width="0.405003mm" height="0.9899904mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-0.324993mm" pcbY="1.434973mm" width="0.405003mm" height="0.9899904mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-0.974979mm" pcbY="1.434973mm" width="0.405003mm" height="0.9899904mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="0.000127mm" pcbY="0.557403mm" width="2.2349968mm" height="1.7249902mm" shape="rect" />
<silkscreenpath route={[{"x":1.408658599999967,"y":1.6999458000000232},{"x":1.650034799999844,"y":1.6999458000000232}]} />
<silkscreenpath route={[{"x":-1.649983999999904,"y":1.6999458000000232},{"x":-1.408607800000027,"y":1.6999458000000232}]} />
<silkscreenpath route={[{"x":1.650034799999844,"y":-1.7000474000000168},{"x":1.650034799999844,"y":1.6999458000000232}]} />
<silkscreenpath route={[{"x":1.408658599999967,"y":-1.7000474000000168},{"x":1.650034799999844,"y":-1.7000474000000168}]} />
<silkscreenpath route={[{"x":-1.649983999999904,"y":-1.7000474000000168},{"x":-1.408607800000027,"y":-1.7000474000000168}]} />
<silkscreenpath route={[{"x":-1.649983999999904,"y":1.6999458000000232},{"x":-1.649983999999904,"y":-1.7000474000000168}]} />
<silkscreencircle pcbX="-1.410081mm" pcbY="-2.120011mm" radius="0.050038mm" />
<silkscreentext text="{NAME}" pcbX="-0.010287mm" pcbY="2.925193mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-1.923987000000011,"y":2.1751930000000357},{"x":1.9034130000000005,"y":2.1751930000000357},{"x":1.9034130000000005,"y":-2.4142069999999194},{"x":-1.923987000000011,"y":-2.4142069999999194},{"x":-1.923987000000011,"y":2.1751930000000357}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C222495.obj?uuid=83ddc30a76e5494dbc6c5642206c065a",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C222495.step?uuid=83ddc30a76e5494dbc6c5642206c065a",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: -0.000038099999983387534, y: 0.00006350000001020817, z: -0.02 },
      }}
      {...props}
    />
  )
}