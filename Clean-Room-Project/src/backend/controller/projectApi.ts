// src/api/projectApi.ts
import { request } from "./baseApi";

export const projectInfo = (payload: object) =>
	request("/v1/projectinfo", "POST", payload);

export const getProjectByCustomerId = (customerId: number) =>
	request(`/v1/projectinfo?customer_id=${customerId}`);
