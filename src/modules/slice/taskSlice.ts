import {
  createAction,
  createEntityAdapter,
  createSlice,
  Dictionary,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import _ from "lodash";
import { Task, UninitTask } from "../../lib/gapi";
import { allRelates } from "../../lib/taskView/ops";
import { TaskView } from "../../lib/taskView/TaskView";
import { notUndef } from "../../lib/typeGuards";

export const tasksAdaptor = createEntityAdapter<Task>({
  selectId: (t) => t.id,
  sortComparer: (a, b) =>
    a.position && b.position ? parseInt(a.position) - parseInt(b.position) : 0,
});

type State = EntityState<Task>;

export type UpdatePayload = { task: Task; taskId: string; listId: string };

const initialState: State = tasksAdaptor.getInitialState();

let moveCount = 0;

const findMinPosition = (tasks: Dictionary<Task>) =>
  _.sortBy(Object.values(tasks), (t) =>
    t && t.position ? parseInt(t.position) : 0
  )[0]?.position;

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    deleteTask: (s, t: PayloadAction<Task>) =>
      tasksAdaptor.removeOne(s, t.payload.id),
    updateTask: (s, t: PayloadAction<UpdatePayload>) =>
      tasksAdaptor.updateOne(s, {
        id: t.payload.taskId,
        changes: t.payload.task,
      }),
    completeTask: (s, t: PayloadAction<TaskView>) =>
      tasksAdaptor.removeMany(
        s,
        allRelates(t.payload).map((a) => a.id)
      ),
    addTask: tasksAdaptor.addOne,
    addTaskToTop: (s, a: PayloadAction<Task>) => {
      const minPosition = findMinPosition(s.entities);

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
    moveTask: (
      s,
      {
        payload: { task, previous },
      }: PayloadAction<{ task: Task; previous?: string }>
    ) => {
      const position = previous && s.entities[previous]?.position;
      const minPos = findMinPosition(s.entities);

      tasksAdaptor.updateOne(s, {
        id: task.id,
        changes: {
          position: position
            ? (Number(position) + 0.1 - moveCount * 0.001).toString()
            : ((notUndef(minPos) ? Number(minPos) : 0) - 1).toString(),
        },
      });

      moveCount = moveCount + 1;
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
