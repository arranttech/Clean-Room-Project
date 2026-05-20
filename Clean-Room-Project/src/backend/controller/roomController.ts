import { request } from "./baseController";

export const roomStandards = (payload: object) =>
  request("/v1/roomstandards", "POST", payload);

export const updateRoomStandards = (standardId: number, payload: object) =>
  request(`/v1/roomstandards/${standardId}`, "PUT", payload);

export const getRoomStandards = (projectId: number) =>
  request(`/v1/roomstandards?project_id=${projectId}`);

export const addRooms = (payload: object) =>
  request("/v1/zonerooms", "POST", payload);

export const getZoneRooms = (zoneId: number) =>
  request(`/v1/zonerooms?zone_id=${zoneId}`);

export const getAllDetailsforCalculations = (room_id: number) =>
  request(`/v1/alldetails?room_id=${room_id}`);

  export const deleteZoneRoom = (roomId: number, zoneId: number | string) =>
  request(`/v1/zonerooms/${roomId}?zone_id=${zoneId}`, "DELETE");
  export const updateZoneRoom = (roomId: number, payload: object) =>
  request(`/v1/zonerooms/${roomId}`, "PUT", payload);