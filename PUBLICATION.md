# Public repository publication

The user explicitly authorized PUBLIC visibility for GitHub and tscircuit on 2026-09-27. Publication is of an **incomplete, unrouted study**, not an approved assembly or fabrication release. Source and cloud configuration retain the routing lock.

| Destination | Actual result |
|---|---|
| [GitHub](https://github.com/AnasSarkiz/dual-tt-motor-driver) | Created PUBLIC under AnasSarkiz; main pushed successfully |
| [tscircuit](https://tscircuit.com/AnasSarkiz/dual-tt-motor-driver) | Created PUBLIC; 125 source/evidence files uploaded successfully |
| Registry release | `0.1.0-alpha.1-unrouted`; release ID `b2a4d12c-5d8a-4858-890b-ebb9837f21b5` |
| Published design commit | `a09fc1996be8a4456a200435790e3c60668a920d` |
| Registry public access | Verified without authentication through packages/get and package_releases/get; is_public=true, is_private=false |
| [GitHub CI](https://github.com/AnasSarkiz/dual-tt-motor-driver/actions/runs/36322761236) | FAIL on the full Circuit JSON schema guard, after install, formatting, TypeScript, unrouted generation and mechanical check pass |
| Registry preview build | FAIL: user-code job completed with exit code 1 at 13:35:04 UTC; registry overall display_status still says pending and returned no completed build log. No preview success claimed |
| Automatic GitHub linking | BLOCKED: registry returned HTTP 403 repository_not_accessible; its GitHub app installation lacks access to this newly created repository |

Both repositories exist and are public. They were published separately. To enable automatic GitHub synchronization later, grant the tscircuit GitHub app access to this specific repository and rerun the documented registry package-link command. No broader app access was granted.

The registry snapshot precedes this publication receipt; subsequent documentation-only GitHub commits record the observed remote outcomes. Hardware source and source hashes match the published design commit. See `artifacts/pre-route/publication.json` and `artifacts/pre-route/logs/github-ci.log`.

The strict project build fails on the generated Circuit JSON/schema incompatibilities in ISSUES.md. No checks are disabled for publication. Hardware revision A-study; no routing approval received; no manufacturing package generated.
