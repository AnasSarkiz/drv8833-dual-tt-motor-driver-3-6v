# Local core serialization investigation

> Historical review from before routing. Current routing and validation status is documented in ../../ROUTING_REVIEW.md and ../../VALIDATION.md. Earlier routing holds/schema failures below describe that historical revision and are superseded.

Base: tscircuit/core commit `521de2c447926e29a0334fd0bf08874536abd205`, package 0.0.1993, cloned separately at `/private/tmp/dual-tt-core-schema-fix`. The user's existing core checkout was not edited.

`core.patch` fixes numeric display offsets on components/groups and null IDs on pill holes with rectangular pads. Regression tests fail before the fix; the five focused tests pass afterward (59 assertions), TypeScript passes and the package/declarations build succeeds. Two visual snapshots change only the displayed numeric offset formatting, not placement. The full upstream suite has not run; this is a prepared partial fix, not an accepted release.

The separate silkscreen reproduction still fails: board/group-level artwork has no component owner, while the published schema requires one. Changing null to undefined does not solve that contract. It needs a coordinated core/schema change. No generated board JSON was edited, no checks were relaxed and no local dependency link was added to this PCB project.

No upstream issue or PR has been submitted. Publishing this PCB's source was authorized; publishing upstream reports or patches was not. A reviewed, published compatible dependency is still needed before the real board gate can pass.
