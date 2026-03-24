import { readFileSync } from 'fs'
import { calculateScenario } from '../src/shared/calculations'
import { decodeScenario } from '../src/shared/urlState'
import type { BuildingScenario } from '../src/shared/types'

function parseArgs(): { scenario: BuildingScenario; startYear: number; endYear: number } {
  const args = process.argv.slice(2)
  const get = (flag: string) => {
    const i = args.indexOf(flag)
    return i !== -1 ? args[i + 1] : undefined
  }

  let scenario: BuildingScenario | null = null
  const startYear = parseInt(get('--start-year') ?? '2024', 10)
  const endYear = parseInt(get('--end-year') ?? '2034', 10)

  const fromState = get('--from-state')
  const fromFile = get('--from-file')

  if (fromState) {
    scenario = decodeScenario(fromState)
    if (!scenario) {
      process.stderr.write('Error: invalid --from-state blob\n')
      process.exit(1)
    }
  } else if (fromFile) {
    try {
      scenario = JSON.parse(readFileSync(fromFile, 'utf8'))
    } catch {
      process.stderr.write(`Error: could not read --from-file "${fromFile}"\n`)
      process.exit(1)
    }
  } else {
    const type = get('--bldg-type')
    const area = get('--bldg-area')
    const elec = get('--elec') ?? '0'
    const gas = get('--gas') ?? '0'
    const steam = get('--steam') ?? '0'
    const fuelTwo = get('--fuel-two') ?? '0'
    const fuelFour = get('--fuel-four') ?? '0'
    const onsiteGen = get('--onsite-gen') ?? '0'

    if (!type || !area) {
      process.stderr.write(
        'Usage: cli/calculate.ts --bldg-type <type> --bldg-area <sqft> [--elec <kwh>] [--gas <therms>] ...\n' +
        '                        --from-state <blob> | --from-file <path>\n'
      )
      process.exit(1)
    }

    scenario = {
      v: 1,
      building_uses: [{ building_type: type, building_area: parseInt(area, 10) }],
      utilities: {
        elec_kwh: parseFloat(elec),
        gas_therms: parseFloat(gas),
        steam_mlbs: parseFloat(steam),
        fuel_two_gal: parseFloat(fuelTwo),
        fuel_four_gal: parseFloat(fuelFour),
        elec_onsite_gen_kwh: parseFloat(onsiteGen),
      },
    }
  }

  return { scenario: scenario!, startYear, endYear }
}

const { scenario, startYear, endYear } = parseArgs()

try {
  const results = calculateScenario(scenario, { startYear, endYear })
  process.stdout.write(JSON.stringify(results, null, 2) + '\n')
} catch (err: any) {
  process.stderr.write(`Error: ${err.message}\n`)
  process.exit(1)
}
