// src/api/resultApi.ts
import { request } from "./baseApi";

export const storeresults = (payload: object) =>
	request("/v1/storeresults", "POST", payload);
