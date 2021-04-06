export const DBKeys = {
  accessToken: "accessToken",
  login: "login",
  refreshToken: "refreshToken",
  expiresAt: "expiresAt",
};

export type DBKeys = keyof typeof DBKeys;
