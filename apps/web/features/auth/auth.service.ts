import { api } from "@/shared/lib/api";

export type RegisterPayload = {
  nickname: string;
  email: string;
  phone?: string;
  password: string;
  birthDate: string;
};

export type LoginPayload = {
  login: string;
  password: string;
};

export async function registerUser(payload: RegisterPayload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function loginUser(payload: LoginPayload) {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

export async function verifyEmail(email: string, code: string) {
  const response = await api.post("/auth/verify-email", { email, code });
  return response.data;
}

export async function forgotPassword(email: string) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  const response = await api.post("/auth/reset-password", {
    email,
    code,
    newPassword,
  });
  return response.data;
}

export async function getMe() {
  const response = await api.get("/users/me");
  return response.data;
}
