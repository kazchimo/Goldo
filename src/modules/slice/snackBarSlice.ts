import { SnackbarContentProps } from "@material-ui/core/SnackbarContent";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OptionsObject, SnackbarKey, VariantType } from "notistack";

const name = "snackbar";

export type SnackbarState = SnackbarContentProps & {
  options?: OptionsObject;
};

type State = (SnackbarState & { key: SnackbarKey })[];

const initialState: State = [];

const enqueue = (
  state: State,
  action: PayloadAction<SnackbarState>,
  variant: VariantType = "info"
) => [
  ...state,
  {
    key: new Date().getTime() + Math.random(),
    ...action.payload,
    options: { variant },
  },
];

const slice = createSlice({
  name,
  initialState,
  reducers: {
    info: (s, a: PayloadAction<SnackbarState>) => enqueue(s, a, "info"),
    success: (s, a: PayloadAction<SnackbarState>) => enqueue(s, a, "success"),
    enqueueSnackBar: enqueue,
    removeSnackbar: (state, action: PayloadAction<SnackbarKey>) =>
      state.filter((noti) => noti.key !== action.payload),
  },
});

export const snackbarActions = slice.actions;

export const snackbarReducer = slice.reducer;
