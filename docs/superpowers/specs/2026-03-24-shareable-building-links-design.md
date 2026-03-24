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
- Field-level validation in `decodeScenario` (deferred to v2)

---

## Canonical Types (`src/shared/`)

A new `src/shared/` directory holds code with zero React/Redux dependencies, importable from both the web app and Node. It lives inside `src/` to remain within the existing `tsconfig.app.json` compile scope (which has `"include": ["src"]`). The CLI files in `cli/` are plain `.js` and import from `src/shared/` directly — no additional tsconfig required.

### `BuildingScenario`

The public contract for all sharing, CLI, and calculation interfaces. Intentionally separate from the Redux store shape so internal UI changes don't break external URLs or scripts.

```typescript
// src/shared/types.ts

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
  bbl: string             // e.g. "1-00072-7201" — sourced from ll84_selected_property.nyc_bbl
  property_id: string     // sourced from ll84_selected_property.property_id
  year: string            // LL84YearTypes key, e.g. "ll84_2025_cal_2024"
  building_name: string   // sourced from ll84_selected_property.property_name
  year_label: string      // sourced from ll84_year_label in ll84 slice
}

type BuildingScenario = {
  v: 1
  building_uses: BuildingUse[]          // 1–3 uses
  utilities: UtilityInputs
  utility_rates?: {                     // omit to use default rates
    elec: number
    gas: number
    steam: number
    fuel_two: number
    fuel_four: number
  }
  ll84?: LL84Provenance                 // present only if loaded from LL84
}
```

`utility_rates` being absent means default rates apply. The adapter must set `is_default_rates: true` in the Redux slice when `utility_rates` is absent, and `is_default_rates: false` when it is present. Neglecting this will cause the UI to show custom rate inputs while Redux disagrees.

---

## Encoding

### Base64url (not standard base64)

The spec uses **base64url** encoding (RFC 4648 §5), not standard base64. Standard `btoa` produces `+`, `/`, and `=` characters which corrupt silently in URL query parameters. Base64url uses `-` and `_` instead and omits padding — safe in URLs without `encodeURIComponent`.

Additionally, `btoa` throws a `DOMException` if the input contains characters outside Latin-1 (U+0000–U+00FF). NYC property names can include em dashes, curly quotes, and other non-ASCII characters. The encode path must handle arbitrary Unicode.

**Browser:**
```typescript
function toBase64url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function fromBase64url(str: string): string {
  const padded = str + '=='.slice(0, (4 - str.length % 4) % 4)
  return decodeURIComponent(escape(atob(padded.replace(/-/g, '+').replace(/_/g, '/'))))
}
```

**Node (CLI):**
```javascript
const toBase64url = str => Buffer.from(str, 'utf8').toString('base64url')
const fromBase64url = str => Buffer.from(str, 'base64url').toString('utf8')
```

Both implementations produce the same output for ASCII input and both handle full Unicode correctly.

**URL length:** A fully populated `BuildingScenario` (3 building uses, all utility fields, LL84 provenance) encodes to ~400–600 characters — well within browser URL limits.

---

## New Files

| Path | Purpose |
|------|---------|
| `src/shared/types.ts` | `BuildingScenario` and related canonical types |
| `src/shared/base64url.ts` | Unicode-safe base64url encode/decode (browser implementation) |
| `src/shared/urlState.ts` | `encodeScenario(s) → string`, `decodeScenario(str) → BuildingScenario \| null` |
| `src/shared/calculations.ts` | Port of `ll97_output_calcs.tsx` — pure functions, no React or d3 deps |
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
2. Share button reads `building_inputs` + ll84 slice from Redux
3. `scenarioAdapter.toScenario(buildingInputs, ll84Slice)` converts to `BuildingScenario`
   - `ll84Provenance.bbl` ← `ll84Slice.ll84_selected_property.nyc_bbl`
   - `ll84Provenance.property_id` ← `ll84Slice.ll84_selected_property.property_id`
   - `ll84Provenance.building_name` ← `ll84Slice.ll84_selected_property.property_name`
   - `ll84Provenance.year_label` ← `ll84Slice.ll84_year_label`
   - `ll84Provenance.year` ← `ll84Slice.ll84_year_selection`
   - `utility_rates` included only if `buildingInputs.is_default_rates === false`
4. `encodeScenario()` → base64url string
5. Written to `window.location.search` and copied to clipboard via `navigator.clipboard.writeText`

### Loading (web)

