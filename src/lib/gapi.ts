import { db } from "../db/db";

const CLIENT_ID = process.env["REACT_APP_CLIENT_ID"];
const SCOPE = "https://www.googleapis.com/auth/tasks";

type Request<T> = gapi.client.HttpRequest<T>;

export type GResponse<T extends Resource> = {
  body: string;
  result: T;
};

type Resource = {
  kind: string;
  etag: string;
};

type ListResource<T> = Resource & {
  nextPageToken: string;
  items: T[];
};

export type Link = {
  type: string;
  description: string;
  link: string;
};

export type Tasks = ListResource<Task>;

export type Task = {
  id: string;
  title: string;
  updated: string;
  selfLink: string;
  parent: string;
  position: string;
  notes: string;
  due: string;
  completed: string;
  deleted: boolean;
  hidden: boolean;
  links: Link[];
} & Resource;

export type TaskLists = ListResource<TaskList>;

export type TaskList = {
  id: string;
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

export const getTasks = (listId: string) =>
  getClient()?.request({
    path: `https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks`,
  }) as Request<Tasks>;

export const authorize = (
  callback: (token: GoogleApiOAuth2TokenObject) => any,
  immediate: boolean = false
) =>
  gapi.auth.authorize(
    {
      client_id: CLIENT_ID,
      scope: SCOPE,
      immediate,
    },
    callback
  );

export const calcExpiresAt = (expiresIn: string) =>
  Math.floor(new Date().getTime() / 1000) + Number(expiresIn);
