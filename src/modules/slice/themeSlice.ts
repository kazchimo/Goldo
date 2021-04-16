import { createAction, createSlice } from "@reduxjs/toolkit";

export type State = "dark" | "light";

const slice = createSlice({
  name: "theme",
  initialState: "light" as State,
  reducers: {
    toLightTheme: () => "light" as State,
    toDarkTheme: () => "dark" as State,
  },
});

const restoreTheme = createAction("restoreTheme");

export const themeActions = { ...slice.actions, restoreTheme };

export const themeReducer = slice.reducer;
