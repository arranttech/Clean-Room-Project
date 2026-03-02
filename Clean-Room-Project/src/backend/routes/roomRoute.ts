import { ServerRoute } from "@hapi/hapi";
import { roomRepository } from "../repositories";

export const roomRoute: ServerRoute[] = [
	{
		method: "GET",
		path: "/v1/roomstandards",
		handler: async (request, h) => {
			try {
				const project_id = request.query.project_id
					? Number(request.query.project_id)
					: undefined;

				const standards = await roomRepository.getRoomStandards({
					project_id,
				});

				return h.response({ standards }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	{
		method: "POST",
		path: "/v1/roomstandards",
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				const id = await roomRepository.createRoomStandards(payload);
				return h.response({ roomStandardsId: id }).code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	{
		method: "GET",
		path: "/v1/zonerooms",
		handler: async (request, h) => {
			try {
				const zone_id = request.query.zone_id
					? Number(request.query.zone_id)
					: undefined;

				const rooms = await roomRepository.getZoneRooms({ zone_id });
				return h.response({ rooms }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	{
		method: "POST",
		path: "/v1/zonerooms",
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				const id = await roomRepository.createZoneRooms(payload);
				return h.response({ zoneRoomsId: id }).code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
