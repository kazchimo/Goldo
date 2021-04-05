import { createAction, createSlice } from "@reduxjs/toolkit";

export type State = {
  clientLoaded: boolean;
};

const initialState: State = {
  clientLoaded: false,
};

const slice = createSlice({
  name: "appSlice",
  reducers: {
    successLoadClient: (s) => ({ ...s, clientLoaded: true }),
  },
  initialState,
});

const loadGapiClient = createAction("loadGapiClient");

const actions = { ...slice.actions, loadGapiClient };
const reducer = slice.reducer;

export { actions, reducer };
