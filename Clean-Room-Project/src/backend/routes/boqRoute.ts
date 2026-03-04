import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { boqresults, BOQPayload } from "../services/boqresults";
import { cumulativeZoneService } from "../services/cummulativecal";

export const boqRoute: ServerRoute[] = [
	{
		method: "POST",
		path: "/v1/boqresults",
		options: {
			description: "Calculate BOQ values for a zone containing multiple rooms",
			tags: ["api", "calculations", "boq"],
			validate: {
				payload: Joi.object({
					zoneName: Joi.string().required(),
					zoneSystem: Joi.string().required(),
					zoneResultantCfm: Joi.number().required(),
					zoneResultantHeatCfm: Joi.number().required(),

					zoneReqInsideTempC: Joi.alternatives()
						.try(Joi.number(), Joi.string().valid("Ambient"))
						.required(),

					zoneClassification: Joi.string().required(),
				}).unknown(false),
			},
			response: {
				status: {
					200: Joi.object({
						zoneName: Joi.string().required(),
						AHUCfm: Joi.number().required(),
						AHUWidth: Joi.number().required(),
						AHUHeight: Joi.number().required(),
						stageFilter: Joi.number().required(),
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
				const payload = request.payload as BOQPayload;

				const result = await boqresults(payload);

				return h.response(result).code(200);
			} catch (err: any) {
				console.error("BOQ calculation error:", err);

				// Optional: return 400 if it's validation/service related
				if (err?.isBoom) {
					return h.response({ error: err.message }).code(400);
				}

				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "POST",
		path: "/v1/cummulativecalculation",
		options: {
			description:
				"Calculate cumulative values for a zone containing multiple rooms",
			tags: ["api", "calculations", "cumulative"],
			validate: {
				payload: Joi.object({
					zoneName: Joi.string().required(),
					zoneSystem: Joi.string().optional(),

					rooms: Joi.array()
						.items(
							Joi.object({
								roomName: Joi.string().required(),
								zoneSystem: Joi.string().optional(),

								areaFt2: Joi.number().required(),
								volumeFt3: Joi.number().required(),
								roomCfm: Joi.number().required(),
								freshAir: Joi.number().required(),
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
						zoneName: Joi.string().required(),
						zonearea: Joi.number().required(),
						zonevolume: Joi.number().required(),
						zoneroomCfm: Joi.number().required(),
						zonefreshAir: Joi.number().required(),
						zoneexhaustAir: Joi.number().required(),
						zonedehumidValue: Joi.number().required(),
						zoneremovedWater: Joi.number().required(),
						zoneresultantCfm: Joi.number().required(),
						zoneroomACValue: Joi.number().required(),
						zoneroomTermSupplyValue: Joi.number().required(),
						zonecfmACLoadTR: Joi.number().required(),
						zoneresultCoolLoadTR: Joi.number().required(),
						zoneaddWaterValue: Joi.number().required(),
						zonehumidValue: Joi.number().required(),
						zoneresultantheatCfm: Joi.number().required(),
						zoneroomTermSupplyHeatValue: Joi.number().required(),
						zonecfmHeatLoadTRValue: Joi.number().required(),
						zoneroomHeatLoadTR: Joi.number().required(),
						zoneresultHeatLoadTR: Joi.number().required(),
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

				const result = await cumulativeZoneService(zoneName, rooms);

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
];
