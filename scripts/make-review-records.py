"""Generate the current BOM and import audit from emitted parts and supplier records."""
from collections import defaultdict
from pathlib import Path
import csv
import hashlib
import json

root = Path(__file__).resolve().parents[1]
circuit = json.loads((root / 'dist/index/circuit.json').read_text())
sourcing = {}
for filename in ['artifacts/pre-route/sourcing.json', 'artifacts/button-review/sourcing.json']:
    for record in json.loads((root / filename).read_text()):
        sourcing[record['c_number']] = record
manufacturers = {
    'C23138': 'UNI-ROYAL', 'C23206': 'UNI-ROYAL', 'C50506': 'Texas Instruments',
    'C130023': 'Texas Instruments', 'C222495': 'Vishay', 'C876469': 'Yageo',
    'C13564': 'Murata', 'C15850': 'Samsung', 'C23630': 'Samsung', 'C57112': 'Fenghua',
    'C14663': 'Yageo', 'C285392': 'Lelon', 'C83270': 'Littelfuse', 'C178991': 'Littelfuse',
    'C474881': 'Cixi Kefa', 'C49257': 'BOOMELE', 'C25804': 'UNI-ROYAL',
    'C21190': 'UNI-ROYAL', 'C4190': 'UNI-ROYAL', 'C2286': 'Hubei KENTO',
    'C2289': 'Hubei KENTO', 'C25803': 'UNI-ROYAL', 'C318884': 'XKB Connection',
}
functions = {
    'C23138': 'Motor command input series', 'C23206': 'NTC upper divider resistor',
    'C50506': 'Dual H-bridge', 'C130023': 'Command XOR indicators',
    'C222495': 'Low-loss reverse-polarity path', 'C876469': 'Independent current shunts',
    'C13564': 'Board temperature', 'C15850': 'VM ceramic bypass', 'C23630': 'VINT bypass',
    'C57112': 'VCP-to-VM charge pump', 'C14663': 'Logic bypass / TEMP filter',
    'C285392': 'Bus bulk storage', 'C83270': 'Bus transient clamp',
    'C178991': '3 A non-resettable input fuse', 'C474881': 'Power / motor terminals',
    'C49257': 'Host / diagnostic headers', 'C25804': 'Motor command pulls / FAULT pull-up',
    'C21190': 'TEMP series', 'C4190': 'LED current limiting / host enable series',
    'C2286': 'FAULT LED', 'C2289': 'VM / VIO / A / B LEDs',
    'C25803': 'Enable pull-down', 'C318884': 'Momentary motor disable',
}
grouped = defaultdict(list)
for component in circuit:
    if component['type'] != 'source_component':
        continue
    numbers = component.get('supplier_part_numbers', {}).get('jlcpcb', [])
    if not numbers:
        continue
    assert len(numbers) == 1, component
    grouped[numbers[0]].append(component)
assert set(grouped) == set(json.loads((root / 'references/selected-parts.json').read_text()))
stock = {part['c_number']: part for part in json.loads((root / 'artifacts/order-release/jlc-stock.json').read_text())}
assert set(stock) == set(grouped)
rows = []
for number, components in grouped.items():
    record = sourcing[number]
    hit = next((part for part in record['supplier_response']['results'] if str(part['lcsc']) == number[1:]), None)
    current = stock[number]
    catalog = current['catalog_fields']
    assert catalog['componentCode'] == number
    mpns = {component['manufacturer_part_number'] for component in components}
    assert len(mpns) == 1
    # The official English catalog translates the Chinese word for a header
    # pin (针) to Pin; retain the imported MPN spelling in the emitted BOM.
    assert catalog['componentModelEn'].replace('针', 'Pin') == next(iter(mpns)).replace('针', 'Pin'), (number, catalog['componentModelEn'], mpns)
    paths = [path for path in (root / 'imports').glob('*.tsx') if f'"{number}"' in path.read_text()]
    assert len(paths) == 1, number
    is_tht = number in ['C474881', 'C49257']
    # C25804 has no CLI result; its exact identity and specification come from
    # the independent official JLC catalog record, not a fabricated search hit.
    package = hit['package'] if hit else catalog['componentSpecificationEn']
    description = hit['description'] if hit else catalog['componentSpecificationEn']
    if number == 'C83270':
        description = 'Manufacturer: 6 V standoff; 10.3 V clamp at 58.3 A specified pulse; reverse leakage 800 uA max. Catalog 46 nA field is incorrect; see DESIGN_REVIEW.md'
    rows.append({
        'RefDes': ', '.join(component['name'] for component in components),
        'Qty': len(components), 'Function': functions[number],
        'Manufacturer': manufacturers[number], 'Exact MPN/value': next(iter(mpns)),
        'Package': package, 'Ratings/tolerance': description, 'C-number': number,
        'JLC Basic/Extended/other': ('Basic' if hit['is_basic'] else 'Extended') if hit else 'Basic (official JLC catalog)',
        'Assembly service / side': 'TOP inserted; manual THT' if is_tht else 'TOP SMT; final manufacturer preview required',
        'Stock checked + timestamp': f"{catalog['canPresaleNumber']} available to order; {current['checked_at']}",
        'Import path': str(paths[0].relative_to(root)),
        'Datasheet/source': current['source_url'],
        'Verification status': 'Design-file checks pass; manufacturer acceptance and physical qualification pending',
        'catalog_unit_price': hit['price'] if hit else None,
    })
(root / 'bom.json').write_text(json.dumps(rows, indent=2, ensure_ascii=False) + '\n')
with (root / 'bom.csv').open('w') as output:
    writer = csv.DictWriter(output, fieldnames=rows[0].keys(), lineterminator='\n')
    writer.writeheader()
    writer.writerows(rows)
count = sum(row['Qty'] for row in rows)
columns = [key for key in rows[0] if key != 'catalog_unit_price']
markdown = f'# Prototype BOM — alpha.6 with motor-disable button\n\nGenerated from actual Circuit JSON: **{count} purchased parts, {len(rows)} unique C-numbers**, comprising 40 top SMT parts and seven manually fitted connectors per board. Seven bare PCB test pads are not purchased parts. No DNP rows.\n\n'
markdown += 'Use the [fresh five-board stock audit](artifacts/order-release/STOCK.md) for availability. Final assembly preview, loss allowance and inventory reservation are separate.\n\n'
markdown += '| ' + ' | '.join(columns) + ' |\n| ' + ' | '.join('---' for _ in columns) + ' |\n'
for row in rows:
    markdown += '| ' + ' | '.join(str(row[key]).replace('|', ' / ').replace('\n', ' ') for key in columns) + ' |\n'
markdown += '\nSW1 is the normally-open XKB TS-1187A-B-A-B tactile button. Hold to disable both motor outputs; release returns control to the host and can restart motion. R8 is now 2.2 kΩ; R13 is 100 kΩ. See [button review](BUTTON_REVIEW.md). Catalog unit prices are historical, exclude assembly/PCB/fees and are not an order quote.\n'
(root / 'BOM.md').write_text(markdown)
imports = [{'path': str(path.relative_to(root)), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()} for path in sorted((root / 'imports').glob('*.tsx'))]
(root / 'artifacts/button-review/import-hashes.json').write_text(json.dumps(imports, indent=2) + '\n')
print(f'BOM: {count} parts, {len(rows)} unique imports')
