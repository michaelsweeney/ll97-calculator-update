import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { default_utility_rates } from 'locallaw/lookups'
import type * as types from 'types'
import type { BuildingInputTypes } from 'types'

const initialState: BuildingInputTypes = {
  building_types: [
    {
      building_id: 0,
      building_type: 'Office',
      building_area: 0,
    },
  ],
  utilities: {
    elec: {
      consumption: 0,
      rate: default_utility_rates.elec,
    },
    gas: {
      consumption: 0,
      rate: default_utility_rates.gas,
    },
    steam: {
      consumption: 0,
      rate: default_utility_rates.steam,
    },
    fuel_two: {
      consumption: 0,
      rate: default_utility_rates.fuel_two,
    },
    fuel_four: {
      consumption: 0,
      rate: default_utility_rates.fuel_four,
    },
  },
  electric_onsite_generation: {
    photovoltaic: {
      consumption: 0,
    },
  },
  is_default_rates: true,
}

export const buildingInputSlice = createSlice({
  name: 'building_inputs',
  initialState: initialState,
  reducers: {
    setBuildingType: (state, action: PayloadAction<{ id: number; value: string }>) => {
      let { id, value } = action.payload
      let { building_types } = state
      let to_change = building_types.find(d => d.building_id === id)
      if (to_change) {
        to_change.building_type = value
      }
    },

    setBuildingArea: (state, action: PayloadAction<{ id: number; value: number }>) => {
      let { id, value } = action.payload
      let { building_types } = state
      let to_change = building_types.find(d => d.building_id === id)
      if (to_change) {
        to_change.building_area = value
      }
    },

    setFuelConsumption: (state, action: PayloadAction<{ fuel: string; value: number }>) => {
      let { fuel, value } = action.payload
      //@ts-ignore
      state.utilities[fuel].consumption = value
    },

    setFuelRate: (state, action: PayloadAction<{ fuel: string; value: number }>) => {
      let { fuel, value } = action.payload
      //@ts-ignore
      state.utilities[fuel].rate = value
    },

    removeBuildingType: (state, action: PayloadAction<{ id: number }>) => {
      let { id } = action.payload
      state.building_types = state.building_types.filter(d => d.building_id !== id)
    },

    addBuildingType: (state, action: PayloadAction<{}>) => {
      let building_ids = [...new Set(state.building_types.map(d => d.building_id))]
      let new_id = Math.max(...building_ids) + 1

      let type_to_copy = { ...state.building_types[0], building_id: new_id }
      type_to_copy.building_area = 0

      state.building_types.push(type_to_copy)
    },

    setIsDefaultRates: (state, action: PayloadAction<{ is_default_rates: boolean }>) => {
      let { is_default_rates } = action.payload
      state.is_default_rates = is_default_rates

      if (is_default_rates) {
        state.utilities.elec.rate = default_utility_rates.elec
        state.utilities.steam.rate = default_utility_rates.steam
        state.utilities.gas.rate = default_utility_rates.gas
        state.utilities.fuel_two.rate = default_utility_rates.fuel_two
        state.utilities.fuel_four.rate = default_utility_rates.fuel_four
      }
    },

    setElectricOnsitePVConsumptionChange: (state, action: PayloadAction<number>) => {
      state.electric_onsite_generation.photovoltaic.consumption = action.payload
    },

    setBuildingInputsFromLL84Results: (state, action: PayloadAction<types.LL97ConversionTypes>) => {
      let ll97_inputs = action.payload

      let new_building_types: types.BuildingType[] = []

      if (ll97_inputs.bldg_type_one_type !== 'Not Available') {
        let t1: types.BuildingType = {
          building_id: 0,
          building_type: ll97_inputs.bldg_type_one_type,
          building_area: ll97_inputs.bldg_type_one_area,
        }
        new_building_types.push(t1)
      }
      if (ll97_inputs.bldg_type_two_type !== 'Not Available') {
        let t2: types.BuildingType = {
          building_id: 1,
          building_type: ll97_inputs.bldg_type_two_type,
          building_area: ll97_inputs.bldg_type_two_area,
        }
        new_building_types.push(t2)
      }
      if (ll97_inputs.bldg_type_three_type !== 'Not Available') {
        let t3: types.BuildingType = {
          building_id: 2,
          building_type: ll97_inputs.bldg_type_three_type,
          building_area: ll97_inputs.bldg_type_three_area,
        }
        new_building_types.push(t3)
      }

      let new_state: BuildingInputTypes = {
        building_types: new_building_types,
        utilities: {
          elec: {
            consumption: ll97_inputs.elec_kwh,
            rate: state.utilities.elec.rate,
          },
          steam: {
            consumption: ll97_inputs.steam_mlbs,
            rate: state.utilities.steam.rate,
          },
          gas: {
            consumption: ll97_inputs.gas_therms,
            rate: state.utilities.gas.rate,
          },
          fuel_four: {
            consumption: ll97_inputs.fuel_four_gal,
            rate: state.utilities.fuel_four.rate,
          },
          fuel_two: {
            consumption: ll97_inputs.fuel_two_gal,
            rate: state.utilities.fuel_two.rate,
          },
        },
        electric_onsite_generation: {
          photovoltaic: {
            consumption: ll97_inputs.elec_onsite_gen_kwh,
          },
        },
        is_default_rates: state.is_default_rates,
      }

      return new_state
    },
  },
})

export const buildingInputActions = buildingInputSlice.actions

export default buildingInputSlice.reducer
