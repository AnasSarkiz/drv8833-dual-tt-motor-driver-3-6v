from pathlib import Path
from collections import defaultdict
import json, math, csv, hashlib, os
root=Path(__file__).resolve().parent.parent
review_directory = root / os.environ.get('DUAL_TT_REVIEW_DIR', 'artifacts/order-review')
review_directory.mkdir(parents=True, exist_ok=True)
c=json.loads((root/'dist/index/circuit.json').read_text())
by=defaultdict(list)
for e in c: by[e['type']].append(e)
net_names={e['subcircuit_connectivity_map_key']:e['name'] for e in by['source_net']}
source_traces={e['source_trace_id']:e for e in by['source_trace']}
source_ports={e['source_port_id']:e for e in by['source_port']}
pcb_ports={e['pcb_port_id']:e for e in by['pcb_port']}
components={e['source_component_id']:e['name'] for e in by['source_component']}

def net(e):
 if 'source_net_id' in e:
  return next(n['name'] for n in by['source_net'] if n['source_net_id']==e['source_net_id'])
 if 'subcircuit_connectivity_map_key' in e: return net_names[e['subcircuit_connectivity_map_key']]
 if 'source_trace_id' in e: return net(source_traces[e['source_trace_id']])
 if 'source_port_id' in e: return net(source_ports[e['source_port_id']])
 if 'pcb_port_id' in e: return net(pcb_ports[e['pcb_port_id']])
 raise ValueError(e)
def ident(e): return e.get(e['type']+'_id')
def xy(e): return e['x'],e['y']
def dist(a,b): return math.dist(a,b)
def pt_seg(p,seg):
 a,b=seg; d=(b[0]-a[0],b[1]-a[1]); q=d[0]*d[0]+d[1]*d[1]
 if q==0:return dist(p,a)
 t=max(0,min(1,((p[0]-a[0])*d[0]+(p[1]-a[1])*d[1])/q))
 return dist(p,(a[0]+t*d[0],a[1]+t*d[1]))
def cross(a,b):return a[0]*b[1]-a[1]*b[0]
def intersects(seg1,seg2):
 a,b=seg1; cc,d=seg2; ab=(b[0]-a[0],b[1]-a[1]); cd=(d[0]-cc[0],d[1]-cc[1]); ca=(cc[0]-a[0],cc[1]-a[1]); den=cross(ab,cd)
 if abs(den)<1e-10:return False
 t=cross(ca,cd)/den; u=cross(ca,ab)/den
 return 1e-7<t<1-1e-7 and 1e-7<u<1-1e-7
segments=[]; traces=[]
for trace in by['pcb_trace']:
 seq=trace['route']; own=[]; narrow=[]; bends=[]
 for i,(a,b) in enumerate(zip(seq,seq[1:])):
  if a['route_type']!='wire' or b['route_type']!='wire' or a['layer']!=b['layer']:continue
  length=dist(xy(a),xy(b))
  if length<1e-8:continue
  seg={'trace':ident(trace),'net':net(trace),'index':i,'layer':a['layer'],'a':xy(a),'b':xy(b),'width':a['width'],'length':length}
  segments.append(seg);own.append(seg)
  if a['width']<.5:narrow.append(seg)
 for a,b in zip(own,own[1:]):
  if a['layer']!=b['layer'] or dist(a['b'],b['a'])>1e-6 or min(a['length'],b['length'])<.05:continue
  u=(a['b'][0]-a['a'][0],a['b'][1]-a['a'][1]); v=(b['b'][0]-b['a'][0],b['b'][1]-b['a'][1])
  turn=math.degrees(math.acos(max(-1,min(1,(u[0]*v[0]+u[1]*v[1])/(a['length']*b['length'])))))
  if turn>90.01:bends.append({'xy':a['b'],'turn_degrees':round(turn,2),'adjacent_lengths_mm':[a['length'],b['length']]})
 crossings=[]
 for i,a in enumerate(own):
  for b in own[i+2:]:
   if a['layer']==b['layer'] and intersects((a['a'],a['b']),(b['a'],b['b'])):crossings.append([a['index'],b['index']])
 widths=defaultdict(float)
 for a in own:widths[str(a['width'])]+=a['length']
 traces.append({'trace_id':ident(trace),'net':net(trace),'length_mm':sum(a['length'] for a in own),'width_length_mm':dict(widths),'layers':sorted(set(a['layer'] for a in own)),'via_transitions':sum(a['route_type']=='via' for a in seq),'nonzero_segments':len(own),'sub_0_05mm_segments':sum(a['length']<.05 for a in own),'turns_over_90_degrees':bends,'proper_self_crossings':crossings,'narrow_segments':narrow})
