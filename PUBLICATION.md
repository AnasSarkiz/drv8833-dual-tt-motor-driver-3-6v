# Public routed release

Both repositories are public. **Alpha.6 includes the HOLD TO DISABLE button and passes local, GitHub CI and tscircuit cloud checks.** The updated five-board prototype order packet contains its fabrication and assembly files. Final manufacturer review and stock reservation remain; no order has been placed.

| Destination | Verified result |
|---|---|
| [GitHub](https://github.com/AnasSarkiz/drv8833-dual-tt-motor-driver-3-6v) | Public; alpha.6 source, manufacturing files and validation evidence pushed |
| [GitHub CI](https://github.com/AnasSarkiz/drv8833-dual-tt-motor-driver-3-6v/actions/runs/36433427696) | PASS: frozen install, format, TypeScript, full build and all 26 board tests |
| [tscircuit PCB](https://tscircuit.com/AnasSarkiz/drv8833-dual-tt-motor-driver-3-6v#pcb) | Public; latest release `0.1.0-alpha.6-routed` |
| Release ID | `7ca5611b-be21-478a-8d32-d0f029a9cd0c` |
| Published source commit | `3e3889693500d535ef679ed5e26e5703415aea84` |
| Upload verification | 366 files uploaded; all 235 non-dotfile source, toolchain, manufacturing and review hashes match through the unauthenticated public API |
| Cloud build | User-code job completed without an error; 1,896 generated records pass full schema parsing; fresh native routing checks: 0 findings |
| Cloud geometry | All 1,000 PCB records exactly match local output: 72 traces, 60 vias, 4 pour polygons, 110 top paste apertures and no bottom paste |
| Public PCB viewer | Visually confirmed alpha.6, SW1 and the routed board with **0 errors** |
| Registry metadata | Separate thumbnail URL absent; aggregate API display status remains pending despite completed code generation and the working PCB viewer |

The CLI completed its file-by-file upload successfully. Hash verification independently confirmed all 235 uploaded entries from the 236-entry local manifest; the dot-prefixed GitHub workflow is excluded by registry upload rules. Cloud source records differ from local source records only in the filesystem metadata hash.

SW1 disables both motor outputs while held, allowing the motors to coast. Release returns control to the external host and can restart motion. It does not disconnect board power. See [button review](BUTTON_REVIEW.md) for contact mapping, GPIO current budget and prototype checks.

Use the updated [prototype order packet](artifacts/order-release/dual-tt-prototype-order-packet.zip), following [order readiness](ORDER_READINESS.md), the [manufacturing notes](artifacts/order-release/MANUFACTURING_NOTES.md) and the [five-board stock check](artifacts/order-release/STOCK.md). These specify filled/capped vias, 40 automated SMT placements and seven separately fitted through-hole connectors per board. All 23 exact part types cover placement quantities. The current-sense resistors have only 12 available to order for 10 placements; the final quote must confirm loss allowance and reserve them.

The two repositories are published separately. Automatic linking previously returned `403 repository_not_accessible` from the tscircuit GitHub app; no broader app permissions were granted. Earlier releases remain historical evidence.

The registry snapshot contains the preceding publication receipt. This later GitHub-only receipt and [publication.json](artifacts/routed/publication.json) record alpha.6's final remote outcomes. Publication receipts are excluded from the source/review hash manifest. Physical motor, supply-spike, button and thermal testing remain necessary before a store release.

## Repository rename

On 2026-09-28, both repositories were renamed to `drv8833-dual-tt-motor-driver-3-6v`. The existing GitHub repository and tscircuit package IDs, public visibility, history and earlier releases were preserved. Alpha.6 was published under the new name.
