import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
//import { cumulativeZoneService } from "../services/cummulativecal";
import { boqresults } from "../services/boqresults";
import { zoneRepository } from "../repositories/zoneRepository";


export const boqRoute: ServerRoute[] = [

	/*{
		method: "POST",
		path: "/v1/cummulativecalculation",
		options: {
			description: "Calculate cumulative values for a zone containing multiple rooms",
			tags: ["api", "calculations"],
			validate: {
				payload: Joi.object({
					zoneName: Joi.string().required(),
					zoneSystem: Joi.string().optional(),
					rooms: Joi.array()
						.items(
							Joi.object({
								roomName: Joi.string().required(),
								areaFt2: Joi.number().required(),
								volumeFt3: Joi.number().required(),
								roomCfm: Joi.number().required(),
								freshAir: Joi.number().required(),
								ResultantSupplyAir: Joi.number().required(),
								exhaustAir: Joi.number().required(),
								dehumidValue: Joi.number().required(),
								removedWater: Joi.number().required(),
								resultantCfm: Joi.number().required(),
								roomACValue: Joi.number().required(),
								roomTermSupplyValue: Joi.number().required(),
								cfmACLoadTR: Joi.number().required(),
								resultCoolLoadTR: Joi.number().required(),
								addWaterValue: Joi.number().required(),
								humidValue: Joi.number().required(),
								resultantheatCfm: Joi.number().required(),
								roomTermSupplyHeatValue: Joi.number().required(),
								cfmHeatLoadTRValue: Joi.number().required(),
								roomHeatLoadTR: Joi.number().required(),
								resultHeatLoadTR: Joi.number().required(),
							}).unknown(false)
						)
						.min(1)
						.required(),
				}).unknown(false),
			},
			response: {
				status: {
					200: Joi.object({

						exhaustTotals: Joi.object().required(),
						nonExhaustTotals: Joi.object().required(),
					}).required(),
					400: Joi.object({
						error: Joi.string().required(),
					}),
					500: Joi.object({
						error: Joi.string().required(),
					}),
				},
			},
		},
		handler: async (request, h) => {
			try {

				const { zoneName, rooms } = request.payload as any;
				const payload = request.payload as any;

				const result = await cumulativeZoneService(zoneName, rooms);

				const exhaustId = await zoneRepository.createProjectZone(payload);
				await zoneRepository.createZoneTotals(exhaustId, result.exhaustTotals);

				const nonExhaustId = await zoneRepository.createProjectZone(payload);
				await zoneRepository.createZoneTotals(nonExhaustId, result.nonExhaustTotals);

				return h.response(result).code(200);
			} catch (err: any) {
				console.error("Cumulative calculation error:", err);

				if (err?.isBoom) {
					return h.response({ error: err.message }).code(400);
				}

				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	}, */
	{
		method: "GET",
		path: "/v1/boqresults/{zoneId}",
		handler: async (request, h) => {
			const zoneId = request.params.zoneId;
			const result = await zoneRepository.getBOQResultsByZoneId(zoneId);
			return h.response(result).code(200);
		},
	},
	{
		method: "POST",
		path: "/v1/boqresults",
		options: {
			description: "Calculate BOQ values for a zone",
			tags: ["api", "calculations"],
			validate: {
				payload: Joi.object().unknown(true),
			},
			response: {
				status: {
					200: Joi.object({
						message: Joi.string().required(),
						data: Joi.object({
							insertId: Joi.number().allow(null).required(),
							affectedRows: Joi.number().required(),
						}).required(),
					}).required(),
					400: Joi.object({
						error: Joi.string().required(),
					}),
					500: Joi.object({
						error: Joi.string().optional(),
						sqlMessage: Joi.string().optional(),
						code: Joi.string().optional(),
					}).unknown(true),
				},
			},
		},
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;

				console.log("BOQ route payload:", payload);

				const result = await zoneRepository.saveBOQResults(payload);

				return h.response({
					message: "BOQ saved successfully",
					data: result,
				}).code(200);
			} catch (err: any) {
				console.error("BOQ route error:", err);

				return h.response({
					error: err?.message,
					sqlMessage: err?.sqlMessage,
					code: err?.code,
				}).code(500);
			}
		},
	},

];