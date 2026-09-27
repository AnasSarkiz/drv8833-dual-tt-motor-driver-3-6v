// Littelfuse 451/453 series recommended land pattern, dimensions in mm.
// Footprint-local Cartesian axes: +X right, +Y up; no rotation applied here.
export function FuseFootprint() {
  return (
    <footprint>
      <smtpad
        shape="rect"
        portHints={["pin1"]}
        pcbX={-2.455}
        width={1.96}
        height={3.15}
      />
      <smtpad
        shape="rect"
        portHints={["pin2"]}
        pcbX={2.455}
        width={1.96}
        height={3.15}
      />
      <silkscreenline
        x1={-3.1}
        y1={1.85}
        x2={3.1}
        y2={1.85}
        strokeWidth={0.1}
      />
      <silkscreenline
        x1={-3.1}
        y1={-1.85}
        x2={3.1}
        y2={-1.85}
        strokeWidth={0.1}
      />
      <silkscreentext text="{NAME}" pcbY={2.5} fontSize={0.8} />
      <courtyardoutline
        outline={[
          { x: -3.7, y: -2.1 },
          { x: 3.7, y: -2.1 },
          { x: 3.7, y: 2.1 },
          { x: -3.7, y: 2.1 },
          { x: -3.7, y: -2.1 },
        ]}
      />
    </footprint>
  )
}
