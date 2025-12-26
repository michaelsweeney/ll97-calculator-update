import type { BuildingInputTypes, BuildingOutputSliceTypes, ResultsPeriodType } from 'types'
import {
  building_type_co2_coefficients,
  fine_per_ton_co2,
  ll97_current_elec_coefficients,
  non_electric_tons_per_kbtu_coefficients,
  yearToYearRangeString,
} from './lookups'

const LL97OutputsFromBuildingInputs = (ll97_in: BuildingInputTypes) => {
  let { building_types, utilities, electric_onsite_generation } = ll97_in

  let total_area = 0
  let co2limit_2024 = 0
  let co2limit_2030 = 0
  let co2limit_2035 = 0
  let co2limit_2040 = 0
  let co2limit_2050 = 0

  building_types.forEach(type => {
    let coefficients = building_type_co2_coefficients.find(
      t => t.building_type === type.building_type
    ) as (typeof building_type_co2_coefficients)[0]

    let limit_2024 = coefficients['2024-2029'] * +type.building_area
    let limit_2030 = coefficients['2030-2034'] * +type.building_area
    let limit_2035 = coefficients['2035-2039'] * +type.building_area
    let limit_2040 = coefficients['2040-2049'] * +type.building_area
    let limit_2050 = coefficients['2050-'] * +type.building_area

    co2limit_2024 = co2limit_2024 + limit_2024
    co2limit_2030 = co2limit_2030 + limit_2030
    co2limit_2035 = co2limit_2035 + limit_2035
    co2limit_2040 = co2limit_2040 + limit_2040
    co2limit_2050 = co2limit_2050 + limit_2050

    total_area = total_area + +type.building_area
  })

  let elec_native =
    +utilities.elec.consumption - +electric_onsite_generation.photovoltaic.consumption

  let gas_native = +utilities.gas.consumption
  let steam_native = +utilities.steam.consumption
  let fuel_two_native = +utilities.fuel_two.consumption
  let fuel_four_native = +utilities.fuel_four.consumption

  let elec_kbtu = elec_native * 3.412
  let gas_kbtu = +utilities.gas.consumption * 100
  let steam_kbtu = +utilities.steam.consumption * 1194
  let fuel_two_kbtu = +utilities.fuel_two.consumption * 138
  let fuel_four_kbtu = +utilities.fuel_four.consumption * 146
  let total_kbtu = elec_kbtu + gas_kbtu + steam_kbtu + fuel_two_kbtu + fuel_four_kbtu

  let elec_cost = elec_native * utilities.elec.rate
  let gas_cost = +utilities.gas.consumption * +utilities.gas.rate
  let steam_cost = +utilities.steam.consumption * +utilities.steam.rate
  let fuel_two_cost = +utilities.fuel_two.consumption * +utilities.fuel_two.rate
  let fuel_four_cost = +utilities.fuel_four.consumption * +utilities.fuel_four.rate

  let total_cost = elec_cost + gas_cost + steam_cost + fuel_two_cost + fuel_four_cost

  let annual_results_summary = [] as ResultsPeriodType[]

  ll97_current_elec_coefficients.forEach(yobj => {
    let { year, value } = yobj

    let elec_tons = elec_kbtu * value

    let gas_tons = gas_kbtu * non_electric_tons_per_kbtu_coefficients.gas

    let steam_coefficient =
      year < 2030
        ? non_electric_tons_per_kbtu_coefficients.steam_2024_2029
        : non_electric_tons_per_kbtu_coefficients.steam_2030_2050
    let steam_tons = steam_kbtu * steam_coefficient

    let fuel_two_tons = fuel_two_kbtu * non_electric_tons_per_kbtu_coefficients.fuel_two
    let fuel_four_tons = fuel_four_kbtu * non_electric_tons_per_kbtu_coefficients.fuel_four

    let threshold = null

    let carbon_tons_total = elec_tons + gas_tons + steam_tons + fuel_two_tons + fuel_four_tons

    if (year <= 2023) {
      threshold = null
    } else if (year <= 2029) {
      threshold = co2limit_2024
    } else if (year <= 2034) {
      threshold = co2limit_2030
    } else if (year <= 2039) {
      threshold = co2limit_2035
    } else if (year <= 2049) {
      threshold = co2limit_2040
    } else if (year === 2050) {
      threshold = co2limit_2050
    }

    let excess_carbon
    if (threshold !== null) {
      excess_carbon = Math.max(carbon_tons_total - threshold, 0)
    } else {
      excess_carbon = 0
    }

    let fine_absolute = excess_carbon * fine_per_ton_co2

    annual_results_summary.push({
      period: yearToYearRangeString(year),
      year: year,
      threshold: {
        absolute: threshold,
        per_sf:
          threshold === 0 ? threshold / total_area : threshold ? threshold / total_area : null,
      },
      is_fine: fine_absolute > 0,
      fine: {
        absolute: fine_absolute,
        per_sf: fine_absolute / total_area,
      },
      utility_cost: {
        absolute: {
          elec: elec_cost,
          gas: gas_cost,
          steam: steam_cost,
          fuel_two: fuel_two_cost,
          fuel_four: fuel_four_cost,
          total: total_cost,
        },
        per_sf: {
          elec: elec_cost / total_area,
          gas: gas_cost / total_area,
          steam: steam_cost / total_area,
          fuel_two: fuel_two_cost / total_area,
          fuel_four: fuel_four_cost / total_area,
          total: total_cost / total_area,
        },
      },
      carbon: {
        absolute: {
          elec: elec_tons,
          gas: gas_tons,
          steam: steam_tons,
          fuel_two: fuel_two_tons,
          fuel_four: fuel_four_tons,
          total: carbon_tons_total,
        },
        per_sf: {
          elec: elec_tons / total_area,
          gas: gas_tons / total_area,
          steam: steam_tons / total_area,
          fuel_two: fuel_two_tons / total_area,
          fuel_four: fuel_four_tons / total_area,
          total: carbon_tons_total / total_area,
        },
      },
      excess_carbon: {
        absolute: excess_carbon,
        per_sf: excess_carbon / total_area,
      },
      site_energy: {
        absolute: {
          elec: elec_kbtu,
          gas: gas_kbtu,
          steam: steam_kbtu,
          fuel_two: fuel_two_kbtu,
          fuel_four: fuel_four_kbtu,
          total: total_kbtu,
        },
        per_sf: {
          elec: elec_kbtu / total_area,
          gas: gas_kbtu / total_area,
          steam: steam_kbtu / total_area,
          fuel_two: fuel_two_kbtu / total_area,
          fuel_four: fuel_four_kbtu / total_area,
          total: total_kbtu / total_area,
        },
      },
      native_energy: {
        absolute: {
          elec: elec_native,
          gas: gas_native,
          steam: steam_native,
          fuel_two: fuel_two_native,
          fuel_four: fuel_four_native,
        },
        per_sf: {
          elec: elec_native / total_area,
          gas: gas_native / total_area,
          steam: steam_native / total_area,
          fuel_two: fuel_two_native / total_area,
          fuel_four: fuel_four_native / total_area,
        },
      },
    })
  })

  let is_greater_than_25k_sf: boolean = total_area > 25e3 ? true : false

  let is_input_info_missing = total_area === 0 || total_cost === 0 || total_kbtu === 0

  let ll97_output_obj: BuildingOutputSliceTypes = {
    is_greater_than_25k_sf: is_greater_than_25k_sf,
    is_input_info_missing: is_input_info_missing,
    total_area: total_area,

    co2limit_2024_thru_2029: co2limit_2024,
    co2limit_2030_thru_2034: co2limit_2030,
    co2limit_2035_thru_2039: co2limit_2035,
    co2limit_2040_thru_2049: co2limit_2040,
    co2limit_2050: co2limit_2050,
    annual_result_array: annual_results_summary,
  }

  return ll97_output_obj
}

export { LL97OutputsFromBuildingInputs }
