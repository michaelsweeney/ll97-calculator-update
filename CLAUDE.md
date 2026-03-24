# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

NYC Local Law 97 compliance calculator — a React/TypeScript/Vite app that helps building owners calculate greenhouse gas emissions, compliance status, and penalties for NYC's LL97 law. Migrated from Create React App to Vite.

Node.js >= 20.0.0 required.

## Commands

```bash
npm run dev           # Dev server at http://localhost:3001
npm run build         # Production build → build/
npm run type-check    # TypeScript check without emit
npm test              # Tests in watch mode (Vitest)
npm run test:ui       # Interactive test UI
npm run test:coverage # Coverage report
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier format
```

## Architecture

### State Management (Redux Toolkit)

Four slices in `src/store/`:
- `buildinginputslice` — user-entered building data (type, area, utility consumption)
- `buildingoutputslice` — computed emissions and cost results
- `uislice` — current view, chart options, window dimensions
- `ll84queryslice` — NYC OpenData LL84 API query state

Outputs are derived from inputs via the calculation engine whenever inputs change.

### Business Logic (`src/locallaw/`)

- `ll97_output_calcs.tsx` — core engine: converts utility consumption → kBtu → CO2 tons → compliance status and fines for 2024–2050
- `lookups.tsx` — emission coefficients, CO2 limits by building type/year, fine rates
- `ll84_query.tsx` — fetches NYC OpenData LL84 building records
- `ll84_query_to_ll97_inputs.tsx` — transforms LL84 API data into building input format

### Components (`src/components/`)

- `charts/` — D3 chart components and SVG helpers
- `dialogues/` — calc info, load-building, LL84 summary dialogs
- `printlayout/` — separate component tree for print/PDF output
- `mainlayout.tsx`, `sidebar.tsx`, `header.tsx` — shell layout

### Path Aliases

Configured in `vite.config.ts` and `tsconfig.app.json`: `@/` → `src/`, plus `components/`, `store/`, etc.

### Build Output

Code-split into separate vendor bundles: React, MUI, and D3 — configured in `vite.config.ts`.

## Environment

Copy `.env.example` to `.env` and set `VITE_NYC_OPENDATA_API_BASE_URL` for LL84 data integration.

## Deployment

Vercel and Netlify configs are pre-configured (`vercel.json`, `netlify.toml`). See `DEPLOYMENT.md` and `QUICK_DEPLOY.md`.
