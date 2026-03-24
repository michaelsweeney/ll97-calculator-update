import { describe, it, expect } from 'vitest'
import { calculateScenario } from './calculations'
import type { BuildingScenario } from './types'

const officeScenario: BuildingScenario = {
  v: 1,
  building_uses: [{ building_type: 'Office', building_area: 100000 }],
  utilities: {
    elec_kwh: 2000000,
    gas_therms: 150000,
    steam_mlbs: 0,
    fuel_two_gal: 0,
    fuel_four_gal: 0,
    elec_onsite_gen_kwh: 0,
  },
}

describe('calculateScenario', () => {
  it('returns one result per year from 2024 to 2034 by default', () => {
    const results = calculateScenario(officeScenario)
    expect(results.length).toBe(11)
    expect(results[0].year).toBe(2024)
    expect(results[results.length - 1].year).toBe(2034)
  })

  it('respects --years range', () => {
    const results = calculateScenario(officeScenario, { startYear: 2024, endYear: 2050 })
    expect(results.length).toBe(27)
    expect(results[results.length - 1].year).toBe(2050)
  })

  it('calculates a fine for a building that exceeds its limit', () => {
    const results = calculateScenario(officeScenario)
    const y2024 = results.find(r => r.year === 2024)!
    expect(y2024.fine_usd).toBeGreaterThan(0)
    expect(y2024.is_compliant).toBe(false)
  })

  it('returns zero fine for zero-consumption building', () => {
    const empty: BuildingScenario = {
      ...officeScenario,
      utilities: { elec_kwh: 0, gas_therms: 0, steam_mlbs: 0, fuel_two_gal: 0, fuel_four_gal: 0, elec_onsite_gen_kwh: 0 },
    }
    const results = calculateScenario(empty)
    results.forEach(r => expect(r.fine_usd).toBe(0))
  })

  it('subtracts onsite generation from electricity', () => {
    const with_pv: BuildingScenario = {
      ...officeScenario,
      utilities: { ...officeScenario.utilities, elec_onsite_gen_kwh: 2000000 },
    }
    const without_pv = calculateScenario(officeScenario)
    const with_pv_results = calculateScenario(with_pv)
    expect(with_pv_results[0].total_emissions_tons).toBeLessThan(without_pv[0].total_emissions_tons)
  })
})
