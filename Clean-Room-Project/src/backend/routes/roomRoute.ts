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
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const id = await roomRepository.createRoomStandards(request.payload);
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
        failAction: (request, h, err) => {
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
];
