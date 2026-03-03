import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { screenRepository } from "../repositories";

const errorSchema = Joi.object({
	error: Joi.string().required(),
});

export const screenRoute: ServerRoute[] = [
	{
		method: "POST",
		path: "/v1/screens",
		options: {
			description: "Create a new screen",
			tags: ["api", "screens"],

			validate: {
				payload: Joi.object({
					name: Joi.string().required().description("Screen name"),
					description: Joi.string().optional(),
				}),
			},

			response: {
				status: {
					201: Joi.object({
						message: Joi.string().required(),
						screen_id: Joi.number().required(),
					}),
					400: errorSchema,
					500: errorSchema,
				},
			},
		},

		handler: async (request, h) => {
			try {
				const screenId = await screenRepository.createScreen(request.payload);

				return h
					.response({
						message: "Screen created successfully",
						screen_id: screenId,
					})
					.code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "PUT",
		path: "/v1/screens/{id}",
		options: {
			description: "Update an existing screen",
			tags: ["api", "screens"],

			validate: {
				params: Joi.object({
					id: Joi.number().integer().required(),
				}),
				payload: Joi.object({
					name: Joi.string().optional(),
					description: Joi.string().optional(),
				}),
			},

			response: {
				status: {
					200: Joi.object({
						message: Joi.string().required(),
					}),
					400: errorSchema,
					404: errorSchema,
					500: errorSchema,
				},
			},
		},

		handler: async (request, h) => {
			try {
				const id = Number(request.params.id);

				const updated = await screenRepository.updateScreen(
					id,
					request.payload
				);

				if (!updated) {
					return h.response({ error: "Screen not found" }).code(404);
				}

				return h.response({ message: "Screen updated successfully" }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "GET",
		path: "/v1/screens",
		options: {
			description: "Get all screens",
			tags: ["api", "screens"],

			response: {
				status: {
					200: Joi.object({
						screens: Joi.array().items(Joi.object()).required(),
					}),
					500: errorSchema,
				},
			},
		},

		handler: async (_, h) => {
			try {
				const screens = await screenRepository.getScreens();
				return h.response({ screens }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
