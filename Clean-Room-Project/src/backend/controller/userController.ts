// src/api/userApi.ts
import { request } from "./baseController";

export const getUsers = () => request("/v1/users");

export const createUsers = (payload: object) =>
	request("/v1/users", "POST", payload);

export const deleteUser = (user_login_id: number) =>
	request(`/v1/users/${user_login_id}`, "DELETE");
