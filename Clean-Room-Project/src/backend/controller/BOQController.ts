import { request } from "./baseController";
export const saveBOQResults = (payload: object) =>
    request(`/v1/boqresults`, "POST", payload);

