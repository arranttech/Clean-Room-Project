// src/api.js

const BASE_URL = "http://localhost:3000";

/**
 * Generic request handler
 */
async function request(endpoint: string, method: string = "GET", payload: object | null = null) {
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

/* ================================
   🔹 CUSTOMER APIs
================================ */

export const customerInfo = (payload: object) =>
  request("/v1/customerInfo", "POST", payload);

/* ================================
   🔹 ROOM STANDARDS APIs
================================ */

export const roomStandards = (payload: object) =>
  request("/v1/roomStandards", "POST", payload);

/* ================================
   🔹 AIRFLOW APIs
================================ */

export const airflow = (payload: object) =>
  request("/v1/airflow", "POST", payload);
