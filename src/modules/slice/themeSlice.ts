import { createSlice } from "@reduxjs/toolkit";

type State = "dark" | "light";

const slice = createSlice({
  name: "theme",
  initialState: "light" as State,
  reducers: {
    toLightTheme: () => "light" as State,
    toDarkTheme: () => "dark" as State,
  },
});

export const themeActions = slice.actions;

export const themeReducer = slice.reducer;
