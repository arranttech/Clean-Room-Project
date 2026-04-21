import { request } from "./baseController";

export const projectInfo = (payload: object) =>
  request("/v1/projectinfo", "POST", payload);

//update project info
export const updateProjectInfo = (projectId: number, payload: object) =>
  request(`/v1/projectinfo/${projectId}`, "PUT", payload);

//update project status
export const updateProjectStatus = (projectId: number, status: string) =>
  request(`/v1/projectinfo/${projectId}/status`, "PATCH", { status });

export const deleteProject = (projectId: number) =>
  request(`/v1/projectinfo/${projectId}`, "DELETE");

export const getProjectDetails = (projectId: number) =>
  request(`/v1/projects/${projectId}/details`, "GET");

export const getInProgressProjects = (user_id: string, customer_id: any) =>
  request(`/v1/projects/inprogress?user_id=${user_id}&customer_id=${customer_id}`, "GET");

export const getCompletedProjects = (user_id: string, customer_id: number) =>
  request(`/v1/projects/completed?user_id=${user_id}&customer_id=${customer_id}`, "GET");

export const getProjectCounts = (user_id: string, customer_id: number) =>
  request(`/v1/projects/counts?user_id=${user_id}&customer_id=${customer_id}`, "GET");
  
//EXCEL export
export const getProjectExportData = (projectId: number) =>
  request(`/v1/projects/${projectId}/export`, "GET");
