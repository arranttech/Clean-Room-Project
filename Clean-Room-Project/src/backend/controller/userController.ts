import { request } from "./baseController";

export const getUsers = () => request("/v1/users");

export const createUsers = (payload: object) =>
  request("/v1/users", "POST", payload);

export const deleteUser = (user_login_id: number) =>
  request(`/v1/users/${user_login_id}`, "DELETE");

export const getUserById = (user_login_id: number) =>
  request(`/v1/users/${user_login_id}`, "GET");

// Single reusable update
export const updateUser = (user_login_id: number, payload: object) =>
  request(`/v1/users/update`, "PUT", { id: user_login_id, ...payload });

// Password update
export const updatePasswordByUserId = (
  user_login_id: number,
  payload: { current_password: string; new_password: string }
) => request(`/v1/password/update`, "PUT", { id: user_login_id, ...payload });

// Forgot password — POST
export const forgotPassword = (payload: { email: string }) =>
  request("/v1/auth/forgot-password", "POST", payload);

// Verify reset token — GET 
export const verifyResetToken = (token: string) =>
  request(`/v1/auth/verify-reset-token/${token}`, "GET");
//Verify if user exists in the database
export const checkUserIdExists = (user_id: string) =>
  request(
    `/v1/users/check-user-id?user_id=${encodeURIComponent(user_id)}`,
    "GET"
  );
  
// Reset password — POST /v1/auth/reset-password
// Updates tUserPassword with bcrypt hashed password
export const resetPassword = (payload: {
  token: string;
  new_password: string;
}) => request("/v1/auth/reset-password", "POST", payload);