# Public repository publication

The user explicitly authorized PUBLIC GitHub and tscircuit repositories. The current publication is an **incomplete, unrouted alpha.2 study**, not an approved assembly or fabrication release. Source and cloud configuration retain the routing lock.

| Destination | Actual result |
|---|---|
| [GitHub](https://github.com/AnasSarkiz/dual-tt-motor-driver) | PUBLIC under AnasSarkiz; revised main pushed successfully |
| [tscircuit](https://tscircuit.com/AnasSarkiz/dual-tt-motor-driver) | PUBLIC; all 162 source/evidence files uploaded successfully |
| Registry release | `0.1.0-alpha.2-unrouted`; release ID `81357bf6-781d-46b8-95fb-b6be932f64d9` |
| Published design commit | `eb354297731df83cb217fcc6b33b8c9d25ebf1ce` |
| Registry public access | Verified without authentication: is_public=true, is_private=false; new release is accessible |
| [GitHub CI](https://github.com/AnasSarkiz/dual-tt-motor-driver/actions/runs/36340639286) | FAIL on the full Circuit JSON schema guard, after installation, formatting, TypeScript, unrouted generation and mechanical checks pass |
| Registry preview build | FAIL: user-code build returned exit code 1; overall registry display still reports pending. Source upload succeeded; no cloud preview success is claimed |
| Automatic GitHub linking | BLOCKED: previously returned HTTP 403 repository_not_accessible; the registry's GitHub app lacks access to this repository |

Both repositories exist and are public. They are published separately. Automatic synchronization requires the tscircuit GitHub app to have access to this specific repository. No broader app access was granted and the failed link was not retried.

The registry snapshot contains the prior publication receipt. This subsequent GitHub-only receipt records the alpha.2 upload and remote outcomes; hardware source matches the design commit above. See `artifacts/pre-route/publication.json`, `logs/github-ci.log` and `logs/registry-push.log` under `artifacts/pre-route/`. Source/evidence hashes are recorded separately and exclude these publication receipts.

The strict project build still fails on the generated data/schema incompatibilities in ISSUES.md. No validation was disabled for publication. Hardware revision A-study; no routing approval received; no manufacturing package generated.

The subsequent working-reference comparison and two additional ground tests are GitHub-only review updates. The tscircuit alpha.2 hardware snapshot remains unchanged; it does not include these later documentation/test additions.
