
import { request } from "./baseController";

export const getScreens = () => request("/v1/screens");

export const createScreen = (payload: object) =>
	request("/v1/screens", "POST", payload);

export const updateScreen = (screenId: number, payload: object) =>
	request(`/v1/screens/${screenId}`, "PUT", payload);
