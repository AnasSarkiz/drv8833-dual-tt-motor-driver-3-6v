import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["C"],
  pin2: ["A"]
} as const

export const SMBJ6_0A = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      symbol={
        <symbol>
          <port name="pin2" pinNumber={2} aliases={["A"]} direction="right" schX={0.4} schY={0} schStemLength={0.2} />
          <port name="pin1" pinNumber={1} aliases={["C"]} direction="left" schX={-0.4} schY={0} schStemLength={0.2} />
          <schematicpath points={[{"x":-0.14,"y":0.18},{"x":-0.14,"y":0.18},{"x":-0.1,"y":0.14},{"x":-0.1,"y":-0.14},{"x":-0.06,"y":-0.18},{"x":-0.06,"y":-0.18}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0.2,"y":0},{"x":0.1,"y":0}]} strokeColor="#880000" />
          <schematicpath points={[{"x":-0.1,"y":0},{"x":-0.2,"y":0}]} strokeColor="#880000" />
          <schematicpath svgPath="M 0.1 0.14 L -0.1 0 L 0.1 -0.14 Z" strokeColor="#880000" />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C5331096"
  ]
}}
      manufacturerPartNumber="SMBJ6.0A"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-2.591308mm" pcbY="0mm" width="2.047494mm" height="2.2409912mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="2.591308mm" pcbY="0mm" width="2.047494mm" height="2.2409912mm" shape="rect" />
<silkscreenpath route={[{"x":-1.0253979999999956,"y":1.8862040000000206},{"x":-1.0253979999999956,"y":-1.886203999999907}]} />
<silkscreenpath route={[{"x":-2.7531060000000025,"y":1.8862040000000206},{"x":2.7343099999999367,"y":1.8862040000000206}]} />
<silkscreenpath route={[{"x":-2.7531060000000025,"y":-1.886203999999907},{"x":2.7343099999999367,"y":-1.886203999999907}]} />
<silkscreenpath route={[{"x":2.7343099999999367,"y":1.8862040000000206},{"x":2.7343099999999367,"y":1.2993877999999768}]} />
<silkscreenpath route={[{"x":2.7343099999999367,"y":-1.886203999999907},{"x":2.7343099999999367,"y":-1.2993877999999768}]} />
<silkscreentext text="{NAME}" pcbX="0.0127mm" pcbY="2.9558mm" anchorAlignment="center" fontSize="1mm" />
<fabricationnotepath route={[{"x":-3.4290000000000873,"y":-0.1269999999999527},{"x":-3.4290000000000873,"y":0.1270000000000664},{"x":-1.6510000000000673,"y":0.1270000000000664},{"x":-1.6510000000000673,"y":-0.1269999999999527},{"x":-3.4290000000000873,"y":-0.1269999999999527}]} strokeWidth="0.254mm" />
<fabricationnotepath route={[{"x":2.640609399999903,"y":-0.8872728000000052},{"x":2.386609399999884,"y":-0.8872728000000052},{"x":2.386609399999884,"y":0.8907272000000148},{"x":2.640609399999903,"y":0.8907272000000148},{"x":2.640609399999903,"y":-0.8872728000000052}]} strokeWidth="0.254mm" />
<fabricationnotepath route={[{"x":3.384270600000036,"y":0.10533379999992576},{"x":3.384270600000036,"y":-0.14866620000009334},{"x":1.6062706000000162,"y":-0.14866620000009334},{"x":1.6062706000000162,"y":0.10533379999992576},{"x":3.384270600000036,"y":0.10533379999992576}]} strokeWidth="0.254mm" />
<courtyardoutline outline={[{"x":-3.8567999999999074,"y":2.2058000000000675},{"x":3.8822000000000116,"y":2.2058000000000675},{"x":3.8822000000000116,"y":-2.231200000000058},{"x":-3.8567999999999074,"y":-2.231200000000058},{"x":-3.8567999999999074,"y":2.2058000000000675}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C5331096.obj?uuid=acb0ba035ec44d9bb847900f974b6821",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C5331096.step?uuid=acb0ba035ec44d9bb847900f974b6821",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: -0.000012699999956566899, y: 0, z: -1.2 },
      }}
      {...props}
    />
  )
}