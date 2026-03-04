// src/api/projectApi.ts
import { request } from "./baseController";
//GET profiles in profile page

export const getProfiles = () => request("/v1/profiles", "GET");

export const createProfile = (payload: object) =>
	request("/v1/profiles", "POST", payload);

export const updateProfile = (profileId: number, payload: object) =>
	request(`/v1/profiles/${profileId}`, "PUT", payload);

//GET profile details in profile page
export const getProfileDetails = (profile_id: number) =>
	request(`/v1/profiledetails?profile_id=${profile_id}`, "GET");

//POST profile details in profile page
export const saveProfileDetails = (payload: any) =>
	request("/v1/profiledetails", "POST", payload);

// ASSIGN PROFILES
export const assignProfileToUser = (payload: {
	userId: string;
	systemProfileId: number;
}) => request("/v1/assign-profile", "POST", payload);

export const getAssignedProfiles = () =>
	request("/v1/assigned-profiles", "GET");

export const deleteAssignedProfile = (id: number) =>
	request(`/v1/assigned-profiles/${id}`, "DELETE");
