import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../../lib/gapi";

type State = {
  openTasks: {
    [listId: string]: string[];
  };
  sideBarOpen: boolean;
  defaultListId?: string;
};

const initialState: State = {
  openTasks: {},
  sideBarOpen: false,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setDefaultListId: (s, a: PayloadAction<string | undefined>) => ({
      ...s,
      defaultListId: a.payload,
    }),
    openSidebar: (s) => ({ ...s, sideBarOpen: true }),
    closeSidebar: (s) => ({ ...s, sideBarOpen: false }),
    invertOpenTask: (s, { payload: { id, listId } }: PayloadAction<Task>) => {
      const ids = s.openTasks[listId] || [];
      const opened = ids.includes(id);

      return {
        ...s,
        openTasks: {
          ...s.openTasks,
          [listId]: opened ? ids.filter((idd) => idd !== id) : [...ids, id],
        },
      };
    },
  },
});

export const appActions = slice.actions;

export const appReducer = slice.reducer;
