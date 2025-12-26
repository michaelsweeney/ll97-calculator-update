import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { UiSliceTypes, ViewTypes, WindowDimensionTypes, WindowSizeTypes } from 'types'

const initialState: UiSliceTypes = {
  is_dev_mode: false,
  current_view: 'calc_info_dialogue',
  window_dimensions: {
    width: 0,
    height: 0,
  },
  window_size: 'medium',
  small_window: false,
  chart_view: {
    view_type: 'carbon',
    unit_type: 'absolute',
    stack_type: 'summary',
  },
}

export const uiSlice = createSlice({
  name: 'ui_slice',
  initialState: initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<ViewTypes>) => {
      state.current_view = action.payload
    },

    setWindowDimensions: (state, action: PayloadAction<WindowDimensionTypes>) => {
      state.window_dimensions = action.payload
    },
    setSmallWindow: (state, action: PayloadAction<boolean>) => {
      state.small_window = action.payload
    },
    setWindowSize: (state, action: PayloadAction<WindowSizeTypes>) => {
      state.window_size = action.payload
    },
    setChartView: (state, action: PayloadAction<{ view_key: string; view_value: string }>) => {
      const { view_key, view_value } = action.payload
      //@ts-ignore
      state.chart_view[view_key] = view_value
    },
  },
})

export const uiActions = uiSlice.actions

export default uiSlice.reducer
