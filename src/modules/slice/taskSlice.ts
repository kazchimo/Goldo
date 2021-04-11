import {
  createAction,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import _ from "lodash";
import { Task } from "../../lib/gapi";
import { deepTaskSort, insertTask } from "../../lib/taskView/ops";
import { TaskView } from "../../lib/taskView/TaskView";

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
    [key: string]: TaskView[];
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
    successCompleteTask: (
      s,
      a: PayloadAction<{ taskId: string; taskListId: string }>
    ) => ({
      ...s,
      tasksByListId: {
        ...s.tasksByListId,
        [a.payload.taskListId]: _.get(
          s.tasksByListId,
          a.payload.taskListId,
          []
        ).filter((t) => t.id !== a.payload.taskId),
      },
    }),
    addTaskOnListId: (
      s: State,
      p: PayloadAction<{ task: Task; listId: string }>
    ) => {
      return {
        ...s,
        tasksByListId: {
          ...s.tasksByListId,
          [p.payload.listId]: deepTaskSort(
            insertTask(
              [{ ...p.payload.task, children: [] }],
              _.get(s.tasksByListId, p.payload.listId, [])
            )
          ),
        },
      };
    },
    addTasksOnListId: (
      s: State,
      p: PayloadAction<{ tasks: Task[]; listId: string }>
    ) => ({
      ...s,
      tasksByListId: {
        ...s.tasksByListId,
        [p.payload.listId]: deepTaskSort(
          insertTask(
            p.payload.tasks.map((t) => ({ ...t, children: [] })),
            _.get(s.tasksByListId, p.payload.listId, [])
          )
        ),
      },
    }),
  },
});

const fetchTasks = createAction<string>("fetchTasks");
const createTask = createAction<{ taskListId: string; task: Task }>(
  "createTask"
);
const completeTask = createAction<{ taskListId: string; task: Task }>(
  "completeTask"
);

const tasksActions = {
  ...taskSlice.actions,
  fetchTasks,
  createTask,
  completeTask,
};

const tasksReducer = taskSlice.reducer;

export { tasksActions, tasksReducer };
