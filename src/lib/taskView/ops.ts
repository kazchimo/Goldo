import _ from "lodash";
import { Task } from "../gapi";
import { notUndef } from "../typeGuards";
import { taskViewChildrenLens } from "./lens";
import { ChildTaskView, TaskView } from "./TaskView";

export const hasParent = (t: TaskView): t is ChildTaskView => !!t.parent;

export const mergeTask = (
  child: ChildTaskView,
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

export const deepTaskSort = (tasks: TaskView[]): TaskView[] => {
  if (tasks.length === 0) {
    return [];
  } else {
    return _.sortBy(
      tasks.map(taskViewChildrenLens.modify(deepTaskSort)),
      (t) => t.position
    );
  }
};

export const insertTask = (
  children: TaskView[],
  tasks: TaskView[]
): TaskView[] => {
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

export const deepRemove = (
  removeId: string,
  task: TaskView
): TaskView | undefined => {
  if (removeId === task.id) {
    return undefined;
  } else {
    return {
      ...task,
      children: task.children
        .map((t) => deepRemove(removeId, t))
        .filter(notUndef),
    };
  }
};

export const allRelates = (task: TaskView): TaskView[] => [
  task,
  ...task.children.flatMap(allRelates),
];
