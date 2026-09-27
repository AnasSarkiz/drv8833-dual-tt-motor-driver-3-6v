# Routing gate — BLOCKED

ROUTING STATUS: DISABLED

DESIGN STAGE: UNROUTED CHASSIS-MODULE DRAFT / DESIGN REVIEW INCOMPLETE

USER APPROVAL: NOT RECEIVED

MANUFACTURING STATUS: NOT ORDERABLE — UNROUTED

- [x] Separate local project; pinned toolchain and canonical source recorded.
- [x] Source and build/preview configuration disable routing.
- [x] Minimum via drill 0.30 mm and pad 0.45 mm encoded in generated board.
- [x] Negative guard fixtures reject routed copper, signal vias, changed minimums and nested overrides.
- [ ] Actual generated Circuit JSON passes the pinned schema (TOOL-001 and TOOL-004 block).
- [x] All 21 selected candidate part types really imported; BOM references/quantities generated from circuit.
- [ ] Independent geometry, exact manufacturer and assembly eligibility review complete.
- [ ] All sourcing fields current and complete (C25804 stock lookup unresolved).
- [ ] Power path, bus-energy protection, support components and temperature review complete.
- [ ] Pin specification, power states and external-port protection resolved.
- [ ] Four schematic sheets fully readable and reviewed.
- [x] Reference TT motor and standalone chassis arrangement recorded; 75 × 60 mm outline and M3 mounting pattern implemented.
- [x] Generic module dimensions accepted; fit to a specific chassis is deferred until one is selected, with no universal-fit claim.
- [ ] Connector access, mechanical envelopes and 3D fit reviewed.
- [ ] Assembly/paste/thermal process reviewed.
- [ ] All relevant pre-route checks pass with warnings classified and resolved.
- [x] PUBLIC visibility selected and both publications authorized by the user.
- [x] Both public source uploads and registry visibility verified (see PUBLICATION.md); CI and registry build both fail.
- [ ] User approves exactly this reviewed revision.

No approval is requested for this incomplete draft. [PRE_ROUTING_REVIEW.md](PRE_ROUTING_REVIEW.md) separates required design/tool fixes from later chassis selection and physical prototype testing. Resolve the open design/tool/assembly items, regenerate hashes and present the complete review package first. The future phrase “APPROVE BOM AND PLACEMENT — ENABLE ROUTING” would apply only to that reviewed revision. Any material design change requires renewed review.
