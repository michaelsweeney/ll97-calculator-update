# Shareable Building Links + CLI — Implementation Notes

## What was built

### Shared calculation layer (`src/shared/`)

A new `src/shared/` directory holds code that works in both browser and Node (no React/Redux/D3 dependencies):

| File | Purpose |
|---|---|
| `types.ts` | Canonical `BuildingScenario` and `CalculationResult` types |
| `base64url.ts` | Unicode-safe base64url encode/decode (`toBase64url`, `fromBase64url`) |
| `urlState.ts` | `encodeScenario` / `decodeScenario` — JSON ↔ base64url |
| `calculations.ts` | Port of the LL97 calc engine accepting `BuildingScenario` |

All files use relative imports only — no path aliases — so they work in both Vite and Node/tsx.

### Redux bridge (`src/lib/scenarioAdapter.ts`)

`toScenario` converts Redux state (`BuildingInputTypes` + `LL84QuerySliceTypes`) → `BuildingScenario`.
`fromScenario` converts the other direction, returning `inputs` and `ll84Meta`.

### Share button (`src/components/header.tsx`, `src/components/iconbuttons.tsx`)

A share icon button in the header copies a URL to clipboard and opens a dialog showing:
- Decoded building info (type, sqft, utilities, LL84 provenance)
- The shareable URL
- The state blob (for CLI use), if applicable

**URL strategy:**
- If the building was loaded from LL84 → `?bbl=<10digits>&bin=<bin>&year=<ll84_year_key>` (short, re-fetches live data)
- Manual input → `?state=<base64url-blob>` (full encoded state, no network needed on load)

### URL state loader (`src/components/UrlStateLoader.tsx`)

Mounted as the first child in `App.tsx`. On mount, reads URL params and hydrates Redux:

**BBL+BIN mode (`?bbl=&bin=&year=`):**
1. Reconstructs dashed BBL from 10-digit no-dash format (`B-BBBBB-LLLL`)
2. Searches LL84 API — uses BIN as search value when available (avoids BBL format ambiguity), falls back to dashed BBL
3. Matches result: BBL exact match → BIN exact match → first result
4. Dispatches `setSelectedLL84Property` + `setBuildingInputsFromLL84Results`
5. Opens `building_summary_dialogue`
6. Shows green success snackbar with building name, or red error snackbar if not found

**Blob mode (`?state=`):**
1. Decodes base64url → JSON → `BuildingScenario`
2. Dispatches `setBuildingInputsFromScenario` + LL84 metadata actions
3. Shows red error snackbar if blob is invalid/outdated

### CLI (`cli/`)

| Script | Usage |
|---|---|
| `npm run cli:calculate` | Run LL97 calculations, output JSON |
| `npm run cli:generate-url` | Generate shareable URL(s) |

See `cli/EXAMPLES.md` for full usage examples including batch `--vary` mode.

**CLI tsconfig:** `tsconfig.cli.json` uses `moduleResolution: node` and `CommonJS` — separate from the Vite app config which uses `bundler` resolution.

### Footer

Added "supercharged by Cadence OneFive°" left-justified in the footer, using the Cadence OneFive brand style (Nunito 700, `rgb(221, 7, 114)`). Nunito loaded via Google Fonts in `index.html`.

---

## Caveats and known limitations

### BBL/BIN matching
- **BBL format:** The NYC LL84 API stores BBL as `B-BBBBB-LLLL` (with dashes). The URL stores it as 10 digits without dashes (`BBBBBBBLLLL`). Reconstruction assumes the standard NYC BBL format and will break for non-standard values.
- **BIN preferred over BBL for search:** We search by BIN when available because BIN is unique per building and has no formatting ambiguity. BBL can match multiple records (e.g. a large complex with multiple lots).
- **Match fallback:** If neither BBL nor BIN produces an exact match, `results[0]` is used. This could load the wrong building if the search returns multiple results with no exact identifier match.
- **Year-specific availability:** A building may exist in one LL84 year but not another. If the year in the URL doesn't have data for that BBL/BIN, no record will be found.

### Blob (`?state=`) mode
- **No version migration:** The decoder returns `null` for any `v !== 1`. Old links will break silently if the schema version is bumped in the future.
- **Size:** For buildings with many uses and custom rates, the blob can be long but remains URL-safe. No compression is applied.
- **Custom rates not preserved in BBL mode:** When sharing via `?bbl=`, any custom utility rates entered by the user are not included — the loaded building will use default rates.

### CLI
- **Node 20+ required:** Uses `--import tsx/esm` which requires Node 20+.
- **`btoa`/`atob` in Node:** The base64url functions use `btoa`/`atob` which are available in Node 16+ but were not always present. Node 20+ is safe.
- **`tsconfig.cli.json` includes `src/locallaw/`** which has `.tsx` files with React imports. These are `import type` only so they're erased at runtime — safe to use in Node context, but `tsx` must be used as the runner (not plain `ts-node`).

### General
- **LL84 API dependency:** BBL/BIN links require the NYC OpenData LL84 API to be available. If the API is down or rate-limited, links will silently fail to load (error snackbar shown).
- **`window.location` assumptions:** `UrlStateLoader` and the share handler assume a browser environment. The CLI does not use these.
