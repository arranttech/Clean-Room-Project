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

	// PUT /v1/projectzones/{zoneId}/totals
	{
		method: "PUT",
		path: "/v1/projectzones/{zoneId}/totals",
		options: {
			description: "Save zone aggregate totals into tProjectZones",
			tags: ["api", "project", "zones"],
			validate: {
				params: Joi.object({
					zoneId: Joi.number().integer().required(),
				}),
				payload: Joi.object({
					zone_Area:                   Joi.number().allow(null).optional(),
					zone_Volume:                 Joi.number().allow(null).optional(),
					zone_RoomCfm:                Joi.number().allow(null).optional(),
					zone_FreshAir:               Joi.number().allow(null).optional(),
					zone_ExhaustAir:             Joi.number().allow(null).optional(),
					zone_DehumidCfm:             Joi.number().allow(null).optional(),
					zone_Rem_Water_Vapour:       Joi.number().allow(null).optional(),
					zone_ResultCfm:              Joi.number().allow(null).optional(),
					zone_Room_Termi_Supply_Mod:  Joi.number().allow(null).optional(),
					zone_Room_AC_Load_TR:        Joi.number().allow(null).optional(),
					zone_Cfm_AC_Load_TR:         Joi.number().allow(null).optional(),
					zone_Res_Cooling_Load_TR:    Joi.number().allow(null).optional(),
					zone_add_Water_Vapour:       Joi.number().allow(null).optional(),
					zone_HumidCfm:               Joi.number().allow(null).optional(),
					zone_ResultCfm_Hot:          Joi.number().allow(null).optional(),
					zone_Room_Term_Supply_Mod:   Joi.number().allow(null).optional(),
					zone_Room_Heating_Load_TR:   Joi.number().allow(null).optional(),
					zone_Cfm_Heating_Load_TR:    Joi.number().allow(null).optional(),
					zone_Result_Heating_Load_TR: Joi.number().allow(null).optional(),
				}).options({ allowUnknown: true }),
			},
			response: {
				status: {
					200: Joi.object({ success: Joi.boolean().required() }).label("UpdateZoneTotalsResponse"),
					500: Joi.object({ error: Joi.string().required() }).label("ServerError"),
				},
			},
		},
		handler: async (request, h) => {
			try {
				const { zoneId } = request.params as any;
				const payload = request.payload as any;
				await zoneRepository.updateZoneTotals(zoneId, payload);
				return h.response({ success: true }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];