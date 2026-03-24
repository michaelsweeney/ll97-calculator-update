# CLI Examples

## Calculate compliance results

Basic calculation — returns JSON for 2024–2034 (default range):

```bash
npm run cli:calculate -- --bldg-type Office --bldg-area 100000 --elec 2000000 --gas 150000
```

Full 2024–2050 range:

```bash
npm run cli:calculate -- --bldg-type Office --bldg-area 100000 --elec 2000000 --gas 150000 --start-year 2024 --end-year 2050
```

With steam and fuel oil:

```bash
npm run cli:calculate -- --bldg-type "Multifamily Housing" --bldg-area 200000 --elec 800000 --steam 5000
```

With on-site solar generation:

```bash
npm run cli:calculate -- --bldg-type Office --bldg-area 100000 --elec 2000000 --gas 150000 --onsite-gen 300000
```

---

## Generate shareable URLs

Single URL:

```bash
npm run cli:generate-url -- --bldg-type Office --bldg-area 50000 --elec 1200000 --gas 80000
```

Override the base URL (defaults to `https://ll97calc.com`):

```bash
LL97_BASE_URL=http://localhost:3001 npm run cli:generate-url -- --bldg-type Office --bldg-area 50000 --elec 1200000 --gas 80000
```

---

## Round-trip: generate URL → calculate

```bash
BLOB=$(node --import tsx/esm cli/generate-url.ts --bldg-type Office --bldg-area 50000 --elec 1200000 --gas 80000 2>/dev/null | sed 's/.*state=//')

npm run cli:calculate -- --from-state "$BLOB"
```

---

## Batch mode: vary a utility field

Generate 5 URLs stepping gas consumption down 5% each time:

```bash
BLOB=$(node --import tsx/esm cli/generate-url.ts --bldg-type Office --bldg-area 50000 --elec 1200000 --gas 80000 2>/dev/null | sed 's/.*state=//')

npm run cli:generate-url -- --from-state "$BLOB" --vary gas_therms --step -5% --count 5
```

Step electricity up by 100,000 kWh at a time:

```bash
npm run cli:generate-url -- --from-state "$BLOB" --vary elec_kwh --step 100000 --count 10
```

Vary fields: `elec_kwh`, `gas_therms`, `steam_mlbs`, `fuel_two_gal`, `fuel_four_gal`, `elec_onsite_gen_kwh`

---

## Override a single field on an existing state blob

```bash
npm run cli:generate-url -- --from-state "$BLOB" --set gas_therms=50000
```

---

## Load from a JSON file

Save a scenario as JSON and use it as input:

```bash
cat > /tmp/scenario.json << 'EOF'
{
  "v": 1,
  "building_uses": [{ "building_type": "Office", "building_area": 50000 }],
  "utilities": {
    "elec_kwh": 1200000,
    "gas_therms": 80000,
    "steam_mlbs": 0,
    "fuel_two_gal": 0,
    "fuel_four_gal": 0,
    "elec_onsite_gen_kwh": 0
  }
}
EOF

npm run cli:calculate -- --from-file /tmp/scenario.json
npm run cli:generate-url -- --from-file /tmp/scenario.json
```

---

## Sample state blob

This blob encodes: Office, 50,000 sqft, 1,200,000 kWh electricity, 80,000 therms gas.

```
eyJ2IjoxLCJidWlsZGluZ191c2VzIjpbeyJidWlsZGluZ190eXBlIjoiT2ZmaWNlIiwiYnVpbGRpbmdfYXJlYSI6NTAwMDB9XSwidXRpbGl0aWVzIjp7ImVsZWNfa3doIjoxMjAwMDAwLCJnYXNfdGhlcm1zIjo4MDAwMCwic3RlYW1fbWxicyI6MCwiZnVlbF90d29fZ2FsIjowLCJmdWVsX2ZvdXJfZ2FsIjowLCJlbGVjX29uc2l0ZV9nZW5fa3doIjowfX0
```

Load it in the browser (dev server):

```
http://localhost:3001?state=eyJ2IjoxLCJidWlsZGluZ191c2VzIjpbeyJidWlsZGluZ190eXBlIjoiT2ZmaWNlIiwiYnVpbGRpbmdfYXJlYSI6NTAwMDB9XSwidXRpbGl0aWVzIjp7ImVsZWNfa3doIjoxMjAwMDAwLCJnYXNfdGhlcm1zIjo4MDAwMCwic3RlYW1fbWxicyI6MCwiZnVlbF90d29fZ2FsIjowLCJmdWVsX2ZvdXJfZ2FsIjowLCJlbGVjX29uc2l0ZV9nZW5fa3doIjowfX0
```
