
import { request } from "./baseController";

export const createProjectZone = (payload: object) =>
	request("/v1/projectzones", "POST", payload);

export const updateZoneTotals = (zoneId: number | string, totals: object) =>
	request(`/v1/projectzones/${zoneId}/totals`, "PUT", totals);