import { ServerRoute } from "@hapi/hapi";
import { screenRepository } from "../repositories";

export const screenRoute: ServerRoute[] = [
	{
		method: "POST",
		path: "/v1/screens",
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				if (!payload.name)
					return h.response({ error: "Screen name required" }).code(400);

				const screenId = await screenRepository.createScreen(payload);

				return h
					.response({
						message: "Screen created successfully",
						screen_id: screenId,
					})
					.code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	{
		method: "PUT",
		path: "/v1/screens/{id}",
		handler: async (request, h) => {
			try {
				const id = Number(request.params.id);
				if (!id) return h.response({ error: "Invalid screen ID" }).code(400);

				const updated = await screenRepository.updateScreen(
					id,
					request.payload
				);

				if (!updated)
					return h.response({ error: "Screen not found" }).code(404);

				return h.response({ message: "Screen updated successfully" }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	{
		method: "GET",
		path: "/v1/screens",
		handler: async (_, h) => {
			try {
				const screens = await screenRepository.getScreens();
				return h.response({ screens }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
