import {
  createAction,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Task, UninitTask } from "../../lib/gapi";
import { allRelates } from "../../lib/taskView/ops";
import { TaskView } from "../../lib/taskView/TaskView";

export const tasksAdaptor = createEntityAdapter<Task>({
  selectId: (t) => t.id,
  sortComparer: (a, b) =>
    a.listId !== b.listId
      ? a.listId.localeCompare(b.listId)
      : a.position
      ? b.position
        ? a.position.localeCompare(b.position)
        : -1
      : 1,
});

type State = EntityState<Task>;

const initialState: State = tasksAdaptor.getInitialState();

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    deleteTask: (s, t: PayloadAction<Task>) =>
      tasksAdaptor.removeOne(s, t.payload.id),
    updateTask: (s, t: PayloadAction<Task>) =>
      tasksAdaptor.updateOne(s, { id: t.payload.id, changes: t.payload }),
    completeTask: (s, t: PayloadAction<TaskView>) =>
      tasksAdaptor.removeMany(
        s,
        allRelates(t.payload).map((a) => a.id)
      ),
    addTask: tasksAdaptor.addOne,
    addTasks: tasksAdaptor.addMany,
  },
});

const fetchTasks = createAction<string>("fetchTasks");
const createTask = createAction<{ task: UninitTask; previous?: string }>(
  "createTask"
);

const tasksActions = {
  ...taskSlice.actions,
  fetchTasks,
  createTask,
};

const tasksReducer = taskSlice.reducer;

export { tasksActions, tasksReducer };
