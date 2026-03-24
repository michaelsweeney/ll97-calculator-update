import { describe, it, expect } from 'vitest'
import { toScenario, fromScenario } from './scenarioAdapter'
import type { BuildingInputTypes } from 'types'
import type { LL84QuerySliceTypes } from 'types'

const baseInputs: BuildingInputTypes = {
  building_types: [{ building_id: 0, building_type: 'Office', building_area: 50000 }],
  utilities: {
    elec: { consumption: 1200000, rate: 0.12 },
    gas: { consumption: 80000, rate: 1.5 },
    steam: { consumption: 0, rate: 30 },
    fuel_two: { consumption: 0, rate: 3.5 },
    fuel_four: { consumption: 0, rate: 3.2 },
  },
  electric_onsite_generation: { photovoltaic: { consumption: 10000 } },
  is_default_rates: true,
}

const emptyLL84 = {
  is_ll84_loaded: false,
  ll84_selected_property: {} as any,
  ll84_year_selection: 'll84_2025_cal_2024' as any,
  ll84_year_label: undefined,
  ll84_building_name: undefined,
  ll84_query_input: '',
  ll84_query_results: [],
  is_ll84_overridden: false,
  has_ll84_summary_been_closed: false,
}

describe('toScenario', () => {
  it('maps building types and utilities correctly', () => {
    const scenario = toScenario(baseInputs, emptyLL84)
    expect(scenario.v).toBe(1)
    expect(scenario.building_uses[0].building_type).toBe('Office')
    expect(scenario.building_uses[0].building_area).toBe(50000)
    expect(scenario.utilities.elec_kwh).toBe(1200000)
    expect(scenario.utilities.gas_therms).toBe(80000)
    expect(scenario.utilities.elec_onsite_gen_kwh).toBe(10000)
  })

  it('omits utility_rates when is_default_rates is true', () => {
    const scenario = toScenario(baseInputs, emptyLL84)
    expect(scenario.utility_rates).toBeUndefined()
  })

  it('includes utility_rates when is_default_rates is false', () => {
    const customRates = { ...baseInputs, is_default_rates: false }
    const scenario = toScenario(customRates, emptyLL84)
    expect(scenario.utility_rates).toBeDefined()
    expect(scenario.utility_rates!.elec).toBe(0.12)
  })

  it('omits ll84 when not loaded', () => {
    const scenario = toScenario(baseInputs, emptyLL84)
    expect(scenario.ll84).toBeUndefined()
  })

  it('includes ll84 provenance when loaded', () => {
    const ll84State = {
      ...emptyLL84,
      is_ll84_loaded: true,
      ll84_selected_property: {
        nyc_bbl: '1-00072-7201',
        property_id: '1234',
        property_name: 'Test Building',
      } as any,
      ll84_year_selection: 'll84_2025_cal_2024' as any,
      ll84_year_label: 'LL84 2025',
    }
    const scenario = toScenario(baseInputs, ll84State)
    expect(scenario.ll84?.bbl).toBe('1-00072-7201')
    expect(scenario.ll84?.building_name).toBe('Test Building')
  })
})

describe('fromScenario', () => {
  it('round-trips through toScenario → fromScenario', () => {
    const scenario = toScenario(baseInputs, emptyLL84)
    const { inputs } = fromScenario(scenario)
    expect(inputs.building_types[0].building_type).toBe('Office')
    expect(inputs.utilities.elec.consumption).toBe(1200000)
    expect(inputs.electric_onsite_generation.photovoltaic.consumption).toBe(10000)
  })

  it('sets is_default_rates: true when utility_rates absent', () => {
    const scenario = toScenario(baseInputs, emptyLL84)
    const { inputs } = fromScenario(scenario)
    expect(inputs.is_default_rates).toBe(true)
  })

  it('sets is_default_rates: false when utility_rates present', () => {
    const withRates = { ...toScenario(baseInputs, emptyLL84), utility_rates: { elec: 0.15, gas: 2, steam: 35, fuel_two: 4, fuel_four: 3.5 } }
    const { inputs } = fromScenario(withRates)
    expect(inputs.is_default_rates).toBe(false)
    expect(inputs.utilities.elec.rate).toBe(0.15)
  })

  it('maps elec_onsite_gen_kwh to electric_onsite_generation.photovoltaic.consumption', () => {
    const scenario = toScenario(baseInputs, emptyLL84)
    const { inputs } = fromScenario(scenario)
    expect(inputs.electric_onsite_generation.photovoltaic.consumption).toBe(10000)
  })

  it('populates ll84Meta from scenario.ll84', () => {
    const ll84State = {
      ...emptyLL84,
      is_ll84_loaded: true,
      ll84_selected_property: { nyc_bbl: '1-00072-7201', property_id: '1234', property_name: 'Test Building' } as any,
      ll84_year_selection: 'll84_2025_cal_2024' as any,
      ll84_year_label: 'LL84 2025',
    }
    const scenario = toScenario(baseInputs, ll84State)
    const { ll84Meta } = fromScenario(scenario)
    expect(ll84Meta.is_ll84_loaded).toBe(true)
    expect(ll84Meta.ll84_building_name).toBe('Test Building')
    expect(ll84Meta.ll84_year_selection).toBe('ll84_2025_cal_2024')
  })
})
