// src/api/roomApi.ts
import { request } from "./baseApi";

export const roomStandards = (payload: object) =>
	request("/v1/roomstandards", "POST", payload);

export const getRoomStandards = (projectId: number) =>
	request(`/v1/roomstandards?project_id=${projectId}`);

export const addRooms = (payload: object) =>
	request("/v1/zonerooms", "POST", payload);

export const getZoneRooms = (zoneId: number) =>
	request(`/v1/zonerooms?zone_id=${zoneId}`);

export const getAllDetailsforCalculations = (room_id: number) =>
	request(`/v1/alldetails?room_id=${room_id}`);
