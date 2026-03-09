
import { request } from "./baseController";

export const loginUser = (payload: { identifier: string; password: string }) =>
	request("/v1/login", "POST", payload);

export const createUserPassword = (payload: {
	user_login_id: number;
	password: string;
}) => request("/v1/userpassword", "POST", payload);

export const refreshSession = () => request("/v1/session/refresh", "POST");