holes=[]
for e in by['pcb_via']+by['pcb_plated_hole']+by['pcb_hole']:
 diameter=e.get('hole_diameter')
 if diameter is None:
  assert abs(e['hole_width']-e['hole_height'])<1e-9
  diameter=e['hole_width']
 holes.append({'id':ident(e),'xy':xy(e),'radius':diameter/2,'kind':e['type'],'net':net(e) if e['type']!='pcb_hole' else None})
clearance=[]; minima={}; hole_pairs=[]
for h in holes:
 for seg in segments:
  if h['net']==seg['net']:continue
  gap=pt_seg(h['xy'],(seg['a'],seg['b']))-h['radius']-seg['width']/2
  limit=.28 if h['kind']=='pcb_plated_hole' else .2
  if seg['layer'].startswith('inner') and h['kind']=='pcb_plated_hole':limit=.3
  rec={'hole':h['id'],'hole_net':h['net'],'trace':seg['trace'],'trace_net':seg['net'],'segment':seg['index'],'layer':seg['layer'],'gap_mm':gap,'minimum_mm':limit}
  key=h['kind']+'_'+('inner' if seg['layer'].startswith('inner') else 'outer')
  if key not in minima or gap<minima[key]['gap_mm']:minima[key]=rec
  if gap<limit-1e-5:clearance.append(rec)
for i,h in enumerate(holes):
 for hh in holes[i+1:]:
  if 'pcb_hole' in [h['kind'],hh['kind']]: continue
  limit=.2 if h['kind']==hh['kind']=='pcb_via' else .45
  gap=dist(h['xy'],hh['xy'])-h['radius']-hh['radius']
  if gap<limit-1e-5:hole_pairs.append({'holes':[h['id'],hh['id']],'gap_mm':gap,'minimum_mm':limit})
report={'source_sha256':hashlib.sha256((root/'dist/index/circuit.json').read_bytes()).hexdigest(),'trace_count':len(traces),'segment_count':len(segments),'traces':traces,'hole_to_trace_minima':minima,'hole_to_trace_violations':clearance,'hole_spacing_violations':hole_pairs,'scope':'Exact centerline/capsule trace geometry and round drills; this supplemental audit does not replace native DRC, polygon/mask validation or manufacturer CAM review.'}
(review_directory/'trace-geometry.json').write_text(json.dumps(report,indent=2)+'\n')
print('TRACES',len(traces),'SEGMENTS',len(segments),'HOLE TRACE VIOLATIONS',len(clearance),'HOLE HOLE VIOLATIONS',len(hole_pairs))
print('MINIMA',json.dumps(minima,indent=2))
for t in traces:
 if t['turns_over_90_degrees'] or t['proper_self_crossings']:print('SHAPE',t['trace_id'],t['net'],'bends',t['turns_over_90_degrees'],'self_crossings',t['proper_self_crossings'])
for netname in ['VIN','VIN_FUSED','VM','AOUT1','AOUT2','BOUT1','BOUT2','ISEN_A','ISEN_B','VCP','VINT']:
 for t in traces:
  if t['net']==netname: print('POWER',t['trace_id'],netname,round(t['length_mm'],3),{k:round(v,3) for k,v in t['width_length_mm'].items()})

