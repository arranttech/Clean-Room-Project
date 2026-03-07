import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { resultRepository } from "../repositories";

const errorSchema = Joi.object({
	error: Joi.string().required(),
});

export const resultRoute: ServerRoute[] = [
	{
		method: "POST",
		path: "/v1/storeresults",
		options: {
			description: "Store calculated results for a room",
			tags: ["api", "results"],

			validate: {
				payload: Joi.object({
					room_id: Joi.number().integer().required(),

					area: Joi.number().required(),
					volume: Joi.number().required(),
					roomCfm: Joi.number().required(),
					freshAir: Joi.number().required(),
					exhaustAir: Joi.number().required(),

					dehumidValue: Joi.number().optional(),
					removedWater: Joi.number().optional(),
					resultantCfm: Joi.number().optional(),
					roomACValue: Joi.number().optional(),

					resultCoolLoadTR: Joi.number().optional(),
					resultHeatLoadTR: Joi.number().optional(),
				}),
			},

			response: {
				status: {
					201: Joi.object({
						resultId: Joi.number().required(),
					}),
					400: errorSchema,
					500: errorSchema,
				},
			},
		},

		handler: async (request, h) => {
			try {
				const resultId = await resultRepository.storeResults(request.payload);

				return h.response({ resultId }).code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
