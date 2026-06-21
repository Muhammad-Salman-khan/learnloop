import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});

export const {
  signIn,
  signOut,
  signUp,
  accountInfo,
  changeEmail,
  getSession,
  resetPassword,
  verifyEmail,
  updateUser,
  revokeOtherSessions,
  revokeSession,
  updateSession,
  changePassword,
  deleteUser,
  listSessions,
} = authClient;
