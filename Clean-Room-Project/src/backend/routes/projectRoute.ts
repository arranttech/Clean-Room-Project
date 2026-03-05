import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { projectRepository } from "../repositories";

const errorSchema = Joi.object({
	error: Joi.string().required(),
});

export const projectRoute: ServerRoute[] = [
	// =========================
	// GET /v1/projectinfo
	// =========================
	{
		method: "GET",
		path: "/v1/projectinfo",
		options: {
			description: "Get project by customer ID",
			tags: ["api", "project"],

			validate: {
				query: Joi.object({
					customer_id: Joi.number()
						.integer()
						.required()
						.description("Customer ID"),
				}),
			},

			response: {
				status: {
					200: Joi.object({
						project: Joi.object().allow(null).required(),
					}),
					400: errorSchema,
					500: errorSchema,
				},
			},
		},

		handler: async (request, h) => {
			try {
				const { customer_id } = request.query as {
					customer_id: number;
				};

				const project = await projectRepository.getProjectByCustomerId(
					customer_id
				);

				return h.response({ project: project || null }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// =========================
	// POST /v1/projectinfo
	// =========================
	{
		method: "POST",
		path: "/v1/projectinfo",
		options: {
			description: "Create new project",
			tags: ["api", "project"],

			validate: {
				payload: Joi.object({
					customer_id: Joi.number().integer().required(),
					projectName: Joi.string().required(),
					uniqueId: Joi.string().required(),
					industry: Joi.array().items(Joi.string()).required(),
					handling: Joi.array().items(Joi.string()).required(),
					maxTemp: Joi.number().required(),
					minTemp: Joi.number().required(),
					relativeHumidityMin: Joi.number().required(),
					relativeHumidityMax: Joi.number().required(),
					unitBranch: Joi.string().required(),
				}),
			},

			response: {
				status: {
					201: Joi.object({
						projectId: Joi.number().required(),
					}),
					400: errorSchema,
					500: errorSchema,
				},
			},
		},

		handler: async (request, h) => {
			try {
				const projectId = await projectRepository.createProject(
					request.payload
				);

				return h.response({ projectId }).code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
