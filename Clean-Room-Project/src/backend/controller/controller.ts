// src/api.js

const BASE_URL = "http://localhost:3000";

/**
 * Generic request handler
 */
async function request(
  endpoint: string,
  method: string = "GET",
  payload: object | null = null
) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return response.json();
}

export const loginUser = (payload: { identifier: string; password: string }) =>
  request("/v1/login", "POST", payload);

export const getUsers = () => request("/v1/users", "GET");

export const createUsers = (payload: object) =>
  request("/v1/users", "POST", payload);

  //post password
export const createUserPassword = (payload: {
  user_login_id: number;
  password: string;
}) => request("/v1/userpassword", "POST", payload);

export const deleteUser = (user_login_id: number) =>
  request(`/v1/users/${user_login_id}`, "DELETE");

export const getAllDetailsforCalculations = (room_id: number) =>
  request(`/v1/alldetails?room_id=${room_id}`, "GET");

export const storeresults = (payload: object) =>
  request("/v1/storeresults", "POST", payload);

export const customerInfo = (payload: object) =>
  request("/v1/customerinfo", "POST", payload);

export const roomStandards = (payload: object) =>
  request("/v1/roomstandards", "POST", payload);

export const customerDetails = (adminId?: number) =>
  request(`/v1/customers${adminId ? `?admin_id=${adminId}` : ""}`, "GET");

export const projectInfo = (payload: object) =>
  request("/v1/projectinfo", "POST", payload);

export const createProjectZone = (payload: object) =>
  request("/v1/projectzones", "POST", payload);

export const updateCustomer = (customerid?: number) =>
  request(
    `/v1/customers${customerid ? `?customerid=${customerid}` : ""}`,
    "UPDATE"
  );

export const deleteCustomer = (customerid?: number) =>
  request(
    `/v1/customers${customerid ? `?customerid=${customerid}` : ""}`,
    "DELETE"
  );

export const addRooms = (payload: object) =>
  request("/v1/zonerooms", "POST", payload);

// GET customer by customer_id — for CustomerInfoPage useEffect
export const getCustomerById = (customerId: number) =>
  request(`/v1/customerinfo?customer_id=${customerId}`, "GET");

// GET project by customer_id — for ProjectInfoPage useEffect
export const getProjectByCustomerId = (customerId: number) =>
  request(`/v1/projectinfo?customer_id=${customerId}`, "GET");

// GET room standards by project_id — for StandardPage useEffect
export const getRoomStandards = (projectId: number) =>
  request(`/v1/roomstandards?project_id=${projectId}`, "GET");

// GET zone rooms by zone_id — for RoomPage useEffect
export const getZoneRooms = (zoneId: number) =>
  request(`/v1/zonerooms?zone_id=${zoneId}`, "GET");

// GET customer info by user_login_id — for DashboardPage useEffect
export const getCustomerInfo = (userLoginId: number) =>
  request(`/v1/customers/user/${userLoginId}`, "GET");