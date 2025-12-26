import * as d3 from "d3";
import React from "react";
export type UtilityInputType = {
  consumption: number;
  rate: number;
};

export type UtilityConsumptionAndRateType = {
  elec: UtilityInputType;
  gas: UtilityInputType;
  steam: UtilityInputType;
  fuel_two: UtilityInputType;
  fuel_four: UtilityInputType;
};

export type UtilityConsumptionType = {
  elec: number;
  gas: number;
  steam: number;
  fuel_two: number;
  fuel_four: number;
};

export type ElectricOnsiteGenerationType = {
  photovoltaic: {
    consumption: number;
  };
};

export type BuildingType = {
  building_id: number;
  building_type: string;
  building_area: number;
};

export type BuildingInputTypes = {
  building_types: BuildingType[];
  utilities: UtilityConsumptionAndRateType;
  is_default_rates: boolean;
  electric_onsite_generation: ElectricOnsiteGenerationType;
};

export type PropertyTypeCoefficientsTypes = {
  building_type: string;
  "2024-2029": number;
  "2030-2034": number;
  "2035-2039": number;
  "2040-2049": number;
  "2050-": number;
};

export type CarbonCoefficientTypes =
  | "cambium"
  | "ll97_current"
  | "something_else";

export type LL84YearTypes =
  | "ll84_2025_cal_2024"
  | "ll84_2024_cal_2023"
  | "ll84_2023_cal_2022"
  | "ll84_2022_cal_2021"
  | "ll84_2021_cal_2020"
  | "ll84_2020_cal_2019"
  | "ll84_2019_cal_2018"
  | "ll84_2018_cal_2017";

export type WidthHeightDimensionTypes = {
  width: number;
  height: number;
};

export type WindowDimensionTypes = {
  height: number;
  width: number;
};

export type ChartViewViewType = "cost" | "carbon";
export type ChartViewUnitType = "absolute" | "normalized";
export type ChartViewStackType = "summary" | "enduse";

export type ChartViewTypes = {
  view_type: ChartViewViewType;
  unit_type: ChartViewUnitType;
  stack_type: ChartViewStackType;
};

export type ViewTypes =
  | "load_building_dialogue"
  | "calc_info_dialogue"
  | "building_summary_dialogue"
  | "chart_view";

export type UiSliceTypes = {
  current_view: ViewTypes;
  window_dimensions: WindowDimensionTypes;
  small_window: boolean;
  chart_view: ChartViewTypes;
  is_dev_mode: boolean;
  window_size: WindowSizeTypes;
};

export type LL84QuerySliceTypes = {
  ll84_query_input: string;
  ll84_year_selection: LL84YearTypes;
  ll84_query_results: LL84QueryPropertyTypes[];
  ll84_selected_property: LL84QueryPropertyTypes;
  is_ll84_loaded: boolean;
  has_ll84_summary_been_closed: boolean;
  is_ll84_overridden: boolean;
  ll84_year_label: string | undefined;
  ll84_building_name: string | undefined;
};

export type LL84QueryObjTypes = {
  key: string;
  endpoint: string;
  documentation?: string;
  label: string;
  query_columns: string[];
  column_name_map: ColumnNameMapType;
  title: string;
};

export type ColumnNameMapType = string[][];

export type LL84QueryPropertyTypes = {
  ll84_year: LL84YearTypes;
  property_name: string;
  property_id: string;
  nyc_bbl: string;
  nyc_bin: string;
  address_1: string;
  "1st_property_use_type": string;
  "1st_property_use_sf": string;
  "2nd_property_use_type": string;
  "2nd_property_use_sf": string;
  "3rd_property_use_type": string;
  "3rd_property_use_sf": string;
  fuel_oil_2_consumption_kbtu: string;
  fuel_oil_4_consumption_kbtu: string;
  district_steam_consumption_kbtu: string;
  natural_gas_consumption_kbtu: string;
  electricity_consumption_kbtu: string;
  electricity_onsite_generated_kbtu: string;
  is_other_lookup_error: boolean;
  is_type_lookup_error: boolean;
  type_lookup_error_building_types: string[];
  type_lookup_error_building_ids: number[];
};

