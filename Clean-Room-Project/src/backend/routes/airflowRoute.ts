import { ServerRoute } from "@hapi/hapi";
import { airflowService, RoomPayload } from "../services/service";
import Joi from "joi";

export const airflowRoute: ServerRoute[] = [
	{
		method: "POST",
		path: "/v1/airflow",
		options: {
			description: "Calculate airflow for a room",
			tags: ["api", "airflow"],
			validate: {
				payload: Joi.object({
					roomName: Joi.string().required(),

					length: Joi.number().required(),
					width: Joi.number().required(),
					height: Joi.number().required(),

					acph: Joi.number().required(),
					freshAirPercent: Joi.number().required(),
					exhaustAir: Joi.number().required(),

					occupancy: Joi.number().required(),
					equipmentLoad: Joi.number().required(),
					lightingLoad: Joi.number().required(),

					infiltrationsPerHour: Joi.number().required(),

					minTempC: Joi.number().required(),
					maxTempC: Joi.number().required(),

					rhMin: Joi.number().required(),
					rhMax: Joi.number().required(),

					zoneReqInsideTempC: Joi.alternatives()
						.try(Joi.number(), Joi.string().valid("Ambient"))
						.required(),

					zoneReqInsideHum: Joi.alternatives()
						.try(Joi.number(), Joi.string().valid("Ambient"))
						.required(),

					zoneSystem: Joi.string().required(),
					zoneSystemType: Joi.string().optional(),

					zoneClassification: Joi.string().required(),
					zoneCoolingMethod: Joi.string().required(),
					zoneHeatingMethod: Joi.string().required(),
				}),
			},

			response: {
				status: {
					200: Joi.object({
						roomName: Joi.string().required(),
						area: Joi.number().required(),
						volume: Joi.number().required(),
						roomCfm: Joi.number().required(),
						freshAir: Joi.number().required(),
						exhaustAir: Joi.number().required(),

						dehumidValue: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
						removedWater: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
						resultantCfm: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
						roomACValue: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
						roomTermSupplyValue: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
						cfmACLoadTR: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
						resultCoolLoadTR: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),

						addWaterValue: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
						humidValue: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
						resultantheatCfm: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
						roomTermSupplyHeatValue: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
						cfmHeatLoadTRValue: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
						roomHeatLoadTR: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
						resultHeatLoadTR: Joi.alternatives().try(
							Joi.number(),
							Joi.string().valid("Invalid")
						),
					}).required(),

					500: Joi.object({
						error: Joi.string().required(),
					}),
				},
			},
		},

		handler: async (request, h) => {
			try {
				const payload = request.payload as RoomPayload;

				const result = await airflowService(payload);

				return h.response(result).code(200);
			} catch (err) {
				console.error("Airflow calculation error:", err);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
