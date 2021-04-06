export const DBKeys = {
  authToken: "authToken",
  login: "login",
  refreshToken: "refreshToken",
  expiresAt: "expiresAt",
};

export type DBKeys = keyof typeof DBKeys;
