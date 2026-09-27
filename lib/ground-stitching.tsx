import { Fragment } from "react"
// Ground-return stitching at both shunts, C3 and the logic supply. Through
// vias join surface ground copper to inner1 and bottom outside solder pads.
export function GroundStitching() {
  return (
    <>
      <via
        name="GND_C3"
        pcbX={-0.7}
        pcbY={5.9}
        holeDiameter="0.3mm"
        outerDiameter="0.6mm"
        fromLayer="top"
        toLayer="bottom"
        connectsTo="net.GND"
      />
      <trace from="C3.pin2" to="GND_C3.top" pcbStraightLine thickness="0.3mm" />
      <via
        name="GND_LOGIC"
        pcbX={9}
        pcbY={12.7}
        holeDiameter="0.3mm"
        outerDiameter="0.6mm"
        fromLayer="top"
        toLayer="bottom"
        connectsTo="net.GND"
      />
      {[-12.4, 12.4].flatMap((xMm, side) =>
        [-8.4, -9.6].map((yMm, index) => (
          <Fragment key={`${side}-${index}`}>
            <via
              name={`GND_SHUNT_${side}_${index}`}
              pcbX={xMm}
              pcbY={yMm}
              holeDiameter="0.3mm"
              outerDiameter="0.6mm"
              fromLayer="top"
              toLayer="bottom"
              connectsTo="net.GND"
            />
          </Fragment>
        )),
      )}
    </>
  )
}
