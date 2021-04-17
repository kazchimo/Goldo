import {
  createAction,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import _ from "lodash";
import { hasId, Task, UninitTask } from "../../lib/gapi";
import { allRelates } from "../../lib/taskView/ops";
import { TaskView } from "../../lib/taskView/TaskView";

export const tasksAdaptor = createEntityAdapter<Task>({
  selectId: (t) => t.id,
  sortComparer: (a, b) =>
    a.position && b.position ? parseInt(a.position) - parseInt(b.position) : 0,
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
    addTaskToTop: (s, a: PayloadAction<Task>) => {
      const minPosition = _.sortBy(Object.values(s.entities), (t) =>
        t && t.position ? parseInt(t.position) : 0
      )[0]?.position;

      const newPosition = minPosition
        ? (parseInt(minPosition) - 1).toString()
        : "0";

      tasksAdaptor.addOne(s, {
        ...a.payload,
        position: newPosition,
      });
    },
    addTasks: (s, a: PayloadAction<Task[]>) => {
      const listIds = _.uniq(a.payload.map((t) => t.listId));

      tasksAdaptor.removeMany(
        s,
        Object.values(s.entities)
          .filter((t) => t && listIds.includes(t.listId))
          .map((t) => t!.id)
      );
      tasksAdaptor.addMany(s, a);
    },
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
