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

export const getCompletedProjects = (user_login_id: number) =>
  request(`/v1/projects/completed?user_login_id=${user_login_id}`, "GET");

export const getProjectCounts = (user_login_id: number) =>
  request(`/v1/projects/counts?user_login_id=${user_login_id}`, "GET");