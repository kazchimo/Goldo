import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type State = "dark" | "light";

const slice = createSlice({
  name: "theme",
  initialState: "light" as State,
  reducers: {
    toLightTheme: () => "light" as State,
    toDarkTheme: () => "dark" as State,
    setTheme: (s, a: PayloadAction<State>) => a.payload,
  },
});

const restoreTheme = createAction("restoreTheme");

export const themeActions = { ...slice.actions, restoreTheme };

export const themeReducer = slice.reducer;
