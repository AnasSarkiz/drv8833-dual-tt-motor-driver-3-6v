# Public routed release

## Alpha.8 — bottom evaluation label

**Alpha.8 is published to both public repositories.** The bottom silkscreen now reads “For evaluation only; not FCC approved for resale.” [Bottom preview and updated fabrication ZIP](artifacts/silkscreen-review/README.md).

| Destination | Verified result |
|---|---|
| GitHub source | `d1f7bbf01a7ee00ec65604b4830edd94331d7d5b` pushed to `main` |
| [GitHub CI](https://github.com/AnasSarkiz/drv8833-dual-tt-motor-driver-3-6v/actions/runs/36605200165) | PASS: frozen install, format, TypeScript, build and 27 tests / 1,139 assertions |
| [tscircuit PCB](https://tscircuit.com/AnasSarkiz/drv8833-dual-tt-motor-driver-3-6v#pcb) | Latest release `0.1.0-alpha.8-routed`; release ID `20e4c3da-a9a2-4ae0-bc2e-cdc5a9c807a3` |
| Upload verification | 388 files uploaded; all 256 non-dotfile source/toolchain/review hashes match |
| Cloud build | Completed successfully; 1,921 schema-valid records, zero error records and zero native routing findings |
| Cloud comparison | All 1,002 PCB, 468 schematic and 54 CAD records exactly match local output; electrical connections also match |
| Bottom label | Both lines present on `bottom`, with 1.8 mm font size |

[Machine-readable publication receipt](artifacts/silkscreen-review/publication.json). Only bottom silkscreen artwork changes relative to the alpha.6 manufacturing export after normalizing timestamps and aperture numbers. Copper, drills, mask, paste and top silkscreen are unchanged. The older alpha.6 order packet does not contain the new label; use the separate updated fabrication ZIP linked above.

The registry's aggregate display status remains `pending` despite successful completion of its custom build and verified generated output. This GitHub-only receipt records the results; the registry snapshot contains the preceding publication-status document. The online editor's separate saved-routing issue remains tracked in [tscircuit/core#4197](https://github.com/tscircuit/core/issues/4197); this silkscreen update does not resolve it.

## Alpha.7 — schematic review receipt

Both repositories are public. **Alpha.7 adds the reviewed schematic notes and labels and passes local, GitHub CI and tscircuit cloud checks.** Its PCB, electrical connections and alpha.6 prototype manufacturing packet are unchanged.

| Destination | Verified result |
|---|---|
| [GitHub](https://github.com/AnasSarkiz/drv8833-dual-tt-motor-driver-3-6v) | Public; alpha.7 source, previews and review evidence pushed |
| [GitHub CI](https://github.com/AnasSarkiz/drv8833-dual-tt-motor-driver-3-6v/actions/runs/36557758551) | PASS: frozen install, format, TypeScript, build and all 27 tests / 1,139 assertions |
| [tscircuit schematic](https://tscircuit.com/AnasSarkiz/drv8833-dual-tt-motor-driver-3-6v#schematic) | Public; latest release `0.1.0-alpha.7-routed`; new notes confirmed in the live viewer |
| Release ID | `9af54a06-8175-491e-a563-65f439ab72b8` |
| Published source commit | `74fee42fa5bdbf5f3e427e5dbdb20cfa620682b3` |
| Upload verification | 377 files uploaded; all 246 non-dotfile source, toolchain, manufacturing and review hashes match through the public API |
| Cloud build | Completed without error; all 1,919 records pass schema and routing-contract validation; native routing checks: 0 findings |
| Cloud comparison | All 1,000 PCB records and 468 schematic records exactly match local output, including all 26 new note lines |
| Manufacturing comparison | All 53 alpha.6 order-release files remain byte-identical |

See [schematic review](SCHEMATIC_REVIEW.md) for the four rendered sheets and chip-rating sources. The PCB still has 72 traces, 60 vias, four pour polygons, 110 top paste apertures and no bottom paste. Notes identify U1, U2, Q1, connectors, the disable button and temperature measurement without changing physical circuitry.

The local output includes 47 supplier-lookup network warnings that are absent from the cloud output. These report inability to connect, not missing imported footprints; all PCB, CAD, electrical and schematic records match exactly. The only other local/cloud difference is the source filesystem metadata hash. Native placement and symbol style advisories remain documented without suppression. Registry aggregate display status remains pending and its separate thumbnail URL is absent despite successful code generation and the functioning schematic viewer.

The 247-entry manifest includes one dot-prefixed GitHub workflow excluded by registry upload rules. All other hashes match. The registry snapshot contains the preceding publication receipt; this later GitHub-only receipt and [publication.json](artifacts/routed/publication.json) record alpha.7's remote results. Publication receipts and their upload/CI logs are excluded from the manifest.

The unchanged [prototype order packet](artifacts/order-release/dual-tt-prototype-order-packet.zip) remains subject to [order readiness](ORDER_READINESS.md), final manufacturer review and stock reservation. The stock evidence is dated 28 September 2026 and was not refreshed for this schematic-only revision. Physical motor, supply-spike, button and thermal tests remain necessary before a store release. No order has been placed.

The repositories are published separately. Automatic linking previously returned `403 repository_not_accessible` from the tscircuit GitHub app; no broader app permissions were granted.

## Repository rename

On 2026-09-28, both repositories were renamed to `drv8833-dual-tt-motor-driver-3-6v`. Existing public visibility, repository/package IDs, history and previous releases were preserved.
