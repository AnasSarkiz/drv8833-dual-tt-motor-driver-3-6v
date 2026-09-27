import subprocess, json
from datetime import datetime, timezone
from pathlib import Path
root=Path(__file__).resolve().parent.parent
parts = json.loads((root / "references/selected-parts.json").read_text())
records=[]
for part in parts:
 result=subprocess.run([str(root/'node_modules/.bin/tsci'),'search',part,'--jlcpcb','--json'],capture_output=True,text=True,cwd=root)
 (root/f'artifacts/pre-route/logs/search-{part}.log').write_text(result.stdout+result.stderr)
 try:
  found=json.loads(result.stdout)
 except json.JSONDecodeError:
  found={'error':'Supplier output was not JSON','exit_code':result.returncode}
 records.append({'c_number':part,'checked_at':datetime.now(timezone.utc).isoformat(),'supplier_response':found})
 (root/'artifacts/pre-route/sourcing.json').write_text(json.dumps(records,indent=2)+'\n')
 print(part,found.get('results',found),flush=True)
