import { ServerRoute } from "@hapi/hapi";
import { airflowService, RoomPayload } from "../services/service";
import Joi from "joi";

const airflowResultSchema = Joi.object({
  roomName: Joi.string().required(),
  zoneSystem: Joi.string().required(),
  zoneReqInsideTempC: Joi.alternatives()
    .try(Joi.number(), Joi.string().valid("Ambient", "Invalid"))
    .required(),
  areaFt2: Joi.number().required(),
  volumeFt3: Joi.number().required(),
  roomCfm: Joi.number().required(),
  freshAir: Joi.number().required(),
  ResultantSupplyAir: Joi.number().required(),
  exhaustAir: Joi.number().required(),

  dehumidValue: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
  removedWater: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
  resultantCfm: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
  roomACValue: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
  roomTermSupplyValue: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
  cfmACLoadTR: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
  resultCoolLoadTR: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),

  addWaterValue: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
  humidValue: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
  resultantheatCfm: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
  roomTermSupplyHeatValue: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
  cfmHeatLoadTRValue: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
  roomHeatLoadTR: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
  resultHeatLoadTR: Joi.alternatives().try(
    Joi.number(),
    Joi.string().valid("Invalid")
  ).required(),
}).required();

export const airflowRoute: ServerRoute[] = [
  {
    method: "POST",
    path: "/v1/airflow",
    options: {
      description: "Calculate airflow for a room",
      tags: ["api", "calculations"],
      validate: {
        payload: Joi.object({
          roomName: Joi.string().required(),

          length: Joi.number().required(),
          width: Joi.number().required(),
          height: Joi.number().required(),

          acph: Joi.number().required(),
          freshAirPercent: Joi.number().required(),
          exhaustAir: Joi.number().required(),
          exhaustAirCfm: Joi.number().required(),

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
          200: Joi.alternatives().try(
            airflowResultSchema,
            Joi.array().items(airflowResultSchema).min(2)
          ).required(),

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