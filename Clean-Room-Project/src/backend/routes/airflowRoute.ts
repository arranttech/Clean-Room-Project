import { ServerRoute } from "@hapi/hapi";
import { airflowService, RoomPayload } from "../services/service";
import Joi from "joi";

export const airflowRoute: ServerRoute[] = [
	{
		method: "POST",
		path: "/v1/airflow",
		options: {
			description: "Calculate airflow for a room",
			tags: ["api", "airflow"],
			validate: {
				payload: Joi.object({
					roomId: Joi.number().required(),
					temperature: Joi.number().required(),
					humidity: Joi.number().required(),
					// Add other RoomPayload fields here as needed
				}),
			},
			response: {
				status: {
					200: Joi.object().required(),
					500: Joi.object({ error: Joi.string().required() }),
				},
			},
		},
		handler: async (request, h) => {
			try {
				const payload = request.payload as RoomPayload;
				const result = await airflowService(payload); // ensure service is async if needed
				return h.response(result).code(200);
			} catch (err) {
				console.error("Airflow calculation error:", err);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
