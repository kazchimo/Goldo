import { useGapiClient } from "./useGapiClient";

type Response<T> = gapi.client.HttpRequest<T>;

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

export const useTaskApi = () => {
  const client = useGapiClient();

  const getTasks = () =>
    client &&
    (client.request({
      path: "https://tasks.googleapis.com/tasks/v1/users/@me/lists",
    }) as Response<TaskLists>);

  return {
    getTasks,
  };
};
