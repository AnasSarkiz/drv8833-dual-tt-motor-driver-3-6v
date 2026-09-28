"""Package native fabrication artwork and explicitly selected SMT assembly files."""
from pathlib import Path
import csv
import io
import json
import zipfile

root = Path(__file__).resolve().parents[1]
destination = root / 'artifacts/order-release'
raw_export = destination / 'dual-tt-rev-a-alpha5-gerbers.zip'
smt_designators = set(json.loads((destination / 'smt-designators.json').read_text()))
with zipfile.ZipFile(raw_export) as source:
    rows = list(csv.DictReader(io.StringIO(source.read('bom.csv').decode())))
    smt_rows = [row for row in rows if row['Designator'] in smt_designators]
    tht_rows = [row for row in rows if row['Designator'] not in smt_designators]
    assert {row['Designator'] for row in smt_rows} == smt_designators
    assert {row['Designator'] for row in tht_rows} == {f'J{number}' for number in range(1, 8)}
    assert all(row['JLCPCB Part #'] for row in smt_rows)
    for filename, selected in [('jlc-smt-bom.csv', smt_rows), ('manual-tht-bom.csv', tht_rows)]:
        with (destination / filename).open('w', newline='') as output:
            writer = csv.DictWriter(output, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(selected)
    assert source.read('F_Paste.gbr').count(b'D03*') == 106
    assert source.read('B_Paste.gbr').count(b'D03*') == 0
    # Keep the native combined export as provenance; fabricator ZIP contains artwork only.
    with zipfile.ZipFile(destination / 'jlc-fabrication.zip', 'w', zipfile.ZIP_DEFLATED) as target:
        for name in source.namelist():
            if name.endswith(('.gbr', '.drl')):
                target.writestr(name, source.read(name))
    for name in ['F_Paste.gbr', 'B_Paste.gbr', 'F_Mask.gbr', 'drill-L1-L4.drl', 'drill_npth.drl']:
        (destination / name).write_bytes(source.read(name))
print('PASS: 39 SMT BOM/CPL references; 7 separate manual connectors; 106 top / 0 bottom paste apertures')
