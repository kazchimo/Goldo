import {
  createAction,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import _ from "lodash";
import { Task } from "../../lib/gapi";

export type TaskView = {
  children: TaskView[];
} & Task;

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

const hasParent = (t: TaskView): t is TaskView & { parent: string } =>
  !!t.parent;

const mergeTask = (
  child: TaskView & { parent: string },
  parent: TaskView
): { result: TaskView; changed: boolean } => {
  if (parent.id === child.parent) {
    return {
      result: {
        ...parent,
        children: [child, ...parent.children],
      },
      changed: true,
    };
  } else {
    for (const t of parent.children) {
      const { result, changed } = mergeTask(child, t);
      if (changed) {
        return {
          result: {
            ...parent,
            children: [
              result,
              ...parent.children.filter((tt) => tt.id !== result.id),
            ],
          },
          changed: true,
        };
      }
    }

    return {
      result: parent,
      changed: false,
    };
  }
};

const insertTask = (children: TaskView[], tasks: TaskView[]): TaskView[] => {
  let remains = _.cloneDeep([...tasks, ...children].filter((t) => t.parent));
  let updated = _.cloneDeep([...tasks, ...children].filter((t) => !t.parent));

  while (true) {
    console.log(remains);
    console.log(updated);
    if (remains.length === 0) {
      return updated;
    } else {
      const child = remains.pop();

      if (child && hasParent(child)) {
        let merged = false;
        for (const t of updated) {
          const { result, changed } = mergeTask(child, t);
          if (changed) {
            updated = [result, ...updated.filter((t) => t.id !== result.id)];
            merged = true;
            break;
          }
        }

        if (!merged) {
          remains = [child, ...remains];
        } else {
          return updated;
        }
      }
    }
  }
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addMany: taskAdapter.addMany,
    add: taskAdapter.addOne,
    addTaskOnListId: (
      s: State,
      p: PayloadAction<{ task: Task; listId: string }>
    ) => {
      return {
        ...s,
        tasksByListId: {
          ...s.tasksByListId,
          [p.payload.listId]: insertTask(
            [{ ...p.payload.task, children: [] }],
            _.get(s.tasksByListId, p.payload.listId, [])
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
        [p.payload.listId]: insertTask(
          p.payload.tasks.map((t) => ({ ...t, children: [] })),
          _.get(s.tasksByListId, p.payload.listId, [])
        ),
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
