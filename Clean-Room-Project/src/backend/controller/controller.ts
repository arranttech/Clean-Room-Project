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

export const getUsers = () => request("/v1/users", "GET");

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
