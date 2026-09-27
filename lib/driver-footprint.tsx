import { Fragment } from "react"

// TI PWP0016C, drawing 4224559/B (01/2019), rotated 90 degrees so
// pin 1 is at bottom left. Dimensions are millimetres. See U1_FOOTPRINT.md.
export function DriverFootprint() {
  return (
    <footprint>
      {Array.from({ length: 8 }, (_, index) => (
        <Fragment key={index}>
          <smtpad
            shape="rect"
            portHints={[`pin${index + 1}`]}
            pcbX={-2.275 + index * 0.65}
            pcbY={-2.9}
            width={0.45}
            height={1.5}
            cornerRadius={0.05}
            solderMaskMargin={0.05}
            solderPasteMargin={0}
          />
          <smtpad
            shape="rect"
            portHints={[`pin${16 - index}`]}
            pcbX={-2.275 + index * 0.65}
            pcbY={2.9}
            width={0.45}
            height={1.5}
            cornerRadius={0.05}
            solderMaskMargin={0.05}
            solderPasteMargin={0}
          />
        </Fragment>
      ))}
      {/* The covered copper and exposed center are one electrical pad. */}
      <smtpad
        shape="rect"
        portHints={["pin17"]}
        width={5}
        height={3.4}
        coveredWithSolderMask
      />
      <smtpad
        shape="rect"
        portHints={["pin17"]}
        width={2.31}
        height={2.46}
        solderMaskMargin={0}
        solderPasteMargin={0}
      />
      {/* Retained four-via option: filled and copper capped before assembly. */}
      <via
        pcbX={0.500126}
        pcbY={0.499872}
        outerDiameter={0.6096}
        holeDiameter={0.3048}
        layers={["top", "bottom"]}
      />
      <via
        pcbX={-0.499872}
        pcbY={0.499872}
        outerDiameter={0.6096}
        holeDiameter={0.3048}
        layers={["top", "bottom"]}
      />
      <via
        pcbX={-0.499872}
        pcbY={-0.500126}
        outerDiameter={0.6096}
        holeDiameter={0.3048}
        layers={["top", "bottom"]}
      />
      <via
        pcbX={0.500126}
        pcbY={-0.500126}
        outerDiameter={0.6096}
        holeDiameter={0.3048}
        layers={["top", "bottom"]}
      />
      <silkscreenpath
        route={[
          { x: -2.7, y: -1.95 },
          { x: -2.7, y: 1.95 },
        ]}
      />
      <silkscreenpath
        route={[
          { x: 2.7, y: -1.95 },
          { x: 2.7, y: 1.95 },
        ]}
      />
      <silkscreencircle pcbX={-3} pcbY={-2.9} radius={0.15} />
      <silkscreentext
        text="{NAME}"
        pcbX={3.8}
        pcbY={-3.5}
        fontSize={0.8}
        anchorAlignment="center"
      />
      <courtyardrect width={6.6} height={7.8} />
    </footprint>
  )
}
