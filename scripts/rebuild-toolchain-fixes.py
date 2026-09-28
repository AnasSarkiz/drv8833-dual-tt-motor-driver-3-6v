"""Rebuild the three vendored packages from canonical, pinned upstream source.

Run from any directory with Python 3, git, Bun 1.3.9 and Node available.
Builds in a new temporary directory; never edits an existing upstream checkout.
"""
from pathlib import Path
import json
import shutil
import subprocess
import tempfile

PROJECT = Path(__file__).resolve().parents[1]
FIXES = PROJECT / "references/toolchain-fixes"
BUILD = Path(tempfile.mkdtemp(prefix="dual-tt-rebuild-"))


def run(command, directory):
    subprocess.run(command, cwd=directory, check=True)


def checkout(package, repository):
    directory = BUILD / package
    run(["git", "clone", "--no-checkout", "--filter=blob:none", repository, str(directory)], BUILD)
    commit = (FIXES / f"{package}-base.txt").read_text().strip()
    run(["git", "checkout", "--detach", commit], directory)
    run(["git", "apply", str(FIXES / f"{package}.patch")], directory)
    run(["bun", "install", "--frozen-lockfile"], directory)
    return directory


schema = checkout("circuit-json", "https://github.com/tscircuit/circuit-json.git")
run(["bun", "test"], schema)
run(["bunx", "tsc", "--noEmit"], schema)
run(["bun", "run", "build"], schema)
manifest = json.loads((schema / "package.json").read_text())
manifest["version"] = "0.0.506-dualtt.1"
(schema / "package.json").write_text(json.dumps(manifest, indent=2) + "\n")
run(["bun", "pm", "pack", "--ignore-scripts", "--destination", str(BUILD)], schema)
schema_archive = BUILD / "circuit-json-0.0.506-dualtt.1.tgz"

core = checkout("core", "https://github.com/tscircuit/core.git")
manifest = json.loads((core / "package.json").read_text())
manifest["version"] = "0.0.1993-dualtt.1"
manifest["devDependencies"]["circuit-json"] = f"file:{schema_archive}"
manifest["overrides"]["circuit-json"] = f"file:{schema_archive}"
(core / "package.json").write_text(json.dumps(manifest, indent=2) + "\n")
run(["bun", "install"], core)
run(["bun", "test", "tests/components/pcb/pcb-position-metadata-schema.test.tsx", "tests/components/primitive-components/plated-hole-rect-pad-id.test.tsx", "tests/components/primitive-components/silkscreen-board-owner-schema.test.tsx", "tests/components/primitive-components/hole-board-owner-schema.test.tsx", "tests/features/autoroutingphase-saved-through-hole-layer.test.tsx", "tests/features/autoroutingphase-saved-via-width.test.tsx", "tests/components/primitive-components/create-solderpaste-from-smtpad-and-plated-holes.test.tsx", "tests/components/primitive-components/plated-hole-no-stencil-paste.test.tsx", "tests/components/normal-components/led-two-pad-orientation-cache.test.tsx", "tests/components/normal-components/diode-supplier-pin1-polarity.test.tsx"], core)
run(["bunx", "tsc", "--noEmit"], core)
run(["bun", "run", "build"], core)

package = BUILD / "core-package"
package.mkdir()
shutil.copytree(core / "dist", package / "dist")
manifest["version"] = "0.0.1993-dualtt.6"
for field in ("scripts", "devDependencies", "overrides"):
    manifest.pop(field, None)
(package / "package.json").write_text(json.dumps(manifest, indent=2) + "\n")
for license_file in core.glob("LICENSE*"):
    shutil.copy2(license_file, package / license_file.name)
run(["bun", "pm", "pack", "--ignore-scripts", "--destination", str(BUILD)], package)
print(f"Rebuilt archives are in {BUILD}. Compare package contents before replacing vendor archives.")

# The utility build uses the current Circuit JSON schema and ESNext dependency APIs.
utilities = checkout("circuit-json-util", "https://github.com/tscircuit/circuit-json-util.git")
manifest = json.loads((utilities / "package.json").read_text())
manifest["devDependencies"]["circuit-json"] = f"file:{schema_archive}"
manifest["overrides"] = {"circuit-json": f"file:{schema_archive}"}
(utilities / "package.json").write_text(json.dumps(manifest, indent=2) + "\n")
run(["bun", "install"], utilities)
run(["bun", "test", "tests/analyze-pcb-pin1-location.test.ts", "tests/transform-outline-keepout.test.ts"], utilities)
run(["bunx", "tsc", "--noEmit", "--lib", "ESNext,DOM"], utilities)
run(["bun", "run", "build"], utilities)
manifest["version"] = "0.0.116-dualtt.1"
for field in ("scripts", "devDependencies", "overrides"):
    manifest.pop(field, None)
(utilities / "package.json").write_text(json.dumps(manifest, indent=2) + "\n")
run(["bun", "pm", "pack", "--ignore-scripts", "--destination", str(BUILD)], utilities)
