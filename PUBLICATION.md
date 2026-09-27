# Public routed release

Both repositories are public. **The routed alpha.4 source builds successfully locally, in GitHub CI and in tscircuit's cloud runtime.** No fabrication order or physical qualification is claimed.

| Destination | Verified result |
|---|---|
| [GitHub](https://github.com/AnasSarkiz/dual-tt-motor-driver) | Public; routed source and cloud portability fixes pushed |
| [GitHub CI](https://github.com/AnasSarkiz/dual-tt-motor-driver/actions/runs/36348504034) | PASS: install, format, TypeScript, full build and all 22 tests |
| [tscircuit](https://tscircuit.com/AnasSarkiz/dual-tt-motor-driver) | Public; latest release `0.1.0-alpha.4-routed` |
| Release ID | `a84a2f78-810b-45da-afb3-c95f925347fd` |
| Published source commit | `62b0f0b3889e763abc053318cadb695dab250831` |
| Upload verification | 231 files; all 142 source/archive/review hashes match through the unauthenticated public API |
| Cloud build | Completed with exit code 0; source/schema/via and mechanical gates pass; fresh native routing checks: 0 findings |
| Registry preview metadata | Circuit JSON generated and uploaded; separate thumbnail not generated, aggregate status still says pending |

The CLI's alpha.3 compressed upload timed out after the server accepted the archive; duplicate file errors followed. Hash verification proved that upload complete. Its cloud build then exposed missing Python and conflicting preloaded dependency libraries. Alpha.4 uses an equivalent Bun mechanical check and a forced frozen-lockfile install. It retains identical routed copper and all validation requirements. The alpha.4 archive upload completed with HTTP 200.

The two repositories are published separately. Automatic linking previously returned 403 repository_not_accessible from the tscircuit GitHub app; no broader app permissions were granted. Earlier failed releases remain historical evidence, not the current build result.

The registry snapshot contains the preceding publication receipt. This later GitHub-only receipt and [publication.json](artifacts/routed/publication.json) record the final remote outcomes. Publication receipts are excluded from the source/review hash manifest.
