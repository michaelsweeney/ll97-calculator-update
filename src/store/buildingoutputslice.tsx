import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { BuildingOutputSliceTypes } from 'types'

const initialState = {} as BuildingOutputSliceTypes

export const buildingOutputSlice = createSlice({
  name: 'building_outputs',
  initialState: initialState,
  reducers: {
    setBuildingOutputs: (state, action: PayloadAction<BuildingOutputSliceTypes>) => {
      return action.payload
    },
  },
})

export const buildingOutputActions = buildingOutputSlice.actions

export default buildingOutputSlice.reducer
