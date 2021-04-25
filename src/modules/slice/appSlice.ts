import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Lens } from "monocle-ts";
import { Task } from "../../lib/gapi";
import { taskListActions } from "./taskListSlice";
import { tasksActions } from "./taskSlice";

type State = {
  fetchTaskListsCount?: number;
  fetchTasksCount?: number;
  openTasks: {
    [listId: string]: string[];
  };
};

const initialState: State = {
  openTasks: {},
};

const fetchTaskListsCountLens = Lens.fromPath<State>()(["fetchTaskListsCount"]);

const fetchTasksCountLens = Lens.fromPath<State>()(["fetchTasksCount"]);

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetInitialLoading: (s) => ({
      ...s,
      fetchTaskListsCount: undefined,
      fetchTasksCount: undefined,
    }),
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
  extraReducers: {
    [tasksActions.addTasks.type]: (s) =>
      fetchTasksCountLens.modify((s) => (s || 0) + 1)(s),
    [taskListActions.successFetchTaskLists.type]: (s, a) =>
      fetchTaskListsCountLens.modify((s) => (s || 0) + a.payload.length)(s),
  },
});

export const appActions = slice.actions;

export const appReducer = slice.reducer;
