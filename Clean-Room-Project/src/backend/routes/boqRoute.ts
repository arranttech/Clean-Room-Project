import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { cumulativeZoneService } from "../services/cummulativecal";
import { boqresults } from "../services/boqresults";
import { zoneRepository } from "../repositories/zoneRepository";


export const boqRoute: ServerRoute[] = [

	{
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
	},

	{
		method: "POST",
		path: "/v1/boqresults",
		options: {
			description: "Calculate BOQ values for a zone",
			tags: ["api", "calculations"],
			validate: {
				payload: Joi.object({
					zoneName: Joi.string().required(),
					zoneSystem: Joi.string().required(),
					zoneExhaustAir: Joi.number().required(),
					zoneRoomCfm: Joi.number().optional(),
					zoneFreshAir: Joi.number().optional(),
					zoneResultantCfm: Joi.number().required(),
					zoneResultantHeatCfm: Joi.number().required(),
					zoneReqInsideTempC: Joi.alternatives()
						.try(Joi.number(), Joi.string().valid("Ambient"))
						.required(),
					zoneClassification: Joi.string().required(),
					zoneResultCoolLoadTR: Joi.number().required(),
					zoneRoomACValue: Joi.number().required(),
					zoneCfmACLoadTR: Joi.number().required(),
					zoneRoomHeatLoadTR: Joi.number().required(),
					zoneCfmHeatLoadTRValue: Joi.number().required(),
					totalFiltrationStagesSupply: Joi.number().required(),
					totalFiltrationStagesExhaust: Joi.number().required(),
					staticPressureSupply: Joi.number().required(),
					staticPressureExhaust: Joi.number().required(),
				}).unknown(true),
			},
			response: {
				status: {
					200: Joi.object({
						zoneName: Joi.string().required(),
						AHUCfm: Joi.number().required(),
						AHUWidth: Joi.number().required(),
						AHUHeight: Joi.number().required(),
						stageFilter: Joi.number().required(),
						BDB: Joi.number().required(),
						motorHP: Joi.number().required(),
						AHUCoolingLoadTR: Joi.number().required(),
						coolingCoil: Joi.number().required(),
						flowVelocity: Joi.alternatives().try(
							Joi.number(),
							Joi.array().items(Joi.number())
						).required(),
					}).unknown(true).required(),
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
				const payload = request.payload as any;

				const standards = {
					flowVelocity: payload.flowVelocity,
					heatingFlowVelocity: payload.heatingFlowVelocity,
					coolingFlowVelocity: payload.coolingFlowVelocity,
					totalFiltrationStagesSupply: payload.totalFiltrationStagesSupply,
					totalFiltrationStagesExhaust: payload.totalFiltrationStagesExhaust,
					staticPressureSupply: payload.staticPressureSupply,
					staticPressureExhaust: payload.staticPressureExhaust,
					pipeConfiguration: payload.pipeConfiguration
				};
				const result = await boqresults(payload, standards);
				return h.response(result).code(200);
			} catch (err: any) {
				console.error("BOQ calculation error:", err);

				if (err?.isBoom) {
					return h.response({ error: err.message }).code(400);
				}

				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];