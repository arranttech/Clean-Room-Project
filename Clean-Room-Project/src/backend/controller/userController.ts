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
