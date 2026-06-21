"use server";
import { LoginInput, SignupInput, loginFormSchema } from "./../Types/auth";
import { cookies, headers } from "next/headers";
import { auth } from "../auth/auth";
import prisma from "../prisma";
import { ReturnResponse } from "../response/ReturnResponse";
import { signIn } from "../auth/authClient";

const checkUser = async (email: string) => {
  const UserInfo = await prisma.user.findFirst({
    where: { email: email },
  });
  if (!UserInfo) {
    return ReturnResponse({
      status: 404,
      success: false,
      message: "User doesnt exists",
    });
  }
  return ReturnResponse({
    status: 200,
    success: true,
    message: "User exists",
    data: UserInfo,
  });
};

export const loginWithEmail = async (credentials: LoginInput) => {
  const { email, password } = credentials;
  if (!email.trim() || !password.trim())
    ReturnResponse({
      status: 400,
      success: false,
      message: "fill all the fields",
      error: "Enter email and password",
      data: null,
    });
  const { user, redirect, url } = await auth.api.signInEmail({
    body: { email, password },
    headers: await headers(),
  });
  if (!user)
    ReturnResponse({
      status: 404,
      success: false,
      message: `user doesnt exists`,
      error: "user doesnt exists",
      data: null,
    });
  return ReturnResponse({
    status: 200,
    success: true,
    message: `User LoggedIn Successfully`,
    error: "",
    data: null,
  });
};

export const SignUpWithEmail = async (credentials: SignupInput) => {
  const { name, email, password } = credentials;
  if (!email.trim() || !password.trim())
    ReturnResponse({
      status: 400,
      success: false,
      message: "Please fill all the fields",
      error: "Name, email, and password are required",
      data: null,
    });
  try {
    const { user } = await auth.api.signUpEmail({
      body: {
        name: name,
        email: email,
        password: password,
      },
      headers: await headers(),
    });
    return ReturnResponse({
      status: 200,
      success: true,
      message: `User Created Successfully`,
      error: "",
      data: null,
    });
  } catch (error: any) {
    const isDuplicate =
      error?.message?.toLowerCase().includes("already exists") ||
      error?.status === "UNPROCESSABLE_ENTITY";

    return ReturnResponse({
      status: isDuplicate ? 409 : 400,
      success: false,
      message:
        isDuplicate ?
          "An account with this email already exists"
        : (error?.message ?? "Failed to create account"),
      error: error?.message ?? "Signup failed",
      data: null,
    });
  }
};
