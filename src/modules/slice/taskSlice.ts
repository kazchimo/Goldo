import {
  createAction,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import _ from "lodash";
import { Task, UninitTask } from "../../lib/gapi";
import { deepRemove, deepTaskSort, insertTask } from "../../lib/taskView/ops";
import { TaskView } from "../../lib/taskView/TaskView";
import { notUndef } from "../../lib/typeGuards";

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
    updateTask: (s, a: PayloadAction<TaskView>) => ({
      ...s,
      tasksByListId: {
        ...s.tasksByListId,
        [a.payload.listId]: deepTaskSort([
          a.payload,
          ..._.get(s.tasksByListId, a.payload.listId, []).filter(
            (t) => t.id !== a.payload.id
          ),
        ]),
      },
    }),
    completeTask: (
      s,
      a: PayloadAction<{ taskId: string; taskListId: string }>
    ) => ({
      ...s,
      tasksByListId: {
        ...s.tasksByListId,
        [a.payload.taskListId]: _.get(s.tasksByListId, a.payload.taskListId, [])
          .map((t: TaskView) => deepRemove(a.payload.taskId, t))
          .filter(notUndef),
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
const createTask = createAction<{ task: UninitTask }>("createTask");

const tasksActions = {
  ...taskSlice.actions,
  fetchTasks,
  createTask,
};

const tasksReducer = taskSlice.reducer;

export { tasksActions, tasksReducer };
