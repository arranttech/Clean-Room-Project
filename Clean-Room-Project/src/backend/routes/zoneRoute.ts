import { ServerRoute } from "@hapi/hapi";
import { zoneRepository } from "../repositories";

export const zoneRoute: ServerRoute[] = [
	{
		method: "POST",
		path: "/v1/projectzones",
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
