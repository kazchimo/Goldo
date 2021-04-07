import { createAction, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "gapi",
  initialState: {
    gapiLoaded: false,
  },
  reducers: {
    successLoadGapi: (s) => ({ ...s, gapiLoaded: true }),
  },
});

const loadGapi = createAction("loadGapi");

export const gapiActions = { ...slice.actions, loadGapi };

export const gapiReducers = slice.reducer;
