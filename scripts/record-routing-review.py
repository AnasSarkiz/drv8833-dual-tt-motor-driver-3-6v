"""Summarize generated copper geometry; lengths exclude vertical via barrels."""
from collections import Counter, defaultdict
from pathlib import Path
import json
import math

circuit = json.loads(Path('dist/index/circuit.json').read_text())
by_type = defaultdict(list)
for element in circuit:
    by_type[element['type']].append(element)
net_names = {net['source_net_id']: net['name'] for net in by_type['source_net']}
source_traces = {trace['source_trace_id']: trace for trace in by_type['source_trace']}
graph = defaultdict(set)
for trace in by_type['source_trace']:
    members = trace['connected_source_port_ids'] + trace['connected_source_net_ids']
    for member in members:
        graph[member].update(members)

def trace_net(trace):
    source = source_traces[trace['source_trace_id']]
    pending = list(source['connected_source_port_ids'] + source['connected_source_net_ids'])
    seen = set()
    names = set()
    while pending:
        member = pending.pop()
        if member in seen:
            continue
        seen.add(member)
        if member in net_names:
            names.add(net_names[member])
        pending.extend(graph[member] - seen)
    assert len(names) == 1, (trace['pcb_trace_id'], names)
    return names.pop()

nets = defaultdict(lambda: {'trace_count': 0, 'length_mm': 0, 'widths_mm': set(), 'layers': set()})
for trace in by_type['pcb_trace']:
    net = nets[trace_net(trace)]
    net['trace_count'] += 1
    for start, end in zip(trace['route'], trace['route'][1:]):
        if start['route_type'] != 'wire' or end['route_type'] != 'wire':
            continue
        if start['layer'] != end['layer']:
            continue
        length_mm = math.hypot(end['x'] - start['x'], end['y'] - start['y'])
        if length_mm < 1e-8:
            continue
        net['length_mm'] += length_mm
        net['widths_mm'].add(start['width'])
        net['layers'].add(start['layer'])
for net in nets.values():
    net['length_mm'] = round(net['length_mm'], 3)
    net['widths_mm'] = sorted(net['widths_mm'])
    net['layers'] = sorted(net['layers'])
via_sizes = Counter((via['hole_diameter'], via['outer_diameter']) for via in by_type['pcb_via'])
report = {
    'note': 'Planar trace lengths sum all branches and exclude vertical barrels. Geometry is not a current rating.',
    'trace_count': len(by_type['pcb_trace']),
    'via_count': len(by_type['pcb_via']),
    'via_sizes': [{'drill_mm': drill, 'pad_mm': pad, 'count': count} for (drill, pad), count in sorted(via_sizes.items())],
    'pour_polygons_by_layer': dict(Counter(pour['layer'] for pour in by_type['pcb_copper_pour'])),
    'nets': dict(sorted(nets.items())),
}
Path('artifacts/routed/routing-metrics.json').write_text(json.dumps(report, indent=2)+'\n')
print(json.dumps({key: report[key] for key in ['trace_count', 'via_count', 'via_sizes', 'pour_polygons_by_layer']}))
for name in ['VIN', 'VIN_FUSED', 'VM', 'AOUT1', 'AOUT2', 'BOUT1', 'BOUT2', 'ISEN_A', 'ISEN_B']:
    print(name, nets[name])
