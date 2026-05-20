import { request } from "./baseController";
export const saveBOQResults = (payload: object) =>
    request(`/v1/boqresults`, "POST", payload);

export const getBOQResultsByZoneId = (zoneId: number) =>
  request(`/v1/boqresults/${zoneId}`, "GET");