import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { zoneRepository } from "../repositories";

export const zoneRoute: ServerRoute[] = [
	{
		method: "POST",
		path: "/v1/projectzones",
		options: {
			description: "Create a new project zone",
			notes: "Creates a zone for a given project and returns generated zoneId.",
			tags: ["api", "project", "zones"],

			validate: {
				payload: Joi.object({
					project_id: Joi.number().required(),
				}),
			},

			response: {
				status: {
					201: Joi.object({
						zoneId: Joi.number().integer().required().example(7001),
					}).label("CreateZoneResponse"),

					500: Joi.object({
						error: Joi.string().required(),
					}).label("ServerError"),
				},
			},
		},

		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				const zoneId = await zoneRepository.createProjectZone(payload);

				return h.response({ zoneId }).code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
