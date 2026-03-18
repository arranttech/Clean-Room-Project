
import { request } from "./baseController";

export const storeresults = (payload: object) =>
	request("/v1/storeresults", "POST", payload);
