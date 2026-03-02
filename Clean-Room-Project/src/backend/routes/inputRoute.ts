import { ServerRoute } from "@hapi/hapi";
import { inputRepository } from "../repositories";

export const inputRoute: ServerRoute[] = [
	{
		method: "GET",
		path: "/v1/alldetails",
		handler: async (request, h) => {
			try {
				const room_id =
					typeof request.query.room_id === "number" ? request.query.room_id : 8;

				const roomdetails = await inputRepository.getAllInputs({ room_id });
				return h.response({ roomdetails }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
