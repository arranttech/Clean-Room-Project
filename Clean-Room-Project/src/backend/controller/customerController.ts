// src/api/customerApi.ts
import { request } from "./baseController";

export const customerInfo = (payload: object) =>
	request("/v1/customerinfo", "POST", payload);

export const getCustomerById = (customerId: number) =>
	request(`/v1/customers/${customerId}`);

export const customerDetails = (adminId?: number) =>
	request(`/v1/customers${adminId ? `?admin_id=${adminId}` : ""}`);

export const getCustomerInfo = (userLoginId: number) =>
	request(`/v1/customers/user/${userLoginId}`);

export const updateCustomer = (customerId: number, payload: object) =>
	request(`/v1/customers/${customerId}`, "PUT", payload);

export const deleteCustomer = (customerId: number) =>
	request(`/v1/customers/${customerId}`, "DELETE");