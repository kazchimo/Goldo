import { DBKeys } from "./keys";

export const db = {
  getItem: (key: DBKeys) => localStorage.getItem(DBKeys[key]),
  setItem: (key: DBKeys, value: string) =>
    localStorage.setItem(DBKeys[key], value),
};
