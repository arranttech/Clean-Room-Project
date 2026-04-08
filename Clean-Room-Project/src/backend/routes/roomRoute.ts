import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { roomRepository } from "../repositories";

const numOrNull = Joi.alternatives()
	.try(Joi.number(), Joi.string().allow("", null), Joi.valid(null))
	.optional();

const strOrNull = Joi.string().allow(null, "").optional();

export const roomRoute: ServerRoute[] = [
	// GET /v1/roomstandards
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
		},
		handler: async (request, h) => {
			try {
				const { project_id } = request.query as { project_id?: number };
				const standards = await roomRepository.getRoomStandards({ project_id });
				return h.response({ standards }).code(200);
			} catch (error) {
				console.error("getRoomStandards error:", error);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// POST /v1/roomstandards
	{
		method: "POST",
		path: "/v1/roomstandards",
		options: {
			description: "Create room standards",
			tags: ["api", "rooms"],
			validate: {
				payload: Joi.object({
					project_id: Joi.number().integer().required(),
					user_id: Joi.string().required(),
					zone_name: Joi.string().trim().min(2).max(50).required(),
					system: strOrNull,
					systemType: strOrNull,
					heatingMethod: strOrNull,
					coolingMethod: strOrNull,
					standard: strOrNull,
					classification: strOrNull,
					acph: numOrNull,
					tempUnit: strOrNull,
					reqInsideTempC: numOrNull,
					reqInsideHum: numOrNull,
					maxTempC: numOrNull,
					minTempC: numOrNull,
					rhMin: numOrNull,
					rhMax: numOrNull,
					flowVelocity: numOrNull,
					flowMedium: strOrNull,
					heatingFlowVelocity: numOrNull,
					coolingFlowVelocity: numOrNull,
					pipeConfiguration: strOrNull,
					totalFiltrationStages: numOrNull,
					staticPressure: numOrNull,
				}).options({ allowUnknown: true }),
			},
		},
		handler: async (request, h) => {
			try {
				 console.log("Received createRoomStandards payload:", request.payload);
				const id = await roomRepository.createRoomStandards(request.payload);
				console.log("Created room standard ID:", id);
				return h.response({ roomStandardsId: id }).code(201);
			} catch (error) {
				console.error("createRoomStandards error:", error);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// GET /v1/zonerooms
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
		},
		handler: async (request, h) => {
			try {
				const { zone_id } = request.query as { zone_id?: number };
				const rooms = await roomRepository.getZoneRooms({ zone_id });
				return h.response({ rooms }).code(200);
			} catch (error) {
				console.error("getZoneRooms error:", error);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// POST /v1/zonerooms
	{
		method: "POST",
		path: "/v1/zonerooms",
		options: {
			description: "Add room to zone",
			tags: ["api", "zones"],
			validate: {
				payload: Joi.object({
					zone_id: Joi.number().integer().required(),
					user_id: Joi.string().required(),
					projectStandardId: Joi.number().integer().optional().allow(null),
					roomName: Joi.string().required(),
					length: strOrNull,
					width: strOrNull,
					height: strOrNull,
					occupancy: strOrNull,
					equipmentLoad: strOrNull,
					lightingLoad: strOrNull,
					infiltrationsPerHour: strOrNull,
					freshAirPercent: strOrNull,
					exhaustAir: strOrNull,
					selectedAcph: numOrNull,
				}),
				failAction: (_request, _h, err) => {
					console.log("zonerooms Validation Error:", err);
					throw err;
				},
			},
		},
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				console.log("zonerooms payload:", JSON.stringify(payload));
				const id = await roomRepository.createZoneRooms(payload);
				return h.response({ zoneRoomsId: id }).code(201);
			} catch (error) {
				console.error("createZoneRooms error:", error);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// PUT /v1/roomstandards/{standardId}
	{
		method: "PUT",
		path: "/v1/roomstandards/{standardId}",
		options: {
			description: "Update existing room standards",
			tags: ["api", "rooms"],
			validate: {
				params: Joi.object({
					standardId: Joi.number().integer().required(),
				}),
				payload: Joi.object({
					project_id: Joi.number().integer().optional(),
					user_id: Joi.string().optional(),
					system: strOrNull,
					systemType: strOrNull,
					heatingMethod: strOrNull,
					coolingMethod: strOrNull,
					standard: strOrNull,
					classification: strOrNull,
					acph: numOrNull,
					tempUnit: strOrNull,
					reqInsideTempC: numOrNull,
					reqInsideHum: numOrNull,
					maxTempC: numOrNull,
					minTempC: numOrNull,
					rhMin: numOrNull,
					rhMax: numOrNull,
					flowVelocity: numOrNull,
					heatingFlowVelocity: numOrNull,
					coolingFlowVelocity: numOrNull,
					pipeConfiguration: strOrNull,
					totalFiltrationStages: numOrNull,
					staticPressure: numOrNull,
				}).options({ allowUnknown: true }),
			},
		},
		handler: async (request, h) => {
			try {
				const { standardId } = request.params as any;
				await roomRepository.updateRoomStandards(
					parseInt(standardId),
					request.payload
				);
				return h.response({ success: true }).code(200);
			} catch (error) {
				console.error("updateRoomStandards error:", error);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	// DELETE /v1/zonerooms/{roomId}?zone_id=X
	{
		method: "DELETE",
		path: "/v1/zonerooms/{roomId}",
		options: {
			description:
				"Delete a zone room. Deletes zone too if it was the last room.",
			tags: ["api", "zones"],
			validate: {
				params: Joi.object({
					roomId: Joi.number().integer().required(),
				}),
				query: Joi.object({
					zone_id: Joi.number().integer().required(),
				}),
			},
		},
		handler: async (request, h) => {
			try {
				const { roomId } = request.params as any;
				const { zone_id } = request.query as any;
				await roomRepository.deleteZoneRoom(
					parseInt(roomId),
					parseInt(zone_id)
				);
				return h.response({ success: true }).code(200);
			} catch (error) {
				console.error("deleteZoneRoom error:", error);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	{
		method: "PUT",
		path: "/v1/zonerooms/{roomId}",
		options: {
			description: "Update zone room",
			tags: ["api", "zones"],
			validate: {
				params: Joi.object({
					roomId: Joi.number().integer().required(),
				}),
				payload: Joi.object({
					zone_id: Joi.number().required(),
					user_id: Joi.string().required(),
					projectStandardId: Joi.number().optional().allow(null),
					roomName: Joi.string().required(),
					length: strOrNull,
					width: strOrNull,
					height: strOrNull,
					occupancy: strOrNull,
					equipmentLoad: strOrNull,
					lightingLoad: strOrNull,
					infiltrationsPerHour: strOrNull,
					freshAirPercent: strOrNull,
					exhaustAir: strOrNull,
					selectedAcph: numOrNull,
				}),
			},
		},
		// handler: async (request, h) => {
		// 	const { roomId } = request.params as any;
		// 	const payload = request.payload as any;

		// 	await roomRepository.updateZoneRoom(roomId, payload);

		// 	return h.response({ success: true }).code(200);
		// },
		handler: async (request, h) => {
			try {
				const { roomId } = request.params as any;
				const payload = request.payload as any;

				console.log("UPDATE PAYLOAD:", payload);

				await roomRepository.updateZoneRoom(roomId, payload);

				return h.response({ success: true }).code(200);
			} catch (error) {
				console.error("updateZoneRoom error:", error);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		}
	},
];
