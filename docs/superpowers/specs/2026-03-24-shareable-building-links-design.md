# Shareable Building Links + CLI

**Date:** 2026-03-24
**Status:** Draft

## Overview

Add shareable URLs that encode full calculator state, an optional LL84 provenance reference, and a CLI that can both generate URLs and return calculation results as JSON — without a backend.

## Goals

- Any calculator state (LL84-loaded or manually entered) can be shared via a URL
- URLs are self-contained — no server required to decode or use them
- A CLI enables programmatic URL generation and batch scenario analysis (e.g. 10 versions of the same building with varying NG reductions)
- Calculation logic is accessible outside the browser

## Non-Goals

- URL shortening / persistence
- Backend API or server-side rendering
- Re-fetching LL84 data on link load

---

## Canonical Types (`shared/`)

A new `shared/` directory at the repo root holds code with zero React/Redux dependencies, importable from both the web app and Node.

### `BuildingScenario`

The public contract for all sharing, CLI, and calculation interfaces. Intentionally separate from the Redux store shape so internal UI changes don't break external URLs or scripts.

```typescript
// shared/types.ts

type UtilityInputs = {
  elec_kwh: number
  gas_therms: number
  steam_mlbs: number
  fuel_two_gal: number
  fuel_four_gal: number
  elec_onsite_gen_kwh: number
}

type BuildingUse = {
  building_type: string   // e.g. "Office", "Multifamily Housing"
  building_area: number   // gross sq ft
}

type LL84Provenance = {
  bbl: string             // e.g. "1-00072-7201"
  property_id: string
  year: string            // LL84YearTypes key, e.g. "ll84_2025_cal_2024"
  building_name: string
  year_label: string
}

type BuildingScenario = {
  v: 1
  building_uses: BuildingUse[]          // 1–3 uses
  utilities: UtilityInputs
  utility_rates?: {                     // omit to use defaults
    elec: number
    gas: number
    steam: number
    fuel_two: number
    fuel_four: number
  }
  ll84?: LL84Provenance                 // present only if loaded from LL84
}
```

`utility_rates` is optional — omitting it means the app applies default rates on load, which is the common case.

---

## New Files

| Path | Purpose |
|------|---------|
| `shared/types.ts` | `BuildingScenario` and related canonical types |
| `shared/urlState.ts` | `encodeScenario(s) → string`, `decodeScenario(str) → BuildingScenario \| null` |
| `shared/calculations.ts` | Port of `ll97_output_calcs.tsx` — pure functions, no React deps |
| `src/lib/scenarioAdapter.ts` | Converts Redux `BuildingInputTypes` + ll84 slice ↔ `BuildingScenario` |
| `src/components/UrlStateLoader.tsx` | Mounts in `App.tsx`, reads `?state` on init, hydrates Redux |
| `src/components/iconbuttons.tsx` | Add share button (copy URL to clipboard) |
| `cli/generate-url.js` | CLI: accepts building params or `--from-state`, outputs URL(s) |
| `cli/calculate.js` | CLI: accepts building params, outputs calculation results as JSON |
| `docs/schema.md` | Human-readable schema reference with field descriptions and examples |

---

## Data Flow

### Sharing (web)

1. User clicks "Copy Link"
2. Share button reads `building_inputs` + ll84 metadata from Redux
3. `scenarioAdapter.toScenario()` converts to `BuildingScenario`
4. `encodeScenario()` → base64 JSON string
5. Written to `window.location.search` and copied to clipboard

### Loading (web)

1. `UrlStateLoader` mounts (once, on init)
2. Checks for `?state=` param
3. `decodeScenario()` → `BuildingScenario | null`
4. On success: `scenarioAdapter.fromScenario()` → dispatch to Redux slices
5. Replace history entry to strip `?state` from the URL (back button still works)
6. On failure: silent fallback to default state

### CLI — generate URL

```bash
node cli/generate-url.js \
  --bldg-type Office --bldg-area 50000 \
  --elec 1200000 --gas 80000 \
  --bbl "1-00072-7201" --building-name "Empire State Building"

# Batch: 10 scenarios with 5% NG reduction steps
node cli/generate-url.js \
  --from-state <base64blob> \
  --vary gas --step -5% --count 10
```

Outputs one URL per line to stdout.

### CLI — calculate

```bash
node cli/calculate.js \
  --bldg-type Office --bldg-area 50000 \
  --elec 1200000 --gas 80000

# From an existing state blob
node cli/calculate.js --from-state <base64blob>

# From a JSON file
node cli/calculate.js --from-file scenario.json
```

Outputs calculation results as JSON to stdout (one object per year, 2024–2034 by default, configurable with `--years`).

---

## `shared/urlState.ts`

```typescript
import { BuildingScenario } from './types'

export function encodeScenario(scenario: BuildingScenario): string {
  return btoa(JSON.stringify(scenario))
}

export function decodeScenario(encoded: string): BuildingScenario | null {
  try {
    const parsed = JSON.parse(atob(encoded))
    if (parsed?.v !== 1) return null
    return parsed as BuildingScenario
  } catch {
    return null
  }
}
```

`btoa`/`atob` work in both modern browsers and Node 16+.

---

## `src/lib/scenarioAdapter.ts`

Bridges the canonical `BuildingScenario` type and the Redux store. Two functions:

- `toScenario(buildingInputs, ll84State) → BuildingScenario` — for the share button
- `fromScenario(scenario) → { inputs: BuildingInputTypes, ll84Meta }` — for `UrlStateLoader`

This is the only file that knows about both worlds.

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Malformed base64 | `decodeScenario` returns `null`, app loads default state |
| Valid JSON but unknown `v` version | Returns `null`, silent fallback |
| Missing optional fields | Apply defaults (same as fresh load) |
| CLI — invalid flags | Print usage and exit with code 1 |
| CLI — bad `--from-state` blob | Print error to stderr, exit with code 1 |

---

## Schema Documentation (`docs/schema.md`)

Covers:
- Full `BuildingScenario` field reference with types, units, and valid values
- `building_type` valid values (drawn from `building_type_co2_coefficients`)
- `ll84.year` valid values (drawn from `ll84_year_lookups`)
- Worked examples: constructing a blob from scratch in Python and JS
- Batch generation pattern

---

## What Is Not Changing

- `ll97_output_calcs.tsx` stays as-is in `src/locallaw/`. `shared/calculations.ts` is a port for Node use, not a replacement.
- Redux store shape is unchanged — `scenarioAdapter.ts` handles translation at the boundary.
- No routing library changes — `UrlStateLoader` reads `window.location.search` directly.
- No backend, no persistence, no short URLs.
