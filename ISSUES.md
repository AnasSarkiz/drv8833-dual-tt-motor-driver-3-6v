# Toolchain issues and remaining limitations

Current board build, schema and native routing checks pass. Historical failing output remains in `artifacts/pre-route/`; it is superseded by `artifacts/routed/`.

## Resolved in explicit local toolchain builds

- **TOOL-001 — numeric position metadata:** canonical core now serializes display offsets as the schema's strings.
- **TOOL-004 — generated IDs/ownership:** rectangular plated pads receive real IDs; mounting holes and board/group silkscreen omit nonexistent component owners. The coordinated schema permits absent artwork ownership while still rejecting invalid values.
- **Saved connector route layers:** route endpoints now use the physical conductive layers of through-hole pads, not only the one layer chosen for autorouting input.
- **Saved via contact widths:** existing route contacts and their local widths are preserved; missing contacts use adjacent widths instead of widening narrow escape sections.

These fixes have focused regression tests, including invalid-anchor/layer/coverage cases. They are unpublished builds included in `vendor/`; see TOOLCHAIN.md and `references/toolchain-fixes/`. No generated Circuit JSON, native DRC or installed dependency was patched to hide a finding. No upstream publication is claimed.

## Classified visible warnings

- **TOOL-002 — discrete component modeling:** Q1 has nine physical pads and uses a generic chip with explicit, tested source/gate/drain mapping. The native three-terminal MOSFET API cannot express this footprint directly. IC-style checks therefore report no requires_power/requires_ground pins, and the Q prefix is flagged. Adding fake IC supply pins would be incorrect.
- TH1 is an NTC modeled with a resistor primitive and intentionally uses the TH reference prefix.
- F1, D1 and TH1 have visible reference labels supplied by wrappers, but the schematic styling checker does not associate them with their custom symbols. Three warnings remain; these are not physical routing errors.
- **TOOL-005 — schematic pin spacing:** the ineffective schPinSpacing prop was removed; supported per-pin margins are used. Schematic refinement remains possible without changing the routed copper.

## Other outstanding items

- **TOOL-003 — doctor registry configuration:** the earlier global npm authorization-header check failed while registry login/import/public source upload worked. No credentials or global configuration were changed. This is separate from circuit correctness.
- The tscircuit GitHub app previously returned repository_not_accessible (403). The two public repositories are published separately; no broader app access was granted.
- Assembly stock, exact passive/connector qualifications, CAD model alignment and filled/capped thermal-via processing remain unconfirmed.
- Current/thermal ratings, 3 V margin, regenerative transients and store qualification require bench evidence, as recorded in DESIGN_REVIEW.md and TEST_PLAN.md.

Sandboxed builds can show supplier-fetch warnings because network access is unavailable. Final build evidence is collected with network access; those warnings do not establish supplier unavailability. Native commands may exit successfully even when they report findings, so both logs and generated error records are reviewed.
