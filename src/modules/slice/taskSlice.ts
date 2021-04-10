import {
  createAction,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Task } from "../../lib/gapi";

export const taskAdapter = createEntityAdapter<Task>({
  selectId: (t) => {
    if (t.id) {
      return t.id;
    } else {
      throw new Error("Task id is not defined.");
    }
  },
});

type State = {
  tasksByListId: {
    [key: string]: Task[];
  };
} & EntityState<Task>;

const initialState: State = {
  tasksByListId: {},
  ...taskAdapter.getInitialState(),
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addMany: taskAdapter.addMany,
    add: taskAdapter.addOne,
    addTasksOnListId: (
      s: State,
      p: PayloadAction<{ tasks: Task[]; listId: string }>
    ) => ({
      ...s,
      tasksByListId: {
        ...s.tasksByListId,
        [p.payload.listId]: p.payload.tasks,
      },
    }),
  },
});

const fetchTasks = createAction<string>("fetchTasks");
const createTask = createAction<{ taskListId: string; task: Task }>(
  "createTask"
);

const tasksActions = { ...taskSlice.actions, fetchTasks, createTask };

const tasksReducer = taskSlice.reducer;

export { tasksActions, tasksReducer };
