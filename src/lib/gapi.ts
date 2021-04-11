import { db } from "../db/db";

export type GResponse<T> = gapi.client.Response<T>;

export type TaskLists = gapi.client.tasks.TaskLists;

export type TaskList = gapi.client.tasks.TaskList;

export type Tasks = gapi.client.tasks.Tasks;

export type Task = gapi.client.tasks.Task & { id: string };

export type UninitTask = gapi.client.tasks.Task;

export const hasId = (task: gapi.client.tasks.Task): task is Task => !!task.id;

export const getClient = () => {
  const token = db.getItem("accessToken");
  if (gapi.client && token) {
    gapi.client.setToken({
      access_token: token,
    });
    return gapi.client;
  }
};

export const taskListHasId = (
  taskList: TaskList
): taskList is TaskList & { id: string } => !!taskList.id;
