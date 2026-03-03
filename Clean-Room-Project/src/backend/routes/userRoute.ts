import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { userRepository } from "../repositories";

export const userRoute: ServerRoute[] = [
	{
		method: "GET",
		path: "/v1/users",
		options: {
			description: "Get all users",
			tags: ["api", "users"],
			response: {
				status: {
					200: Joi.object({
						users: Joi.array().items(Joi.object()).required(),
					}),
					500: Joi.object({
						error: Joi.string().required(),
					}),
				},
			},
		},
		handler: async (_, h) => {
			try {
				const users = await userRepository.getUsers();
				return h.response({ users }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "POST",
		path: "/v1/users",
		options: {
			description: "Create a new user",
			tags: ["api", "users"],
			validate: {
				payload: Joi.object({
					username: Joi.string().required(),
					email: Joi.string().email().required(),
					password: Joi.string().min(6).required(),
				}),
			},
			response: {
				status: {
					201: Joi.object({
						message: Joi.string().required(),
						userId: Joi.number().required(),
					}),
					500: Joi.object({
						error: Joi.string().required(),
					}),
				},
			},
		},
		handler: async (request, h) => {
			try {
				const userLoginId = await userRepository.createUser(request.payload);
				return h
					.response({
						message: "User created successfully",
						userId: userLoginId,
					})
					.code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "DELETE",
		path: "/v1/users/{id}",
		options: {
			description: "Delete user by ID",
			tags: ["api", "users"],
			validate: {
				params: Joi.object({
					id: Joi.number().integer().required(),
				}),
			},
			response: {
				status: {
					200: Joi.object({
						message: Joi.string().required(),
					}),
					400: Joi.object({
						error: Joi.string().required(),
					}),
					404: Joi.object({
						error: Joi.string().required(),
					}),
					500: Joi.object({
						error: Joi.string().required(),
					}),
				},
			},
		},
		handler: async (request, h) => {
			try {
				const id = Number(request.params.id);
				if (!id) return h.response({ error: "Invalid user ID" }).code(400);

				const deleted = await userRepository.deleteUser(id);
				if (!deleted) return h.response({ error: "User not found" }).code(404);

				return h.response({ message: "User deleted successfully" }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
