import { db } from "../db/db";

export type GResponse<T> = gapi.client.Response<T>;

export type TaskLists = gapi.client.tasks.TaskLists;

export type TaskList = gapi.client.tasks.TaskList;

export type Tasks = gapi.client.tasks.Tasks;

export type Task = gapi.client.tasks.Task;

export const getClient = () => {
  const token = db.getItem("accessToken");
  if (gapi.client && token) {
    gapi.client.setToken({
      access_token: token,
    });
    return gapi.client;
  }
};

export const getTaskLists = () => gapi.client.tasks.tasklists.list();

export const getTasks = (listId: string) =>
  gapi.client.tasks.tasks.list({ tasklist: listId });

export const calcExpiresAt = (expiresIn: string) =>
  Math.floor(new Date().getTime() / 1000) + Number(expiresIn);
