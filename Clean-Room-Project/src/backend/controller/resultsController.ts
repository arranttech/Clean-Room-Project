
import { request } from "./baseController";

export const storeresults = (payload: object) =>
	request("/v1/storeresults", "POST", payload);

export const getResultsByZone = (projectId: number) =>
	request(`/v1/results/zone/${projectId}`);