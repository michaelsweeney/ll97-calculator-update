import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { getLL84LookupTitle } from 'locallaw/lookups'
import type { LL84QueryPropertyTypes, LL84QuerySliceTypes, LL84YearTypes } from 'types'

const initialState: LL84QuerySliceTypes = {
  ll84_query_input: '',
  ll84_year_selection: 'll84_2025_cal_2024',
  ll84_query_results: [] as LL84QueryPropertyTypes[],
  ll84_selected_property: {} as LL84QueryPropertyTypes,
  is_ll84_loaded: false,
  is_ll84_overridden: false,
  has_ll84_summary_been_closed: false,
  ll84_year_label: undefined,
  ll84_building_name: undefined,
}

export const ll84QuerySlice = createSlice({
  name: 'll84_query_slice',
  initialState: initialState,
  reducers: {
    setLL84QueryInput: (state, action: PayloadAction<string>) => {
      state.ll84_query_input = action.payload
    },
    setLL84YearSelection: (state, action: PayloadAction<LL84YearTypes>) => {
      state.ll84_year_selection = action.payload
    },
    setLL84BuildingName: (state, action: PayloadAction<string | undefined>) => {
      state.ll84_building_name = action.payload
    },
    setLL84YearLabel: (state, action: PayloadAction<string | undefined>) => {
      state.ll84_year_label = action.payload
    },
    setIsLL84Loaded: (state, action: PayloadAction<boolean>) => {
      state.is_ll84_loaded = action.payload
    },
    setIsLL84Overriden: (state, action: PayloadAction<boolean>) => {
      state.is_ll84_overridden = action.payload
      state.ll84_year_label = 'manual user input'
    },
    setLL84QueryResultsResponse: (state, action: PayloadAction<LL84QueryPropertyTypes[]>) => {
      state.ll84_query_results = action.payload
    },
    setSelectedLL84Property: (state, action: PayloadAction<LL84QueryPropertyTypes>) => {
      state.ll84_selected_property = action.payload
      state.is_ll84_loaded = true
      state.is_ll84_overridden = false
      state.ll84_building_name = action.payload.property_name
      state.ll84_year_label = getLL84LookupTitle(action.payload.ll84_year)
    },
    setHasLL84SummaryBeenClosed: (state, action: PayloadAction<boolean>) => {
      state.has_ll84_summary_been_closed = action.payload
    },
  },
})

export const ll84QueryActions = ll84QuerySlice.actions

export default ll84QuerySlice.reducer
