import { ServerRoute } from "@hapi/hapi";
import { projectRepository } from "../repositories";

export const projectRoute: ServerRoute[] = [
	{
		method: "GET",
		path: "/v1/projectinfo",
		handler: async (request, h) => {
			try {
				const customer_id = request.query.customer_id
					? Number(request.query.customer_id)
					: undefined;

				if (!customer_id)
					return h.response({ error: "customer_id required" }).code(400);

				const project = await projectRepository.getProjectByCustomerId(
					customer_id
				);

				return h.response({ project: project || null }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	{
		method: "POST",
		path: "/v1/projectinfo",
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				const projectId = await projectRepository.createProject(payload);
				return h.response({ projectId }).code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
