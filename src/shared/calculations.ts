// Port of src/locallaw/ll97_output_calcs.tsx — no React/d3 deps.
// Imports lookups via relative path (not 'locallaw/' alias).
import {
  building_type_co2_coefficients,
  fine_per_ton_co2,
  ll97_current_elec_coefficients,
  non_electric_tons_per_kbtu_coefficients,
  yearToYearRangeString,
} from '../locallaw/lookups'
import type { BuildingScenario, CalculationResult } from './types'

type CalcOptions = {
  startYear?: number
  endYear?: number
}

export function calculateScenario(
  scenario: BuildingScenario,
  options: CalcOptions = {}
): CalculationResult[] {
  const { startYear = 2024, endYear = 2034 } = options
  const { building_uses, utilities } = scenario

  let co2limit_2024 = 0
  let co2limit_2030 = 0
  let co2limit_2035 = 0
  let co2limit_2040 = 0
  let co2limit_2050 = 0

  building_uses.forEach(use => {
    const coefficients = building_type_co2_coefficients.find(
      t => t.building_type === use.building_type
    )
    if (!coefficients) {
      throw new Error(`Unknown building type: "${use.building_type}"`)
    }
    co2limit_2024 += coefficients['2024-2029'] * use.building_area
    co2limit_2030 += coefficients['2030-2034'] * use.building_area
    co2limit_2035 += coefficients['2035-2039'] * use.building_area
    co2limit_2040 += coefficients['2040-2049'] * use.building_area
    co2limit_2050 += coefficients['2050-'] * use.building_area
  })

  const elec_native = utilities.elec_kwh - utilities.elec_onsite_gen_kwh
  const elec_kbtu = elec_native * 3.412
  const gas_kbtu = utilities.gas_therms * 100
  const steam_kbtu = utilities.steam_mlbs * 1194
  const fuel_two_kbtu = utilities.fuel_two_gal * 138
  const fuel_four_kbtu = utilities.fuel_four_gal * 146
  const total_kbtu = elec_kbtu + gas_kbtu + steam_kbtu + fuel_two_kbtu + fuel_four_kbtu

  const rates = scenario.utility_rates ?? {
    elec: 0.12, gas: 1.5, steam: 30, fuel_two: 3.5, fuel_four: 3.2,
  }
  const utility_cost_usd =
    elec_native * rates.elec +
    utilities.gas_therms * rates.gas +
    utilities.steam_mlbs * rates.steam +
    utilities.fuel_two_gal * rates.fuel_two +
    utilities.fuel_four_gal * rates.fuel_four

  const results: CalculationResult[] = []

  for (const yobj of ll97_current_elec_coefficients) {
    const { year, value } = yobj
    if (year < startYear || year > endYear) continue

    const elec_tons = elec_kbtu * value
    const gas_tons = gas_kbtu * non_electric_tons_per_kbtu_coefficients.gas
    const steam_coefficient =
      year < 2030
        ? non_electric_tons_per_kbtu_coefficients.steam_2024_2029
        : non_electric_tons_per_kbtu_coefficients.steam_2030_2050
    const steam_tons = steam_kbtu * steam_coefficient
    const fuel_two_tons = fuel_two_kbtu * non_electric_tons_per_kbtu_coefficients.fuel_two
    const fuel_four_tons = fuel_four_kbtu * non_electric_tons_per_kbtu_coefficients.fuel_four
    const total_emissions_tons = elec_tons + gas_tons + steam_tons + fuel_two_tons + fuel_four_tons

    let emissions_limit_tons: number | null = null
    if (year >= 2024 && year <= 2029) emissions_limit_tons = co2limit_2024
    else if (year <= 2034) emissions_limit_tons = co2limit_2030
    else if (year <= 2039) emissions_limit_tons = co2limit_2035
    else if (year <= 2049) emissions_limit_tons = co2limit_2040
    else if (year === 2050) emissions_limit_tons = co2limit_2050

    const excess_tons =
      emissions_limit_tons !== null
        ? Math.max(total_emissions_tons - emissions_limit_tons, 0)
        : 0
    const fine_usd = excess_tons * fine_per_ton_co2

    results.push({
      year,
      period: yearToYearRangeString(year),
      total_emissions_tons,
      emissions_limit_tons,
      excess_tons,
      fine_usd,
      is_compliant: fine_usd === 0,
      utility_cost_usd,
      total_kbtu,
    })
  }

  return results
}
