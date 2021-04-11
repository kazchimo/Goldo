import { db } from "../db/db";

type HasId<T extends { id?: string }> = T & { id: string };

export type GResponse<T> = gapi.client.Response<T>;

export type TaskLists = gapi.client.tasks.TaskLists;

export type TaskList = HasId<gapi.client.tasks.TaskList>;

export type Tasks = gapi.client.tasks.Tasks;

export type Task = HasId<gapi.client.tasks.Task>;

export type UninitTask = gapi.client.tasks.Task;

export const hasId = <T extends { id?: string }>(task: T): task is HasId<T> =>
  !!task.id;

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
