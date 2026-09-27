import { Fragment } from "react"
import mechanical from "../references/mechanical.json"

export function ChassisMounting() {
  return (
    <>
      {mechanical.holes.map((hole) => (
        <Fragment key={hole.name}>
          <hole
            name={hole.name}
            diameter={mechanical.hole_diameter_mm}
            pcbX={hole.x_mm}
            pcbY={hole.y_mm}
          />
          <keepout
            shape="circle"
            radius={mechanical.hardware_keepout_radius_mm}
            pcbX={hole.x_mm}
            pcbY={hole.y_mm}
            layers={["top", "inner1", "inner2", "bottom"]}
          />
          <silkscreencircle
            radius={mechanical.hardware_keepout_radius_mm}
            pcbX={hole.x_mm}
            pcbY={hole.y_mm}
            strokeWidth={0.15}
          />
        </Fragment>
      ))}
      <silkscreentext
        text="DUAL TT / REV A"
        pcbX={-19}
        pcbY={25}
        fontSize={1}
      />
      <silkscreentext
        text="3–6V MOTOR / PROTOTYPE"
        pcbX={-19}
        pcbY={22.5}
        fontSize={0.8}
      />
    </>
  )
}
