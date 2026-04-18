
import { request } from "./baseController";

export const createProjectZone = (payload: object) =>
	request("/v1/projectzones", "POST", payload);

export const createZoneTotals = (zoneId: number | string, totals: object) =>
	request(`/v1/zonestotal/${zoneId}/totals`, "POST", totals);

export const getZoneTotals = (zoneId: number | string) =>
	request(`/v1/zonestotal/${zoneId}/totals`, "GET");