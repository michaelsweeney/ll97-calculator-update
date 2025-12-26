import type { LL84QueryPropertyTypes, LL97ConversionTypes } from 'types'

const roundNum = (n: string | number) => {
  if (isNaN(+n)) {
    return 0
  } else {
  }
  return Math.round(+n)
}

const LL84SelectionToLL97Inputs = (ll84obj: LL84QueryPropertyTypes) => {
  let ll97obj = {} as LL97ConversionTypes
  if (ll84obj === undefined) {
    return ll97obj
  } else {
    // destructure ll84 obj
    let ll84_elec_kbtu = ll84obj.electricity_consumption_kbtu
    let ll84_elec_onsite_gen_kbtu = ll84obj.electricity_onsite_generated_kbtu
    let ll84_steam_kbtu = ll84obj.district_steam_consumption_kbtu
    let ll84_gas_kbtu = ll84obj.natural_gas_consumption_kbtu
    let ll84_fuel_two_kbtu = ll84obj.fuel_oil_2_consumption_kbtu
    let ll84_fuel_four_kbtu = ll84obj.fuel_oil_4_consumption_kbtu

    let ll84_bldg_type_one_type = ll84obj['1st_property_use_type']
    let ll84_bldg_type_one_area = ll84obj['1st_property_use_sf']
    let ll84_bldg_type_two_type = ll84obj['2nd_property_use_type']
    let ll84_bldg_type_two_area = ll84obj['2nd_property_use_sf']
    let ll84_bldg_type_three_type = ll84obj['3rd_property_use_type']
    let ll84_bldg_type_three_area = ll84obj['3rd_property_use_sf']

    // convert to building input // ll97-focused inputs
    let elec_kwh = roundNum(+ll84_elec_kbtu / 3.412)
    let elec_onsite_gen_kwh = roundNum(+ll84_elec_onsite_gen_kbtu / 3.412)
    let steam_mlbs = roundNum(+ll84_steam_kbtu / 1194)
    let gas_therms = roundNum(+ll84_gas_kbtu / 100)
    let fuel_two_gal = roundNum(+ll84_fuel_two_kbtu / 138)
    let fuel_four_gal = roundNum(+ll84_fuel_four_kbtu / 146)

    let bldg_type_one_type = ll84_bldg_type_one_type
    let bldg_type_two_type = ll84_bldg_type_two_type
    let bldg_type_three_type = ll84_bldg_type_three_type

    let bldg_type_one_area = roundNum(ll84_bldg_type_one_area)
    let bldg_type_two_area = roundNum(ll84_bldg_type_two_area)
    let bldg_type_three_area = roundNum(ll84_bldg_type_three_area)

    ll97obj['bldg_type_one_area'] = bldg_type_one_area
    ll97obj['bldg_type_one_type'] = bldg_type_one_type
    ll97obj['bldg_type_two_area'] = bldg_type_two_area
    ll97obj['bldg_type_two_type'] = bldg_type_two_type
    ll97obj['bldg_type_three_area'] = bldg_type_three_area
    ll97obj['bldg_type_three_type'] = bldg_type_three_type
    ll97obj['elec_kwh'] = elec_kwh
    ll97obj['elec_onsite_gen_kwh'] = elec_onsite_gen_kwh
    ll97obj['steam_mlbs'] = steam_mlbs
    ll97obj['gas_therms'] = gas_therms
    ll97obj['fuel_two_gal'] = fuel_two_gal
    ll97obj['fuel_four_gal'] = fuel_four_gal
  }
  return ll97obj
}

export { LL84SelectionToLL97Inputs }
