import { configureStore } from "@reduxjs/toolkit";
import type { ThunkAction, Action } from "@reduxjs/toolkit";

import uiSlice from "./uislice";
import buildingInputSlice from "./buildinginputslice";
import buildingOutputSlice from "./buildingoutputslice";
import ll84QuerySlice from "./ll84queryslice";
// ...

export const store = configureStore({
  reducer: {
    building_inputs: buildingInputSlice,
    building_outputs: buildingOutputSlice,
    ui: uiSlice,
    ll84_query: ll84QuerySlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
