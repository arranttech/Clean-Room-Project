import { request } from "./baseController";

export const projectInfo = (payload: object) =>
	request("/v1/projectinfo", "POST", payload);

//update project info
export const updateProjectInfo = (projectId: number, payload: object) =>
  request(`/v1/projectinfo/${projectId}`, "PUT", payload);

//update project status
export const updateProjectStatus = (projectId: number, status: string) =>
  request(`/v1/projectinfo/${projectId}/status`, "PATCH", { status });

// export const getProjectByCustomerId = (customerId: number) =>
// 	request(`/v1/projectinfo?customer_id=${customerId}`);


