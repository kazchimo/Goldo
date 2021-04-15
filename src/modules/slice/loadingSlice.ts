import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "loading",
  initialState: false,
  reducers: {
    onLoading: () => true,
    offLoading: () => false,
  },
});

export const loadingActions = slice.actions;

export const loadingReducers = slice.reducer;
