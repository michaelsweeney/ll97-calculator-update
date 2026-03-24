export type UtilityInputs = {
  elec_kwh: number
  gas_therms: number
  steam_mlbs: number
  fuel_two_gal: number
  fuel_four_gal: number
  elec_onsite_gen_kwh: number
}

export type BuildingUse = {
  building_type: string
  building_area: number
}

export type LL84Provenance = {
  bbl: string
  property_id: string
  year: string
  building_name: string
  year_label: string
}

export type BuildingScenario = {
  v: 1
  building_uses: BuildingUse[]
  utilities: UtilityInputs
  utility_rates?: {
    elec: number
    gas: number
    steam: number
    fuel_two: number
    fuel_four: number
  }
  ll84?: LL84Provenance
}

// Output types for src/shared/calculations.ts
export type CalculationResult = {
  year: number
  period: string
  total_emissions_tons: number
  emissions_limit_tons: number | null
  excess_tons: number
  fine_usd: number
  is_compliant: boolean
  utility_cost_usd: number
  total_kbtu: number
}
