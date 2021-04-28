import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "loading",
  initialState: {
    loadingTaskCount: 0,
  },
  reducers: {
    onLoading: (s) => ({ ...s, loadingTaskCount: s.loadingTaskCount + 1 }),
    offLoading: (s) => ({ ...s, loadingTaskCount: s.loadingTaskCount - 1 }),
  },
});

export const loadingActions = slice.actions;

export const loadingReducers = slice.reducer;
