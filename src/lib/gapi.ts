import { db } from "../db/db";

type Request<T> = gapi.client.HttpRequest<T>;

export type GResponse<T extends Resource> = {
  body: string;
  result: T;
};

type Resource = {
  kind: string;
  etag: string;
};

export type TaskLists = {
  nextPageToken: string;
  items: TaskList[];
} & Resource;

export type TaskList = {
  title: string;
  updated: string;
  selfLink: string;
} & Resource;

export const getClient = () => {
  const token = db.getItem("accessToken");
  if (gapi.client && token) {
    gapi.client.setToken({
      access_token: token,
    });
    return gapi.client;
  }
};

export const getTaskLists = () =>
  getClient()?.request({
    path: "https://tasks.googleapis.com/tasks/v1/users/@me/lists",
  }) as Request<TaskLists>;

export const authorize = (
  callback: (token: GoogleApiOAuth2TokenObject) => any
) =>
  gapi.auth.authorize(
    {
      client_id: process.env["REACT_APP_CLIENT_ID"],
      scope: "https://www.googleapis.com/auth/tasks",
      immediate: false,
    },
    callback
  );
