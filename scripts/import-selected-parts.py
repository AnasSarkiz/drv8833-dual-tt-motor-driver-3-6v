import json
import subprocess
import hashlib
from datetime import datetime, timezone
from pathlib import Path

# Selected candidates only. Import success is not electrical/assembly approval.
parts = ['C15127','C876469','C13564','C15850','C23630','C57112','C14663','C285392','C5331096','C20627123','C474881','C49257','C25804','C21190','C4190','C2286','C2289']
root = Path(__file__).resolve().parent.parent
records=[]
for part in parts:
    print(f'Importing {part}', flush=True)
    result=subprocess.run([str(root/'node_modules/.bin/tsci'),'import',part,'--jlcpcb','--use-exact-footprint'],cwd=root,capture_output=True,text=True)
    log=result.stdout+result.stderr
    (root/f'artifacts/pre-route/logs/import-{part}.log').write_text(log)
    matches=[p for p in (root/'imports').glob('*.tsx') if f'"{part}"' in p.read_text()]
    records.append({'c_number':part,'checked_at':datetime.now(timezone.utc).isoformat(),'exit_code':result.returncode,'files':[{'path':str(p.relative_to(root)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in matches]})
    (root/'artifacts/pre-route/import-results.json').write_text(json.dumps(records,indent=2)+'\n')
    print(f'{part}: exit {result.returncode}; {len(matches)} imported file(s)',flush=True)
    if result.returncode != 0:
        print(log,flush=True)
        raise SystemExit(result.returncode)
