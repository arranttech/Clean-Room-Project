// src/api/zoneApi.ts
import { request } from "./baseApi";

export const createProjectZone = (payload: object) =>
	request("/v1/projectzones", "POST", payload);
