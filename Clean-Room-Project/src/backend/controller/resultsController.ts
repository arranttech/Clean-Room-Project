
import { request } from "./baseController";

export const storeresults = (payload: object) =>
	request("/v1/storeresults", "POST", payload);
	
// GET: fetch results from DB by projectId 
export const getResultsByZone = (projectId: number) =>
  request(`/v1/results/zone/${projectId}`, "GET");