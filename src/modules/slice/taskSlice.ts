import {
  createAction,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import _ from "lodash";
import { Lens } from "monocle-ts";
import { Task } from "../../lib/gapi";

export type TaskView = {
  children: TaskView[];
} & Task;

const taskViewChildrenLens = Lens.fromPath<TaskView>()(["children"]);

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
      result: taskViewChildrenLens.modify((c) => [child, ...c])(parent),
      changed: true,
    };
  } else {
    for (const t of parent.children) {
      const { result, changed } = mergeTask(child, t);
      if (changed) {
        return {
          result: taskViewChildrenLens.modify((c) => [
            result,
            ...c.filter((tt) => tt.id !== result.id),
          ])(parent),
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
        }
      }
    }
  }
};

const deepTaskSort = (tasks: TaskView[]): TaskView[] => {
  if (tasks.length === 0) {
    return [];
  } else {
    return _.sortBy(
      tasks.map(taskViewChildrenLens.modify(deepTaskSort)),
      (t) => t.position
    );
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

const tasksActions = { ...taskSlice.actions, fetchTasks, createTask };

const tasksReducer = taskSlice.reducer;

export { tasksActions, tasksReducer };
