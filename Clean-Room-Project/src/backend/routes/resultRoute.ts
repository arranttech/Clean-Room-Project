import { ServerRoute } from "@hapi/hapi";
import { resultRepository } from "../repositories";

export const resultRoute: ServerRoute[] = [
	{
		method: "POST",
		path: "/v1/storeresults",
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				const resultId = await resultRepository.storeResults(payload);
				return h.response({ resultId }).code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
