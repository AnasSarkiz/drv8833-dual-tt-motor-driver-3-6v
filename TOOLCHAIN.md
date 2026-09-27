# Toolchain

Resolved 2026-09-27. macOS 26.6.2, arm64. Node v25.6.0; Bun/package manager 1.3.9. Latest stable npm tscircuit dist-tag resolved once to 0.0.2646. TypeScript 7 was initially resolved but immediately replaced with 5.9.3 to satisfy tscircuit’s declared ^5 peer range before design validation. No competing lockfile.

| Package | Resolved version |
|---|---|
| tscircuit | 0.0.2646 |
| @tscircuit/core | 0.0.1971 |
| @tscircuit/cli | 0.1.2167 |
| @tscircuit/props | 0.0.666 |
| circuit-json | 0.0.499 |
| circuit-to-svg | 0.0.430 |
| react | 19.3.0 |
| typescript | 5.9.3 |
| @biomejs/biome | 2.5.14 |

Canonical source: `index.circuit.tsx`; configured in package and tscircuit config. Registry cloud auto-upgrade is disabled. Imports use real `tsci import --jlcpcb --use-exact-footprint`; netlist, placement and schematic-placement commands were inspected before use. Builds use `--routing-disabled`; the source lock also protects dev/registry previews.

Commands actually used: `tsci init --yes --no-install`, `bun install`, `bun run typecheck`, `tsci doctor`, `tsci search C-number --jlcpcb --json`, `tsci import C-number --jlcpcb --use-exact-footprint`, `tsci check netlist index.circuit.tsx`, `tsci check placement index.circuit.tsx`, `tsci check schematic-placement index.circuit.tsx`, `tsci build index.circuit.tsx --routing-disabled --pcb-svgs --schematic-svgs`, `bun scripts/check-schema.ts`, `bun test`, `bun scripts/render-pre-route.ts`. No routing command was used.

Hashes are recorded in `artifacts/pre-route/hashes.json`. The current strict project build is intentionally blocked by a real schema-validation failure, not silently downgraded to PASS.
