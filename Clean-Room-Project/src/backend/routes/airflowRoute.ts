import { ServerRoute } from "@hapi/hapi";
import { airflowService, RoomPayload } from "../services/service";

export const airflowRoute: ServerRoute[] = [
	{
		method: "POST",
		path: "/v1/airflow",
		handler: async (request, h) => {
			try {
				const payload = request.payload as RoomPayload;
				const result = airflowService(payload);
				return h.response(result).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
