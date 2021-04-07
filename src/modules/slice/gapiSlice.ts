import { createAction, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "gapi",
  initialState: {
    gapiIsInit: false,
  },
  reducers: {
    successInitGapi: (s) => ({ ...s, gapiIsInit: true }),
  },
});

const initGapi = createAction("initGapi");

export const gapiActions = { ...slice.actions, initGapi };

export const gapiReducers = slice.reducer;
