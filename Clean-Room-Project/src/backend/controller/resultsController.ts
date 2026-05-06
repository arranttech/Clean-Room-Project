
import { request } from "./baseController";

export const storeresults = (payload: object) =>
	request("/v1/storeresults", "POST", payload);
	
// GET: fetch results from DB by projectId --OLD
//Commented this block for CRA-193
// export const getResultsByZone = (projectId: number) =>
//   request(`/v1/results/zone/${projectId}`, "GET");
//

//CRA-193 
export const getResultsSummaryByProjectId =(projectId: number)=>
  request(`/v1/results/${projectId}`,"GET");