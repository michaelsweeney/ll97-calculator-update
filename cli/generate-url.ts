import { readFileSync } from 'fs'
import { encodeScenario, decodeScenario } from '../src/shared/urlState'
import type { BuildingScenario, UtilityInputs } from '../src/shared/types'

const BASE_URL = process.env.LL97_BASE_URL ?? 'https://ll97calc.com'

function parseArgs() {
  const args = process.argv.slice(2)
  const get = (flag: string) => {
    const i = args.indexOf(flag)
    return i !== -1 ? args[i + 1] : undefined
  }
  const has = (flag: string) => args.includes(flag)
  return { get, has, args }
}

function buildScenarioFromFlags(): BuildingScenario {
  const { get } = parseArgs()
  const type = get('--bldg-type')
  const area = get('--bldg-area')

  if (!type || !area) {
    process.stderr.write(
      'Usage: cli/generate-url.ts --bldg-type <type> --bldg-area <sqft> [--elec <kwh>] ...\n' +
      '                           --from-state <blob> [--set <field>=<value>]\n' +
      '                           --from-state <blob> --vary <field> --step <value> --count <n>\n'
    )
    process.exit(1)
  }

  return {
    v: 1,
    building_uses: [{ building_type: type, building_area: parseInt(area, 10) }],
    utilities: {
      elec_kwh: parseFloat(get('--elec') ?? '0'),
      gas_therms: parseFloat(get('--gas') ?? '0'),
      steam_mlbs: parseFloat(get('--steam') ?? '0'),
      fuel_two_gal: parseFloat(get('--fuel-two') ?? '0'),
      fuel_four_gal: parseFloat(get('--fuel-four') ?? '0'),
      elec_onsite_gen_kwh: parseFloat(get('--onsite-gen') ?? '0'),
    },
    ll84: get('--bbl') ? {
      bbl: get('--bbl')!,
      property_id: get('--property-id') ?? '',
      year: get('--ll84-year') ?? '',
      building_name: get('--building-name') ?? '',
      year_label: get('--year-label') ?? '',
    } : undefined,
  }
}

function applySet(scenario: BuildingScenario, setFlag: string): BuildingScenario {
  const [field, value] = setFlag.split('=')
  const num = parseFloat(value)
  if (field in scenario.utilities) {
    return {
      ...scenario,
      utilities: { ...scenario.utilities, [field as keyof UtilityInputs]: num },
    }
  }
  process.stderr.write(`Warning: unknown --set field "${field}"\n`)
  return scenario
}

function applyStep(value: number, step: string): number {
  if (step.endsWith('%')) {
    return value * (1 + parseFloat(step) / 100)
  }
  return value + parseFloat(step)
}

const { get, has } = parseArgs()
const fromState = get('--from-state')
const fromFile = get('--from-file')

let baseScenario: BuildingScenario

if (fromState) {
  const s = decodeScenario(fromState)
  if (!s) { process.stderr.write('Error: invalid --from-state blob\n'); process.exit(1) }
  baseScenario = s
} else if (fromFile) {
  try {
    baseScenario = JSON.parse(readFileSync(fromFile, 'utf8'))
  } catch {
    process.stderr.write(`Error: could not read --from-file "${fromFile}"\n`); process.exit(1)
  }
} else {
  baseScenario = buildScenarioFromFlags()
}

// Apply --set override
const setFlag = get('--set')
if (setFlag) baseScenario = applySet(baseScenario, setFlag)

// Batch --vary mode
const varyField = get('--vary') as keyof UtilityInputs | undefined
const stepFlag = get('--step')
const countFlag = get('--count')

if (varyField && stepFlag && countFlag) {
  const count = parseInt(countFlag, 10)
  let current = baseScenario.utilities[varyField]

  for (let i = 0; i < count; i++) {
    const scenario = {
      ...baseScenario,
      utilities: { ...baseScenario.utilities, [varyField]: current },
    }
    const url = `${BASE_URL}?state=${encodeScenario(scenario)}`
    process.stderr.write(`// step ${i + 1}: ${varyField}=${Math.round(current)}\n`)
    process.stdout.write(url + '\n')
    current = applyStep(current, stepFlag)
  }
} else {
  // Single URL
  const url = `${BASE_URL}?state=${encodeScenario(baseScenario)}`
  process.stdout.write(url + '\n')
}
