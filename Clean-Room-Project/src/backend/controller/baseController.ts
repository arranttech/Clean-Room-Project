// src/api/baseApi.ts

const BASE_URL = "http://localhost:3000";

export async function request(
	endpoint: string,
	method: string = "GET",
	payload: object | null = null
) {
	const token = localStorage.getItem("token"); 
	const headers: any = { "Content-Type": "application/json",
	};
	if (token) {
		headers.Authorization = `Bearer ${token}`;
		}

	const options: RequestInit = {
		method,
		headers,
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
