// src/api.js

const BASE_URL = "http://localhost:3000";

/**
 * Generic request handler
 */
async function request(endpoint, method = "GET", payload = null) {
  const options = {
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

export const customerInfo = (payload) =>
  request("/api/customerInfo", "POST", payload);
