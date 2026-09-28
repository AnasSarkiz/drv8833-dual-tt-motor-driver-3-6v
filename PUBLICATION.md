# Public routed release

Both repositories are public. **Alpha.5 builds successfully locally, in GitHub CI and in tscircuit's cloud runtime.** Its layout and assembly-export fixes are included in the five-board prototype order packet. Final manufacturer review and stock reservation remain; no order has been placed.

| Destination | Verified result |
|---|---|
| [GitHub](https://github.com/AnasSarkiz/drv8833-dual-tt-motor-driver-3-6v) | Public; alpha.5 design, manufacturing files and validation evidence pushed |
| [GitHub CI](https://github.com/AnasSarkiz/drv8833-dual-tt-motor-driver-3-6v/actions/runs/36404608465) | PASS: frozen install, format, TypeScript, full build and all 25 board tests |
| [tscircuit PCB](https://tscircuit.com/AnasSarkiz/drv8833-dual-tt-motor-driver-3-6v#pcb) | Public; latest release `0.1.0-alpha.5-routed` |
| Release ID | `d5bdd220-5726-4d1e-b271-c2dade0edbe9` |
| Published source commit | `90e9587d55828761798d2d7dc068a3918c4e2a8f` |
| Upload verification | 340 files uploaded; all 209 non-dotfile source, toolchain, manufacturing and review hashes match through the unauthenticated public API |
| Cloud build | User-code job completed without an error; 1,841 generated records pass full schema parsing; fresh native routing checks: 0 findings |
| Cloud geometry | All PCB records exactly match the local output: 70 traces, 58 vias, 4 pour polygons, 106 top paste apertures and no bottom paste |
| Public PCB viewer | Visually confirmed alpha.5 and the routed board with **0 errors** |
| Registry metadata | Separate thumbnail URL absent; aggregate API display status remains pending despite completed code generation and the working PCB viewer |

The compressed upload exceeded the registry request-size limit (HTTP 413). The CLI then completed its file-by-file upload successfully. Hash verification independently confirmed all 209 uploaded entries from the 210-entry local manifest; the dot-prefixed GitHub workflow is excluded by registry upload rules. Cloud source records differ from local source records only in the filesystem metadata hash.

Use the [prototype order packet](artifacts/order-release/dual-tt-prototype-order-packet.zip), following [order readiness](ORDER_READINESS.md), the [manufacturing notes](artifacts/order-release/MANUFACTURING_NOTES.md) and the [five-board stock check](artifacts/order-release/STOCK.md). These specify filled/capped vias, 39 automated SMT placements and seven separately fitted through-hole connectors per board. The current-sense resistors have only 12 available to order for 10 placements; the final quote must confirm loss allowance and reserve them.

The two repositories are published separately. Automatic linking previously returned `403 repository_not_accessible` from the tscircuit GitHub app; no broader app permissions were granted. Earlier releases remain historical evidence.

The registry snapshot contains the preceding publication receipt. This later GitHub-only receipt and [publication.json](artifacts/routed/publication.json) record alpha.5's final remote outcomes. Publication receipts are excluded from the source/review hash manifest. Physical motor, supply-spike and thermal testing remain necessary before a store release.

## Repository rename

On 2026-09-28, both repositories were renamed to `drv8833-dual-tt-motor-driver-3-6v`. The existing GitHub repository and tscircuit package IDs, public visibility, history and alpha.5 release were preserved. The local remote, package name, root lockfile name and README links were updated. No circuit, routing or manufacturing file changed.

The alpha.5 source and review hash manifest remains a receipt for the published source commit above. The subsequent name-only edits to `package.json`, `bun.lock` and `README.md` are intentionally outside that historical verification; all other manifest entries remain unchanged. The registry release retains its original source snapshot under the renamed package.
