import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { inputRepository } from "../repositories";

const errorSchema = Joi.object({ error: Joi.string().required() });

export const inputRoute: ServerRoute[] = [
	{
		method: "GET",
		path: "/v1/alldetails",
		options: {
			description: "Fetch all input details for a room",
			tags: ["api", "project"],
			validate: {
				query: Joi.object({
					room_id: Joi.number().integer().default(8).optional(),
				}),
			},
			response: {
				status: {
					200: Joi.object({ roomdetails: Joi.array().required() }),
					500: errorSchema,
				},
			},
		},
		handler: async (request, h) => {
			try {
				const { room_id } = request.query as unknown as { room_id: number };
				const roomdetails = await inputRepository.getAllInputs({ room_id });
				return h.response({ roomdetails }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
