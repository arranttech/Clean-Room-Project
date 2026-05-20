import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { zoneRepository } from "../repositories";

export const zoneRoute: ServerRoute[] = [
	// POST /v1/projectzones 
	{
		method: "POST",
		path: "/v1/projectzones",
		options: {
			description: "Create a new project zone",
			notes: "Creates a zone for a given project and returns generated zoneId.",
			tags: ["api", "project", "zones"],
			validate: {
				payload: Joi.object({
					project_id: Joi.number().required(),
					user_id: Joi.string().optional(),
					zone_name: Joi.string().required(),
				}).options({ allowUnknown: true }),
			},
			response: {
				status: {
					201: Joi.object({
						zoneId: Joi.number().integer().required().example(7001),
					}).label("CreateZoneResponse"),
					500: Joi.object({
						error: Joi.string().required(),
					}).label("ServerError"),
				},
			},
		},
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

	{
		method: "POST",
		path: "/v1/zonestotal/{zoneId}/totals",
		options: {
			description: "Save or Update zone totals",
			tags: ["api", "zones"],
			validate: {
				params: Joi.object({
					zoneId: Joi.number().required(),
				}),
				payload: Joi.object({
					zone_name: Joi.string().optional(),
					ExhaustFlag: Joi.string().optional(),

					zone_Area: Joi.number().allow(null),
					zone_Volume: Joi.number().allow(null),
					zone_RoomCfm: Joi.number().allow(null),
					zone_FreshAir: Joi.number().allow(null),
					zone_ResultantSupplyAir: Joi.number().allow(null),
					zone_ExhaustAir: Joi.number().allow(null),

					zone_DehumidCfm: Joi.number().allow(null),
					zone_Rem_Water_Vapour: Joi.number().allow(null),
					zone_HumidCfm: Joi.number().allow(null),
					zone_add_Water_Vapour: Joi.number().allow(null),

					zone_ResultCfm_Hot: Joi.number().allow(null),
					zone_Room_Term_Supply_Mod: Joi.number().allow(null),
					zone_Room_Heating_Load_TR: Joi.number().allow(null),
					zone_Cfm_Heating_Load_TR: Joi.number().allow(null),
					zone_Result_Heating_Load_TR: Joi.number().allow(null),

					zone_ResultCfm: Joi.number().allow(null),
					zone_Room_Termi_Supply_Mod: Joi.number().allow(null),
					zone_Room_AC_Load_TR: Joi.number().allow(null),
					zone_Cfm_AC_Load_TR: Joi.number().allow(null),
					zone_Res_Cooling_Load_TR: Joi.number().allow(null),
				}).options({ allowUnknown: true }),
			},
		},
		handler: async (request, h) => {
			try {
				const { zoneId } = request.params as any;
				const payload = request.payload as any;

				await zoneRepository.createZoneTotals(zoneId, payload);

				return h.response({ success: true }).code(200);
			} catch (err) {
				console.error("Zone total error:", err);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "GET",
		path: "/v1/zonestotal/{zoneId}/totals",
		options: {
			description: "Get aggregate totals for a specific zone",
			tags: ["api", "zones"],
			validate: {
				params: Joi.object({
					zoneId: Joi.number().integer().required(),
				}),
			},
		},
		handler: async (request, h) => {
			try {
				const { zoneId } = request.params as any;
				const data = await zoneRepository.getZoneTotals(zoneId);

				if (!data) {
					return h.response({ message: "No totals found for this zone" }).code(404);
				}

				return h.response(data).code(200);
			} catch (err) {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];