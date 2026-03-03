import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { roomRepository } from "../repositories";

const errorSchema = Joi.object({
	error: Joi.string().required(),
});

export const roomRoute: ServerRoute[] = [
	// =========================
	// GET /v1/roomstandards
	// =========================
	{
		method: "GET",
		path: "/v1/roomstandards",
		options: {
			description: "Get room standards by project",
			tags: ["api", "rooms"],

			validate: {
				query: Joi.object({
					project_id: Joi.number().integer().optional(),
				}),
			},

			response: {
				status: {
					200: Joi.object({
						standards: Joi.array().items(Joi.object()).required(),
					}),
					500: errorSchema,
				},
			},
		},

		handler: async (request, h) => {
			try {
				const { project_id } = request.query as {
					project_id?: number;
				};

				const standards = await roomRepository.getRoomStandards({
					project_id,
				});

				return h.response({ standards }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// =========================
	// POST /v1/roomstandards
	// =========================
	{
		method: "POST",
		path: "/v1/roomstandards",
		options: {
			description: "Create room standards",
			tags: ["api", "rooms"],

			validate: {
				payload: Joi.object({
					system: Joi.string().required(),
					systemType: Joi.string().required(),
					heatingMethod: Joi.string().required(),
					coolingMethod: Joi.string().required(),
					classification: Joi.string().required(),
					acph: Joi.number().required(),
					reqInsideTempC: Joi.number().required(),
					reqInsideHum: Joi.number().required(),
				}),
			},

			response: {
				status: {
					201: Joi.object({
						roomStandardsId: Joi.number().required(),
					}),
					500: errorSchema,
				},
			},
		},

		handler: async (request, h) => {
			try {
				const id = await roomRepository.createRoomStandards(request.payload);
				return h.response({ roomStandardsId: id }).code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// =========================
	// GET /v1/zonerooms
	// =========================
	{
		method: "GET",
		path: "/v1/zonerooms",
		options: {
			description: "Get rooms by zone",
			tags: ["api", "zones"],

			validate: {
				query: Joi.object({
					zone_id: Joi.number().integer().optional(),
				}),
			},

			response: {
				status: {
					200: Joi.object({
						rooms: Joi.array().items(Joi.object()).required(),
					}),
					500: errorSchema,
				},
			},
		},

		handler: async (request, h) => {
			try {
				const { zone_id } = request.query as {
					zone_id?: number;
				};

				const rooms = await roomRepository.getZoneRooms({ zone_id });

				return h.response({ rooms }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// =========================
	// POST /v1/zonerooms
	// =========================
	{
		method: "POST",
		path: "/v1/zonerooms",
		options: {
			description: "Add room to zone",
			tags: ["api", "zones"],

			validate: {
				payload: Joi.object({
					zone_id: Joi.number().integer().required(),
					room_name: Joi.string().required(),
				}),
			},

			response: {
				status: {
					201: Joi.object({
						zoneRoomsId: Joi.number().required(),
					}),
					500: errorSchema,
				},
			},
		},

		handler: async (request, h) => {
			try {
				const id = await roomRepository.createZoneRooms(request.payload);
				return h.response({ zoneRoomsId: id }).code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
