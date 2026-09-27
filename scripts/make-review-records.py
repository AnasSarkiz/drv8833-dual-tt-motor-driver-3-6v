from pathlib import Path
import hashlib,json,csv,collections
from datetime import datetime,timezone
root=Path(__file__).resolve().parent.parent
circuit=json.loads((root/'dist/index/circuit.json').read_text())
sourcing={r['c_number']:r for r in json.loads((root/'artifacts/pre-route/sourcing.json').read_text())}
manufacturer={'C23138':'UNI-ROYAL','C23206':'UNI-ROYAL','C50506':'Texas Instruments','C130023':'Texas Instruments','C222495':'Vishay','C876469':'Yageo','C13564':'Murata','C15850':'Samsung','C23630':'Samsung','C57112':'Fenghua','C14663':'Yageo','C285392':'Lelon','C83270':'Littelfuse','C178991':'Littelfuse','C474881':'Cixi Kefa','C49257':'BOOMELE','C25804':'UNI-ROYAL','C21190':'UNI-ROYAL','C4190':'UNI-ROYAL','C2286':'Hubei KENTO','C2289':'Hubei KENTO'}
functions={'C23138':'Host input series','C23206':'NTC upper divider resistor','C50506':'Dual H-bridge','C130023':'Command XOR indicators','C222495':'Low-loss reverse-polarity path','C876469':'Independent current shunts','C13564':'Board temperature','C15850':'VM ceramic bypass','C23630':'VINT bypass','C57112':'VCP-to-VM charge pump','C14663':'Logic bypass / TEMP filter','C285392':'Bus bulk storage','C83270':'Bus transient clamp','C178991':'3 A non-resettable input fuse','C474881':'Power / motor terminals','C49257':'Host / diagnostic headers','C25804':'Host input pulls and FAULT pull-up','C21190':'TEMP series','C4190':'LED current limiting','C2286':'FAULT LED','C2289':'VM / VIO / A / B LEDs'}
grouped=collections.defaultdict(list)
for component in circuit:
 if component['type']!='source_component':continue
 numbers=component.get('supplier_part_numbers',{}).get('jlcpcb',[])
 if not numbers:continue
 if len(numbers)!=1:raise RuntimeError(component)
 grouped[numbers[0]].append(component)
assert set(grouped) == set(json.loads((root/'references/selected-parts.json').read_text())), 'Selected parts manifest differs from emitted circuit'
rows=[]
for number,components in grouped.items():
 record=sourcing[number];found=record['supplier_response']['results'];hit=next((h for h in found if str(h['lcsc'])==number[1:]),None)
 paths=[p for p in (root/'imports').glob('*.tsx') if f'"{number}"' in p.read_text()]
 if len(paths)!=1:raise RuntimeError(number)
 mpns={c['manufacturer_part_number'] for c in components}
 if len(mpns)!=1:raise RuntimeError(mpns)
 is_th=number in ['C474881','C49257']
 rows.append({'RefDes':', '.join(c['name'] for c in components),'Qty':len(components),'Function':functions[number],'Manufacturer':manufacturer[number],'Exact MPN/value':next(iter(mpns)),'Package':hit['package'] if hit else '0603','Ratings/tolerance':('Manufacturer: 6 V standoff; 10.3 V clamp at 58.3 A specified pulse; reverse leakage 800 uA max. Catalog 46 nA field is incorrect; see DESIGN_REVIEW.md' if number=='C83270' else hit['description'] if hit else '10 kohm, 1%, 0.1 W; JLC web identity confirmed'),'C-number':number,'JLC Basic/Extended/other':('Basic' if hit['is_basic'] else 'Extended') if hit else 'Basic (JLC web page); CLI search empty','Assembly service / side':'TOP inserted; manual THT pending service review' if is_th else 'TOP SMT; exact service review incomplete','Stock checked + timestamp':f'{hit["stock"] if hit else "UNVERIFIED"}; {record["checked_at"]}','Import path':str(paths[0].relative_to(root)),'Datasheet/source':f'https://jlcpcb.com/partdetail/{number}','Verification status':'IMPORTED; independent geometry/electrical/assembly review incomplete','catalog_unit_price':hit['price'] if hit else None})
(root/'bom.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n')
with (root/'bom.csv').open('w') as f:
 writer=csv.DictWriter(f,fieldnames=rows[0].keys(),lineterminator='\n');writer.writeheader();writer.writerows(rows)
columns=[k for k in rows[0] if k!='catalog_unit_price']
md='# Candidate BOM — NOT APPROVED\n\nGenerated from actual Circuit JSON. 46 purchased parts, 21 unique C-numbers. Seven bare PCB test pads are not purchased parts. No DNP rows. Manufacturer identities must be checked against exact supplier documents before release. Imported identity and catalog fields do not establish suitability or assembly approval.\n\n'
md+='| '+' | '.join(columns)+' |\n| '+' | '.join('---' for _ in columns)+' |\n'
for row in rows:md+='| '+' | '.join(str(row[c]).replace('|',' / ').replace('\n',' ') for c in columns)+' |\n'
subtotal=sum(r['Qty']*r['catalog_unit_price'] for r in rows if r['catalog_unit_price'] is not None)
md+=f'\nCatalog-price arithmetic: {subtotal:.4f} in the CLI-reported price units, excluding C25804, assembly, PCB, tax, shipping and price-break differences. The CLI does not state currency or quantity tier: this is NOT a manufacturing quote or complete cost estimate. Assembly pricing has not been obtained.\n\nStock and classification are from the tsci JLC search service on 2026-09-27. C25804 returned no CLI result; its official JLC page confirms identity/Basic/SMT, but current assembly stock remains unverified. JLC eligibility of each exact build still requires service confirmation.\n'
(root/'BOM.md').write_text(md)
imports=[]
for p in sorted((root/'imports').glob('*.tsx')):
 imports.append({'path':str(p.relative_to(root)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(root/'artifacts/pre-route/import-hashes.json').write_text(json.dumps(imports,indent=2)+'\n')
(root/'IMPORTS.md').write_text('# Import audit\n\n21 selected part types imported with `tsci import C-number --jlcpcb --use-exact-footprint`. No fabricated packages. Original generated modules remain unchanged. The initial imports have logs in `artifacts/pre-route/import-results.json`; revision imports have separate logs in `artifacts/pre-route/logs/`. Unused original imports are retained for provenance and are not BOM rows. All current source hashes are in `artifacts/pre-route/import-hashes.json`.\n\nAn import is not an independent geometry review. DRV8833 pin labels match the PWP table. The design uses the TI-derived land pattern in lib/driver-footprint.tsx; see U1_FOOTPRINT.md. Its four ground thermal vias are listed in `references/thermal-structures.json`, including exact positions and sizes. No routing vias were added.\n\nRaw non-IC imports use generic chips. lib/parts.tsx supplies native electrical kinds, explicit connector entry directions and reference text while preserving the raw import files. U1 and F1 use separately reviewed manufacturer-derived footprints; see U1_FOOTPRINT.md and ASSEMBLY_PLAN.md. D1 was re-imported as Littelfuse C83270; R4–R8 use C23138 and R19 uses C23206. Q1 now uses Vishay C222495 and F1 uses non-resettable Littelfuse C178991. Import logs are retained. See ISSUES.md.\n')
print(f'BOM: {sum(r["Qty"] for r in rows)} parts, {len(rows)} unique imports')
