"""Check mounting geometry in actual output; does not replace the full schema gate."""

import json
import math
from pathlib import Path

mechanical = json.loads(Path("references/mechanical.json").read_text())
circuit = json.loads(Path("dist/index/circuit.json").read_text())
boards = [part for part in circuit if part["type"] == "pcb_board"]
assert len(boards) == 1, "Expected exactly one board"
board = boards[0]
assert board["width"] == mechanical["board_width_mm"]
assert board["height"] == mechanical["board_height_mm"]
assert board["thickness"] == mechanical["board_thickness_mm"]
assert board["center"] == {"x": 0, "y": 0}
holes = [part for part in circuit if part["type"] == "pcb_hole"]
keepouts = [part for part in circuit if part["type"] == "pcb_keepout"]
assert len(holes) == len(mechanical["holes"]) == len(keepouts) == 4
component_names = {
    part["source_component_id"]: part["name"]
    for part in circuit if part["type"] == "source_component"
}
components = {
    part["pcb_component_id"]: part
    for part in circuit if part["type"] == "pcb_component"
}
courtyards = []
for part in circuit:
    if part["type"] == "pcb_courtyard_outline":
        xs = [point["x"] for point in part["outline"]]
        ys = [point["y"] for point in part["outline"]]
        bounds = (min(xs), max(xs), min(ys), max(ys))
    elif part["type"] == "pcb_courtyard_rect":
        x, y = part["center"]["x"], part["center"]["y"]
        assert part.get("ccw_rotation", 0) == 0, "Rotated courtyard requires polygon bounds"
        bounds = (x - part["width"] / 2, x + part["width"] / 2,
                  y - part["height"] / 2, y + part["height"] / 2)
    elif part["type"] == "pcb_courtyard_circle":
        x, y, radius = part["center"]["x"], part["center"]["y"], part["radius"]
        bounds = (x - radius, x + radius, y - radius, y + radius)
    else:
        continue
    component = components[part["pcb_component_id"]]
    name = component_names[component["source_component_id"]]
    assert bounds[0] >= -board["width"] / 2
    assert bounds[1] <= board["width"] / 2
    assert bounds[2] >= -board["height"] / 2
    assert bounds[3] <= board["height"] / 2
    courtyards.append((name, bounds))
assert len(courtyards) == 54, "Every purchased component and test pad needs a courtyard"
print("Board: 75 x 60 x 1.6 mm; four-layer; custom chassis mounting pattern")
for expected in mechanical["holes"]:
    x, y = expected["x_mm"], expected["y_mm"]
    matches = [hole for hole in holes if hole["x"] == x and hole["y"] == y]
    assert len(matches) == 1
    assert matches[0]["hole_shape"] == "circle"
    assert matches[0]["hole_diameter"] == mechanical["hole_diameter_mm"]
    keepout = [part for part in keepouts if part["center"] == {"x": x, "y": y}]
    assert len(keepout) == 1
    assert keepout[0]["layers"] == ["top", "inner1", "inner2", "bottom"]
    assert keepout[0]["radius"] == mechanical["hardware_keepout_radius_mm"]
    clearances = []
    for name, (left, right, bottom, top) in courtyards:
        gap = math.hypot(max(left - x, 0, x - right), max(bottom - y, 0, y - top))
        gap -= mechanical["hardware_keepout_radius_mm"]
        assert gap >= 0.5, f"{name} is too close to {expected['name']}: {gap:.3f} mm"
        clearances.append((gap, name))
    gap, nearest = min(clearances)
    print(f"{expected['name']}: ({x}, {y}) mm; drill 3.2 mm; nearest courtyard {nearest}, gap {gap:.3f} mm beyond 7 mm hardware zone")
print("PASS: outline, four NPTH holes, four-layer keepouts and 54 courtyard envelopes")
print("NOT VERIFIED: any particular chassis, connector mating envelope, screw/tool access in 3D")