1. `UrlStateLoader` mounts inside `App.tsx` **before** any other state-modifying component (first child after providers). This ensures it fires before any effect that touches Redux state.
2. Checks for `?state=` param in `window.location.search`
3. `decodeScenario()` → `BuildingScenario | null`
4. On success: `scenarioAdapter.fromScenario(scenario)` → dispatch `setBuildingInputsFromScenario` (new action, see adapter spec) and ll84 metadata actions. Sets `is_default_rates: true` if `utility_rates` absent, `false` if present.
5. Replace history entry via `window.history.replaceState` to strip `?state` from the URL (back button still works, URL is clean after load)
6. On failure (null returned): silent fallback to default Redux state — no dispatch, no error shown

Note: If a user has been working and opens a shared link in the same tab, their state will be replaced. This is the expected behavior for a "load this building" link. The app has no session persistence, so there is no prior work to recover.

### Why `window.location.search` instead of `useSearchParams`

`react-router-dom` v7 is installed but unused in the app today (no `<Router>` wrapping). `UrlStateLoader` reads `window.location.search` directly rather than introducing a router context. This keeps the load behavior as a side-effectful init step rather than route-dependent logic, and avoids adding a Router wrapper just to read a one-time param. If routing is added in the future, `UrlStateLoader` can be trivially migrated to `useSearchParams`.

---

## `src/shared/urlState.ts`

```typescript
import type { BuildingScenario } from './types'
import { toBase64url, fromBase64url } from './base64url'

export function encodeScenario(scenario: BuildingScenario): string {
  return toBase64url(JSON.stringify(scenario))
}

export function decodeScenario(encoded: string): BuildingScenario | null {
  try {
    const parsed = JSON.parse(fromBase64url(encoded))
    if (parsed?.v !== 1) return null
    return parsed as BuildingScenario
  } catch {
    return null
  }
}
```

Field-level validation (range checks, type coercion) is deferred to v2. v1 trusts that the blob is structurally valid if it parses and has `v: 1`.

When v2 ships, `decodeScenario` should be updated to handle both `v: 1` and `v: 2` blobs. v1 blobs should be treated as legacy but still decoded where possible. Unknown future versions (`v > 2`) return `null`.

---

## `src/lib/scenarioAdapter.ts`

Bridges `BuildingScenario` and the Redux store. Two functions:

**`toScenario(buildingInputs: BuildingInputTypes, ll84Slice: LL84QuerySliceTypes): BuildingScenario`**
- Maps `building_types[]` → `building_uses[]`
- Maps all utility consumption fields including `electric_onsite_generation.photovoltaic.consumption` → `utilities.elec_onsite_gen_kwh`
- Includes `utility_rates` only if `buildingInputs.is_default_rates === false`
- Includes `ll84` block only if `ll84Slice.is_ll84_loaded === true`

**`fromScenario(scenario: BuildingScenario): { inputs: BuildingInputTypes, ll84Meta: Partial<LL84QuerySliceTypes> }`**
- Maps `building_uses[]` → `building_types[]` with sequential `building_id`s (0, 1, 2)
- Maps `utilities.elec_onsite_gen_kwh` → `electric_onsite_generation.photovoltaic.consumption` (top-level field in `BuildingInputTypes`, separate from `utilities`)
- Sets `is_default_rates: true` if `scenario.utility_rates` is absent, `false` if present
- Returns `ll84Meta` with `is_ll84_loaded`, `ll84_building_name`, `ll84_year_label`, and `ll84_year_selection` populated from `scenario.ll84` if present. Restoring `ll84_year_selection` ensures the year dropdown shows the correct value in the LL84 provenance display rather than the default.

**New Redux action required:** Add `setBuildingInputsFromScenario(payload: BuildingInputTypes)` to `buildinginputslice.tsx`, following the same pattern as the existing `setBuildingInputsFromLL84Results` action. This action replaces the full building inputs state. `UrlStateLoader` dispatches this action after calling `fromScenario`.

This is the only file that knows about both canonical and Redux types.

---

## `src/shared/calculations.ts`

A port of `ll97_output_calcs.tsx` for Node use. `ll97_output_calcs.tsx` has no React or d3 imports — the main dependency concern is import path resolution.

`ll97_output_calcs.tsx` imports from `'types'` (a Vite/tsconfig path alias) and `'./lookups'` (relative). Neither resolves in a plain Node `.js` CLI.