# Drill-to-pad and drill-to-pour checks cover geometry outside routed traces.
def inside_ring(p, vertices):
 inside=False
 for a,b in zip(vertices,vertices[1:]+vertices[:1]):
  if (a['y']>p[1])!=(b['y']>p[1]):
   crossing_x=a['x']+(p[1]-a['y'])*(b['x']-a['x'])/(b['y']-a['y'])
   if p[0]<crossing_x:inside=not inside
 return inside

def pad_distance(p, pad):
 if pad['shape']=='circle':return max(0,dist(p,xy(pad))-pad.get('radius',pad.get('outer_diameter',0)/2))
 assert pad.get('ccw_rotation',0)%90==0 and pad.get('rect_ccw_rotation',0)%90==0
 width=pad.get('width',pad.get('rect_pad_width'));height=pad.get('height',pad.get('rect_pad_height'))
 assert width is not None and height is not None
 return math.hypot(max(0,abs(p[0]-pad['x'])-width/2),max(0,abs(p[1]-pad['y'])-height/2))

extra=[]; extra_minima={}
for hole in holes:
 for pad in by['pcb_smtpad']+by['pcb_plated_hole']:
  if net(pad)==hole['net'] or ident(pad)==hole['id']:continue
  gap=pad_distance(hole['xy'],pad)-hole['radius']
  limit=.2 if hole['kind']!='pcb_plated_hole' else .28
  key=hole['kind']+'_to_pad'
  rec={'hole':hole['id'],'feature':ident(pad),'gap_mm':gap,'minimum_mm':limit}
  if key not in extra_minima or gap<extra_minima[key]['gap_mm']:extra_minima[key]=rec
  if gap<limit-1e-5:extra.append(rec)
 for pour in by['pcb_copper_pour']:
  if net(pour)==hole['net']:continue
  assert pour['shape']=='brep'
  brep=pour['brep_shape']; outer=brep['outer_ring']['vertices'];inners=[ring['vertices'] for ring in brep['inner_rings']]
  rings=[outer]+inners
  inside=inside_ring(hole['xy'],outer) and not any(inside_ring(hole['xy'],ring) for ring in inners)
  distance=0 if inside else min(pt_seg(hole['xy'],(xy(a),xy(b))) for ring in rings for a,b in zip(ring,ring[1:]+ring[:1]))
  gap=distance-hole['radius']
  limit=.3 if pour['layer'].startswith('inner') and hole['kind']=='pcb_plated_hole' else .2
  key=hole['kind']+'_to_pour'
  rec={'hole':hole['id'],'feature':ident(pour),'layer':pour['layer'],'gap_mm':gap,'minimum_mm':limit}
  if key not in extra_minima or gap<extra_minima[key]['gap_mm']:extra_minima[key]=rec
  if gap<limit-1e-5:extra.append(rec)
report['hole_to_pad_pour_violations']=extra
report['hole_to_pad_pour_minima']=extra_minima
report['scope']='Exact centerline/capsule trace geometry, round drills, axis-aligned pads and generated pour polygon edges. Supplemental review; does not replace native DRC, solder-mask validation or manufacturer CAM review.'
(review_directory/'trace-geometry.json').write_text(json.dumps(report,indent=2)+'\n')
print('DRILL TO PAD/POUR VIOLATIONS',len(extra))
print(json.dumps(extra_minima,indent=2))
with (review_directory/'trace-inventory.csv').open('w') as output:
 writer=csv.writer(output)
 writer.writerow(['Trace','Net','Planar length mm','Minimum width mm','Maximum width mm','Layers','Via transitions','Nonzero segments','Turns >90 deg','Proper self crossings'])
 for t in traces:
  widths=[float(w) for w in t['width_length_mm']]
  writer.writerow([t['trace_id'],t['net'],round(t['length_mm'],3),min(widths),max(widths),'; '.join(t['layers']),t['via_transitions'],t['nonzero_segments'],len(t['turns_over_90_degrees']),len(t['proper_self_crossings'])])
