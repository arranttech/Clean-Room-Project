import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { resultRepository } from "../repositories";

const numOrNull = Joi.alternatives()
  .try(Joi.number(), Joi.valid(null))
  .optional()
  .allow(null);

const errorSchema = Joi.object({
  error: Joi.string().required(),
});

export const resultRoute: ServerRoute[] = [
  {
    method: "POST",
    path: "/v1/storeresults",
    options: {
      description: "Store calculated results for a room",
      tags: ["api", "results"],

      validate: {
        payload: Joi.object({
          project_RoomId: Joi.number().integer().allow(null).optional(),
          project_id: Joi.number().integer().required(),
          roomName: Joi.string().allow(null, "").optional(),
          project_Area: numOrNull,
          project_Volume: numOrNull,
          project_RoomCfm: numOrNull,
          project_FreshAir: numOrNull,
          project_ExhaustAir: numOrNull,
          project_DehumidCfm: numOrNull,
          project_Rem_Water_Vapour: numOrNull,
          project_ResultCfm: numOrNull,
          project_Room_Termi_Supply_Mod: numOrNull,
          project_Room_AC_Load_TR: numOrNull,
          project_Cfm_AC_Load_TR: numOrNull,
          project_Res_Cooling_Load_TR: numOrNull,
          project_add_Water_Vapour: numOrNull,
          project_HumidCfm: numOrNull,
          project_ResultCfm_Hot: numOrNull,
          project_Room_Term_Supply_Mod: numOrNull,
          project_Room_Heating_Load_TR: numOrNull,
          project_Cfm_Heating_Load_TR: numOrNull,
          project_Result_Heating_Load_TR: numOrNull,
        }),
        failAction: (request, h, err) => {
          console.error("storeresults Joi validation error:", err);
          throw err;
        },
      },

      response: {
        status: {
          201: Joi.object({ resultId: Joi.number().required() }),
          400: errorSchema,
          500: errorSchema,
        },
      },
    },

    handler: async (request, h) => {
      try {
        const resultId = await resultRepository.storeResults(request.payload);

        return h.response({ resultId }).code(201);
      } catch (error) {
        console.error("storeResults DB error:", error);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },
];
