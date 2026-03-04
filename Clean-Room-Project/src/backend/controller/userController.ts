import { request } from "./baseController";

export const getUsers = () => request("/v1/users");

export const createUsers = (payload: object) =>
  request("/v1/users", "POST", payload);

export const deleteUser = (user_login_id: number) =>
  request(`/v1/users/${user_login_id}`, "DELETE");

// GET user by user_login_id — for UserInfoPage useEffect
export const getUserById = (user_login_id: number) =>
  request(`/v1/users?user_login_id=${user_login_id}`, "GET");

// Update user by user_login_id
export const updateUser = (user_login_id: number, payload: object) =>
  request(`/v1/users/update`, "PUT", { id: user_login_id, ...payload });
