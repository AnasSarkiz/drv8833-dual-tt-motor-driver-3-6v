from pathlib import Path
import hashlib,json,csv,collections
from datetime import datetime,timezone
root=Path(__file__).resolve().parent.parent
circuit=json.loads((root/'dist/index/circuit.json').read_text())
sourcing={r['c_number']:r for r in json.loads((root/'artifacts/pre-route/sourcing.json').read_text())}
manufacturer={'C50506':'Texas Instruments','C130023':'Texas Instruments','C15127':'Alpha & Omega Semiconductor','C876469':'Yageo','C13564':'Murata','C15850':'Samsung','C23630':'Samsung','C57112':'Fenghua','C14663':'Yageo','C285392':'Lelon','C5331096':'MSKSEMI','C20627123':'LUTE','C474881':'Cixi Kefa','C49257':'BOOMELE','C25804':'UNI-ROYAL','C21190':'UNI-ROYAL','C4190':'UNI-ROYAL','C2286':'Hubei KENTO','C2289':'Hubei KENTO'}
functions={'C50506':'Dual H-bridge','C130023':'Command XOR indicators','C15127':'Reverse-polarity path','C876469':'Independent current shunts','C13564':'Board temperature','C15850':'VM ceramic bypass','C23630':'VINT bypass','C57112':'VCP-to-VM charge pump','C14663':'Logic bypass / TEMP filter','C285392':'Bus bulk storage','C5331096':'Candidate transient clamp','C20627123':'Input PTC','C474881':'Power / motor terminals','C49257':'Host / diagnostic headers','C25804':'Pulls / temperature divider','C21190':'Input / TEMP series','C4190':'LED current limiting','C2286':'FAULT LED','C2289':'VM / VIO / A / B LEDs'}
grouped=collections.defaultdict(list)
for component in circuit:
 if component['type']!='source_component':continue
 numbers=component.get('supplier_part_numbers',{}).get('jlcpcb',[])
 if not numbers:continue
 if len(numbers)!=1:raise RuntimeError(component)
 grouped[numbers[0]].append(component)
rows=[]
for number,components in grouped.items():
 record=sourcing[number];found=record['supplier_response']['results'];hit=next((h for h in found if str(h['lcsc'])==number[1:]),None)
 paths=[p for p in (root/'imports').glob('*.tsx') if f'"{number}"' in p.read_text()]
 if len(paths)!=1:raise RuntimeError(number)
 mpns={c['manufacturer_part_number'] for c in components}
 if len(mpns)!=1:raise RuntimeError(mpns)
 is_th=number in ['C474881','C49257']
 rows.append({'RefDes':', '.join(c['name'] for c in components),'Qty':len(components),'Function':functions[number],'Manufacturer':manufacturer[number],'Exact MPN/value':next(iter(mpns)),'Package':hit['package'] if hit else '0603','Ratings/tolerance':hit['description'] if hit else '10 kohm, 1%, 0.1 W; JLC web identity confirmed','C-number':number,'JLC Basic/Extended/other':('Basic' if hit['is_basic'] else 'Extended') if hit else 'Basic (JLC web page); CLI search empty','Assembly service / side':'TOP inserted; manual THT pending service review' if is_th else 'TOP SMT; exact service review incomplete','Stock checked + timestamp':f'{hit["stock"] if hit else "UNVERIFIED"}; {record["checked_at"]}','Import path':str(paths[0].relative_to(root)),'Datasheet/source':f'https://jlcpcb.com/partdetail/{number}','Verification status':'IMPORTED; independent geometry/electrical/assembly review incomplete','catalog_unit_price':hit['price'] if hit else None})
(root/'bom.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n')
with (root/'bom.csv').open('w') as f:
 writer=csv.DictWriter(f,fieldnames=rows[0].keys());writer.writeheader();writer.writerows(rows)
columns=[k for k in rows[0] if k!='catalog_unit_price']
md='# Candidate BOM — NOT APPROVED\n\nGenerated from actual Circuit JSON. 46 purchased parts, 19 unique C-numbers. Seven bare PCB test pads are not purchased parts. No DNP rows. Manufacturer names originate in the supplied candidate brief and require independent confirmation. Imported identity and catalog fields do not establish suitability or assembly approval.\n\n'
md+='| '+' | '.join(columns)+' |\n| '+' | '.join('---' for _ in columns)+' |\n'
for row in rows:md+='| '+' | '.join(str(row[c]).replace('|',' / ').replace('\n',' ') for c in columns)+' |\n'
subtotal=sum(r['Qty']*r['catalog_unit_price'] for r in rows if r['catalog_unit_price'] is not None)
md+=f'\nCatalog-price arithmetic: {subtotal:.4f} in the CLI-reported price units, excluding C25804, assembly, PCB, tax, shipping and price-break differences. The CLI does not state currency or quantity tier: this is NOT a manufacturing quote or complete cost estimate. Assembly pricing has not been obtained.\n\nStock and classification are from the tsci JLC search service on 2026-09-27. C25804 returned no CLI result; its official JLC page confirms identity/Basic/SMT, but current assembly stock remains unverified. JLC eligibility of each exact build still requires service confirmation.\n'
(root/'BOM.md').write_text(md)
imports=[]
for p in sorted((root/'imports').glob('*.tsx')):
 imports.append({'path':str(p.relative_to(root)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(root/'artifacts/pre-route/import-hashes.json').write_text(json.dumps(imports,indent=2)+'\n')
(root/'IMPORTS.md').write_text('# Import audit\n\n19 real imports completed with `tsci import C-number --jlcpcb --use-exact-footprint`. No fabricated packages. Original generated modules remain unchanged. The driver and XOR were imported individually; the remaining 17 imports have per-command logs and exit codes in `artifacts/pre-route/import-results.json`. All 19 current source hashes are in `artifacts/pre-route/import-hashes.json`.\n\nAn import is not an independent geometry review. DRV8833 pin labels match the PWP table; its land pattern differs from TI PWP0016C example dimensions and needs reconciliation. Its four imported thermal vias are listed in `references/thermal-structures.json`, including exact positions and sizes. No routing vias were added.\n\nObserved importer limitations: multiple non-IC parts use chip primitives and incomplete electrical metadata. See ISSUES.md.\n')
print(f'BOM: {sum(r["Qty"] for r in rows)} parts, {len(rows)} unique imports')
