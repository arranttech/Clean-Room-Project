import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { projectRepository } from "../repositories";

const errorSchema = Joi.object({
  error: Joi.string().required(),
});

export const projectRoute: ServerRoute[] = [
  // =========================
  // GET /v1/projectinfo
  // =========================
  {
    method: "GET",
    path: "/v1/projectinfo",
    options: {
      description: "Get project by customer ID",
      tags: ["api", "project"],
      validate: {
        query: Joi.object({
          customer_id: Joi.number().integer().required(),
        }),
      },
      response: {
        status: {
          200: Joi.object({ project: Joi.object().allow(null).required() }),
          400: errorSchema,
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const query = request.query as any;
        const customer_id = parseInt(query.customer_id, 10);
        const project = await projectRepository.getProjectByCustomerId(
          customer_id
        );
        return h.response({ project: project || null }).code(200);
      } catch {
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  // =========================
  // POST /v1/projectinfo
  // =========================
  {
    method: "POST",
    path: "/v1/projectinfo",
    options: {
      description: "Create new project",
      tags: ["api", "project"],
      validate: {
        payload: Joi.object({
          customer_id: Joi.number().integer().required(),
          projectName: Joi.string().required(),
          unitBranch: Joi.string().optional().allow("", null),
          uniqueId: Joi.string().optional().allow("", null),
          industry: Joi.array().items(Joi.string()).optional().default([]),
          handling: Joi.array().items(Joi.string()).optional().default([]),
          // selectedLocation can be a string or an object with display_name
          selectedLocation: Joi.alternatives()
            .try(
              Joi.object({ display_name: Joi.string().optional() }).unknown(
                true
              ),
              Joi.string(),
              Joi.allow(null)
            )
            .optional(),
          maxTemp: Joi.alternatives()
            .try(Joi.number(), Joi.string())
            .optional()
            .allow("", null),
          minTemp: Joi.alternatives()
            .try(Joi.number(), Joi.string())
            .optional()
            .allow("", null),
          relativeHumidityMin: Joi.alternatives()
            .try(Joi.number(), Joi.string())
            .optional()
            .allow("", null),
          relativeHumidityMax: Joi.alternatives()
            .try(Joi.number(), Joi.string())
            .optional()
            .allow("", null),
        }),
      },
      response: {
        status: {
          201: Joi.object({ projectId: Joi.number().required() }),
          400: errorSchema,
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const payload = request.payload as any;
        const projectId = await projectRepository.createProject(payload);
        return h.response({ projectId }).code(201);
      } catch (err) {
        console.error("PROJECT CREATE ERROR:", err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },
];
