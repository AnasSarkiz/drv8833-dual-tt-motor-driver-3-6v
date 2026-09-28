"""Fingerprint current routed review files without changing historical receipts."""
from pathlib import Path
import hashlib
import json

root = Path(__file__).resolve().parents[1]
paths = set()
for pattern in [
    '*.md', '*.json', '*.csv', '*.tsx', 'bun.lock',
    'lib/**/*', 'imports/**/*', 'scripts/**/*', 'tests/**/*',
    'references/**/*', 'vendor/*', '.github/workflows/*', 'artifacts/routed/**/*', 'artifacts/order-release/**/*',
]:
    paths.update(path for path in root.glob(pattern) if path.is_file())
excluded = {
    'PUBLICATION.md', 'artifacts/routed/hashes.json',
    'artifacts/routed/publication.json', 'artifacts/routed/logs/github-ci.log',
    'artifacts/routed/logs/registry-push.log',
}
hashes = {
    str(path.relative_to(root)): hashlib.sha256(path.read_bytes()).hexdigest()
    for path in sorted(paths)
    if str(path.relative_to(root)) not in excluded and '__pycache__' not in path.parts
}
(root / 'artifacts/routed/hashes.json').write_text(json.dumps(hashes, indent=2)+'\n')
print(f'Recorded SHA-256 fingerprints for {len(hashes)} routed review files')