export type LL97ConversionTypes = {
  bldg_type_one_area: number;
  bldg_type_one_type: string;
  bldg_type_two_area: number;
  bldg_type_two_type: string;
  bldg_type_three_area: number;
  bldg_type_three_type: string;
  elec_kwh: number;
  elec_onsite_gen_kwh: number;
  steam_mlbs: number;
  gas_therms: number;
  fuel_two_gal: number;
  fuel_four_gal: number;
};

export type YearValueObj = { year: number; value: number };

export type StringObjectType = { [key: string]: string };
export type NumberObjectType = { [key: string]: number };

export type InlineStylesType =
  | React.CSSProperties
  | {
      [key: string]:
        | React.CSSProperties
        | {
            [key: string]:
              | React.CSSProperties
              | {
                  [key: string]: React.CSSProperties;
                };
          };
    };

export type D3WrapperCallbackPropTypes = {
  container_ref: HTMLDivElement;
  container_dimensions: WidthHeightDimensionTypes;
};

export type D3WrapperPropTypes = {
  createChartCallback: (d: D3WrapperCallbackPropTypes) => void;
};

export type YearRangeTypes =
  | "2022-2024"
  | "2024-2029"
  | "2030-2034"
  | "2035-2039"
  | "2040-2049"
  | "2050-";

export type ControlToggleTypes = {
  toggle_key: string;
  label: string;
  options: string[];
  value: string;
};

export type ResultsPeriodFuelTypes = {
  elec: number;
  gas: number;
  steam: number;
  fuel_two: number;
  fuel_four: number;
  total?: number;
};

export type ResultsPeriodType = {
  period: string;
  year: number;
  threshold: {
    absolute: number | null;
    per_sf: number | null;
  };
  is_fine: boolean;
  fine: {
    absolute: number;
    per_sf: number;
  };
  utility_cost: {
    absolute: ResultsPeriodFuelTypes;
    per_sf: ResultsPeriodFuelTypes;
  };
  excess_carbon: {
    absolute: number;
    per_sf: number;
  };
  carbon: {
    absolute: ResultsPeriodFuelTypes;
    per_sf: ResultsPeriodFuelTypes;
  };
  site_energy: {
    absolute: ResultsPeriodFuelTypes;
    per_sf: ResultsPeriodFuelTypes;
  };
  native_energy: {
    absolute: ResultsPeriodFuelTypes;
    per_sf: ResultsPeriodFuelTypes;
  };
};

export type BuildingOutputSliceTypes = {
  is_greater_than_25k_sf: boolean;
  is_input_info_missing: boolean;
  total_area: number;
  co2limit_2024_thru_2029: number;
  co2limit_2030_thru_2034: number;
  co2limit_2035_thru_2039: number;
  co2limit_2040_thru_2049: number;
  co2limit_2050: number;
  annual_result_array: ResultsPeriodType[];
};

export type BarKeyTypes =
  | "elec"
  | "gas"
  | "steam"
  | "fuel_two"
  | "fuel_four"
  | "fine"
  | "total_carbon"
  | "total_cost"
  | "under_carbon"
  | "threshold_carbon"
  | "excess_carbon";

export type CostChartDataTypes = {
  elec: number;
  gas: number;
  steam: number;
  fuel_two: number;
  fuel_four: number;
  total_cost: number;
  fine: number;
  year: number;
  period: YearRangeTypes;
  period_length: number;
  is_fine: boolean;
  stack_keys: BarKeyTypes[];
  threshold_carbon: number | null;
  total_carbon: number;
};

export type CarbonChartDataTypes = {
  elec: number;
  gas: number;
  steam: number;
  fuel_two: number;
  fuel_four: number;
  fine: number;
  threshold_carbon: number | null;
  year: number;
  period: YearRangeTypes;
  period_length: number;
  is_fine: boolean;
  total_carbon: number;
  excess_carbon: number;
  under_carbon: number;
  total_cost: number;
  stack_keys: BarKeyTypes[];
};

export type D3StackType = d3.Series<
  {
    [key: string]: number;
  },
  string
>[];

export type D3SelectionType = d3.Selection<any, any, any, any>;

export type D3ScaleLinearType = d3.ScaleLinear<number, number, never>;

export type WindowSizeTypes = "small" | "medium" | "large";
