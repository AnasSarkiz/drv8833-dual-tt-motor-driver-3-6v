"""Fingerprint the review inputs and outputs, excluding publication receipts."""

from pathlib import Path
import hashlib
import json

root = Path(__file__).resolve().parent.parent
paths = set()
for pattern in [
    "*.md", "*.json", "*.csv", "*.tsx", "bun.lock",
    "lib/**/*", "imports/**/*", "scripts/**/*", "tests/**/*",
    "references/**/*", ".github/workflows/*", "artifacts/pre-route/**/*",
]:
    paths.update(p for p in root.glob(pattern) if p.is_file())

excluded = {
    "PUBLICATION.md",
    "artifacts/pre-route/hashes.json",
    "artifacts/pre-route/publication.json",
    "artifacts/pre-route/logs/github-ci.log",
    "artifacts/pre-route/logs/registry-push.log",
}
hashes = {
    str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest()
    for p in sorted(paths)
    if str(p.relative_to(root)) not in excluded
    and "__pycache__" not in p.parts
}
destination = root / "artifacts/pre-route/hashes.json"
destination.write_text(json.dumps(hashes, indent=2) + "\n")
print(f"Recorded SHA-256 fingerprints for {len(hashes)} review files")