Resolution strategy:
- `src/shared/calculations.ts` imports coefficient lookup data from `src/locallaw/lookups.tsx` using a relative path (`'../locallaw/lookups'`). This works from within `src/shared/` and stays within the tsconfig compile scope.
- The CLI (`cli/calculate.js`) calls `src/shared/calculations.ts` via a relative import. Since `cli/` is outside `src/`, it imports as `'../src/shared/calculations.js'` (or use the compiled output path if a build step is added).
- The `'types'` alias: `src/shared/calculations.ts` imports only the types it needs — move them into `src/shared/types.ts` or use `../../types` relative path. Do not rely on the `'types'` alias in `src/shared/`.

The port exposes the same calculation functions. `ll97_output_calcs.tsx` in `src/locallaw/` is not modified.

---

## CLI

### `cli/generate-url.js`

Accepts building parameters, constructs a `BuildingScenario`, encodes it, and outputs a full URL.

```bash
# Single building
node cli/generate-url.js \
  --bldg-type Office --bldg-area 50000 \
  --elec 1200000 --gas 80000 \
  --bbl "1-00072-7201" --building-name "Empire State Building" \
  --base-url https://yourapp.com

# From existing state blob (modify and re-encode)
node cli/generate-url.js \
  --from-state <base64blob> \
  --set gas=76000

# Batch: vary a single field across N steps
node cli/generate-url.js \
  --from-state <base64blob> \
  --vary gas --step -5% --count 10
```

Batch `--vary` behavior:
- `--vary <field>` selects a field from `utilities` (e.g. `gas`, `elec`, `steam`)
- `--step <value>` applies a percentage (`-5%`) or absolute (`-5000`) delta per iteration
- `--count <n>` produces N URLs, starting from the base state
- Output: N URLs to stdout, one per line — stdout is clean for piping. Metadata (step number, field value) is written to stderr: `// step 1: gas_therms=80000`. Use `2>/dev/null` to suppress metadata if piping URLs.

Exit code 1 + stderr message on invalid flags or unrecognizable `--from-state` blob.

### `cli/calculate.js`

Accepts building parameters and outputs calculation results as JSON.

```bash
node cli/calculate.js \
  --bldg-type Office --bldg-area 50000 \
  --elec 1200000 --gas 80000

# From state blob
node cli/calculate.js --from-state <base64blob>

# From JSON file
node cli/calculate.js --from-file scenario.json

# Limit year range (default: 2024–2034)
node cli/calculate.js --from-state <blob> --years 2024-2050
```

Output: JSON array to stdout, one object per year:
```json
[
  {
    "year": 2024,
    "total_emissions_tons": 450.2,
    "emissions_limit_tons": 380.0,
    "excess_tons": 70.2,
    "fine_usd": 14040,
    "is_compliant": false
  },
  ...
]
```

Exit code 1 + stderr message on invalid flags, bad blob, or calculation errors.

`--from-file scenario.json` expects the file to contain a raw `BuildingScenario` JSON object (same structure as the decoded blob). It is not a base64-encoded string.

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Malformed base64url | `decodeScenario` returns `null`, app loads default state |
| Valid JSON but `v !== 1` | Returns `null`, silent fallback |
| Missing optional fields | Apply defaults (same as fresh load) |
| Non-ASCII characters in building name | Handled by Unicode-safe base64url encode/decode |
| `+`/`/` characters in URL | Non-issue — base64url uses `-`/`_` |
| CLI — invalid flags | Print usage to stderr, exit code 1 |
| CLI — bad `--from-state` blob | Print error to stderr, exit code 1 |
| CLI — `--from-file` file not found | Print error to stderr, exit code 1 |
| `building_type` not in `building_type_co2_coefficients` | CLI: print error to stderr, exit code 1. Web: silently load default state (same as decode failure). |

---

## Schema Documentation (`docs/schema.md`)

Covers:
- Full `BuildingScenario` field reference with types, units, and valid values
- `building_type` valid values (drawn from `building_type_co2_coefficients` lookup)
- `ll84.year` valid values (drawn from `ll84_year_lookups`)
- `utility_rates`: if absent, app uses defaults; list default values for reference
- Worked examples: constructing a blob from scratch in Python and JS/Node
- Batch generation pattern using `cli/generate-url.js`

---

## What Is Not Changing

- `ll97_output_calcs.tsx` stays as-is in `src/locallaw/`. `src/shared/calculations.ts` is a parallel port for Node use.
- Redux store shape is unchanged — `scenarioAdapter.ts` handles translation at the boundary.
- No routing library changes — `UrlStateLoader` reads `window.location.search` directly.
- No backend, no persistence, no short URLs.
