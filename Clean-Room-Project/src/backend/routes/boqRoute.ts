import { ServerRoute } from "@hapi/hapi";
import { boqresults, BOQPayload } from "../services/boqresults";
import { cumulativeZoneService } from "../services/cummulativecal";

export const boqRoute: ServerRoute[] = [
	{
		method: "POST",
		path: "/v1/boqresults",
		handler: async (request, h) => {
			try {
				const payload = request.payload as BOQPayload;
				const result = boqresults(payload);
				return h.response(result).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	{
		method: "POST",
		path: "/v1/columncummaltion",
		handler: async (request, h) => {
			try {
				const { zoneName, rooms } = request.payload as any;
				const result = cumulativeZoneService(zoneName, rooms);
				return h.response(result).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
