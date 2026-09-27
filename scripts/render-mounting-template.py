"""Render a dimensioned 1:1 mounting template from the canonical mechanical spec."""

import json
from pathlib import Path

mechanical = json.loads(Path("references/mechanical.json").read_text())
width = mechanical["board_width_mm"]
height = mechanical["board_height_mm"]
hole_radius = mechanical["hole_diameter_mm"] / 2
hardware_radius = mechanical["hardware_keepout_radius_mm"]
left, top = 25, 30
right, bottom = left + width, top + height
center_x, center_y = (left + right) / 2, (top + bottom) / 2
svg = [f'''<svg xmlns="http://www.w3.org/2000/svg" width="125mm" height="118mm" viewBox="0 0 125 118">
<rect width="125" height="118" fill="white"/>
<style>text{{font-family:Arial,sans-serif;fill:#183047;font-size:2.8px}} .dim{{stroke:#547086;stroke-width:.2;fill:none}} .body{{fill:#eff7f7;stroke:#183047;stroke-width:.35}}</style>
<text x="25" y="9" style="font-size:4px;font-weight:bold">DUAL TT MOTOR DRIVER</text>
<text x="25" y="14">Chassis mounting template / Rev A study</text>
<text x="25" y="19">UNROUTED — NOT FOR FABRICATION</text>
<rect class="body" x="{left}" y="{top}" width="{width}" height="{height}"/>
<path class="dim" d="M {left},{top-2} V 24 H {right} V {top-2}"/>
<text x="{center_x}" y="23" text-anchor="middle">{width} mm</text>
<path class="dim" d="M {right+2},{top} H 106 V {bottom} H {right+2}"/>
<text x="110" y="{center_y}" text-anchor="middle" transform="rotate(90 110 {center_y})">{height} mm</text>
''']
for hole in mechanical["holes"]:
    x, y = center_x + hole["x_mm"], center_y - hole["y_mm"]
    label_y = y + 6 if hole["y_mm"] > 0 else y - 5
    svg.append(f'''<circle cx="{x}" cy="{y}" r="{hardware_radius}" fill="none" stroke="#ba7751" stroke-width=".2" stroke-dasharray=".7 .5"/>
<circle cx="{x}" cy="{y}" r="{hole_radius}" fill="white" stroke="#183047" stroke-width=".25"/>
<path class="dim" d="M {x-2.3},{y} H {x+2.3} M {x},{y-2.3} V {y+2.3}"/>
<text x="{x}" y="{label_y}" text-anchor="middle">{hole['name']}</text>''')
span_x = max(h["x_mm"] for h in mechanical["holes"]) - min(h["x_mm"] for h in mechanical["holes"])
span_y = max(h["y_mm"] for h in mechanical["holes"]) - min(h["y_mm"] for h in mechanical["holes"])
svg.append(f'''<text x="{center_x}" y="51" text-anchor="middle">4 × Ø{2*hole_radius} mm NON-PLATED</text>
<text x="{center_x}" y="56" text-anchor="middle">M3 screws / {span_x} × {span_y} mm centers</text>
<text x="{center_x}" y="61" text-anchor="middle">Centers 5 mm from each adjacent edge</text>
<text x="{center_x}" y="66" text-anchor="middle">Dashed Ø{2*hardware_radius} mm: hardware keepout</text>
<text x="{center_x}" y="71" text-anchor="middle">PCB thickness {mechanical['board_thickness_mm']} mm</text>
<path class="dim" d="M 30,91 V 95 H 95 V 91"/>
<text x="{center_x}" y="99" text-anchor="middle">{span_x} mm between hole centers</text>
<path class="dim" d="M 22,35 H 18 V 85 H 22"/>
<text x="14" y="60" text-anchor="middle" transform="rotate(-90 14 60)">{span_y} mm between centers</text>
<path d="M 25,108 H 75 M 25,106 V 110 M 75,106 V 110" fill="none" stroke="#183047" stroke-width=".4"/>
<text x="25" y="115">50 mm scale check — print at 100%; verify with a ruler.</text>
</svg>''')
destination = Path("artifacts/pre-route/mounting-template.svg")
destination.write_text("\n".join(svg))
print(destination)
