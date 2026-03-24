import type { BuildingInputTypes, BuildingType, LL84QuerySliceTypes } from 'types'
import type { BuildingScenario, LL84Provenance } from '../shared/types'
import { default_utility_rates } from 'locallaw/lookups'

export function toScenario(
  inputs: BuildingInputTypes,
  ll84Slice: LL84QuerySliceTypes
): BuildingScenario {
  const scenario: BuildingScenario = {
    v: 1,
    building_uses: inputs.building_types.map(bt => ({
      building_type: bt.building_type,
      building_area: bt.building_area,
    })),
    utilities: {
      elec_kwh: inputs.utilities.elec.consumption,
      gas_therms: inputs.utilities.gas.consumption,
      steam_mlbs: inputs.utilities.steam.consumption,
      fuel_two_gal: inputs.utilities.fuel_two.consumption,
      fuel_four_gal: inputs.utilities.fuel_four.consumption,
      elec_onsite_gen_kwh: inputs.electric_onsite_generation.photovoltaic.consumption,
    },
  }

  if (!inputs.is_default_rates) {
    scenario.utility_rates = {
      elec: inputs.utilities.elec.rate,
      gas: inputs.utilities.gas.rate,
      steam: inputs.utilities.steam.rate,
      fuel_two: inputs.utilities.fuel_two.rate,
      fuel_four: inputs.utilities.fuel_four.rate,
    }
  }

  if (ll84Slice.is_ll84_loaded) {
    const prop = ll84Slice.ll84_selected_property
    scenario.ll84 = {
      bbl: prop.nyc_bbl,
      property_id: prop.property_id,
      year: ll84Slice.ll84_year_selection,
      building_name: prop.property_name,
      year_label: ll84Slice.ll84_year_label ?? '',
    }
  }

  return scenario
}

export function fromScenario(scenario: BuildingScenario): {
  inputs: BuildingInputTypes
  ll84Meta: Partial<LL84QuerySliceTypes>
} {
  const rates = scenario.utility_rates ?? {
    elec: default_utility_rates.elec,
    gas: default_utility_rates.gas,
    steam: default_utility_rates.steam,
    fuel_two: default_utility_rates.fuel_two,
    fuel_four: default_utility_rates.fuel_four,
  }

  const building_types: BuildingType[] = scenario.building_uses.map((use, i) => ({
    building_id: i,
    building_type: use.building_type,
    building_area: use.building_area,
  }))

  const inputs: BuildingInputTypes = {
    building_types,
    utilities: {
      elec: { consumption: scenario.utilities.elec_kwh, rate: rates.elec },
      gas: { consumption: scenario.utilities.gas_therms, rate: rates.gas },
      steam: { consumption: scenario.utilities.steam_mlbs, rate: rates.steam },
      fuel_two: { consumption: scenario.utilities.fuel_two_gal, rate: rates.fuel_two },
      fuel_four: { consumption: scenario.utilities.fuel_four_gal, rate: rates.fuel_four },
    },
    electric_onsite_generation: {
      photovoltaic: { consumption: scenario.utilities.elec_onsite_gen_kwh },
    },
    is_default_rates: !scenario.utility_rates,
  }

  const ll84Meta: Partial<LL84QuerySliceTypes> = {}
  if (scenario.ll84) {
    ll84Meta.is_ll84_loaded = true
    ll84Meta.ll84_building_name = scenario.ll84.building_name
    ll84Meta.ll84_year_label = scenario.ll84.year_label
    ll84Meta.ll84_year_selection = scenario.ll84.year as LL84QuerySliceTypes['ll84_year_selection']
  }

  return { inputs, ll84Meta }
}
