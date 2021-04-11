import { Task } from "../gapi";

export type TaskView = {
  children: TaskView[];
} & Task;

export type ChildTaskView = TaskView & { parent: string };
