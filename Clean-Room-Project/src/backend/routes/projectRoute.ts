import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { projectRepository } from "../repositories";

const errorSchema = Joi.object({ error: Joi.string().required() });

export const projectRoute: ServerRoute[] = [
  {
    method: "POST",
    path: "/v1/projectinfo",
    options: {
      description: "Create new project",
      tags: ["api", "project"],
      validate: {
        payload: Joi.object({
          customer_id: Joi.number().integer().required(),
          user_id: Joi.string().required(),
          user_login_id: Joi.number().integer().required(),
          projectName: Joi.string().required(),
          unitBranch: Joi.string().optional().allow("", null),
          uniqueId: Joi.string().optional().allow("", null),
          industry: Joi.array().items(Joi.string()).optional().default([]),
          handling: Joi.array().items(Joi.string()).optional().default([]),
          subIndustry: Joi.string().optional().allow("", null),
          selectedLocation: Joi.alternatives().try(
            Joi.object({ display_name: Joi.string().optional() }).unknown(true),
            Joi.string(), Joi.allow(null)
          ).optional(),
          maxTemp: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow("", null),
          minTemp: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow("", null),
          relativeHumidityMin: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow("", null),
          relativeHumidityMax: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow("", null),
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
        const projectId = await projectRepository.createProject(request.payload);
        return h.response({ projectId }).code(201);
      } catch (err) {
        console.error("PROJECT CREATE ERROR:", err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  {
    method: "PUT",
    path: "/v1/projectinfo/{projectId}",
    options: {
      description: "Update existing project",
      tags: ["api", "project"],
      validate: {
        params: Joi.object({ projectId: Joi.number().integer().required() }),
        payload: Joi.object({
          customer_id: Joi.number().integer().optional(),
          user_id: Joi.string().optional(),
          uniqueId: Joi.string().optional().allow("", null),
          projectName: Joi.string().required(),
          unitBranch: Joi.string().optional().allow("", null),
          industry: Joi.array().items(Joi.string()).optional().default([]),
          handling: Joi.array().items(Joi.string()).optional().default([]),
          subIndustry: Joi.string().optional().allow("", null),
          selectedLocation: Joi.alternatives().try(
            Joi.object({ display_name: Joi.string().optional() }).unknown(true),
            Joi.string(), Joi.allow(null)
          ).optional(),
          maxTemp: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow("", null),
          minTemp: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow("", null),
          relativeHumidityMin: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow("", null),
          relativeHumidityMax: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow("", null),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { projectId } = request.params as any;
        await projectRepository.updateProject(parseInt(projectId), request.payload);
        return h.response({ success: true }).code(200);
      } catch (err) {
        console.error("PROJECT UPDATE ERROR:", err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  {
    method: "PATCH",
    path: "/v1/projectinfo/{projectId}/status",
    options: {
      description: "Update project status",
      tags: ["api", "project"],
      validate: {
        params: Joi.object({ projectId: Joi.number().integer().required() }),
        payload: Joi.object({
          status: Joi.string().valid("COMPLETED", "INPROGRESS", "DRAFT").required(),
        }),
      },
      response: {
        status: {
          200: Joi.object({ success: Joi.boolean().required() }),
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const { projectId } = request.params as any;
        const { status } = request.payload as any;
        await projectRepository.updateProjectStatus(parseInt(projectId), status);
        return h.response({ success: true }).code(200);
      } catch (err) {
        console.error("PROJECT STATUS UPDATE ERROR:", err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  {
    method: "GET",
    path: "/v1/projects/inprogress",
    options: {
      description: "Get in-progress projects for a user",
      tags: ["api", "project"],
      validate: {
        query: Joi.object({
          user_id: Joi.string().required(),
        }),
      },
      response: {
        status: {
          200: Joi.object({ projects: Joi.array().required() }),
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const { user_id } = request.query as any;
        const projects = await projectRepository.getInProgressProjectsByUserId(user_id);
        return h.response({ projects }).code(200);
      } catch (err) {
        console.error("GET INPROGRESS PROJECTS ERROR:", err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  {
    method: "GET",
    path: "/v1/projects/completed",
    options: {
      description: "Get completed projects for a user",
      tags: ["api", "project"],
      validate: {
        query: Joi.object({
          user_id: Joi.string().required(),
        }),
      },
      response: {
        status: {
          200: Joi.object({ projects: Joi.array().required() }),
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const { user_id } = request.query as any;
        const projects = await projectRepository.getCompletedProjectsByUserId(user_id);
        return h.response({ projects }).code(200);
      } catch (err) {
        console.error("GET COMPLETED PROJECTS ERROR:", err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  {
    method: "GET",
    path: "/v1/projects/counts",
    options: {
      description: "Get project counts (total, in-progress, completed) for a user",
      tags: ["api", "project"],
      validate: {
        query: Joi.object({
          user_id: Joi.string().required(),
        }),
      },
      response: {
        status: {
          200: Joi.object({
            total: Joi.number().required(),
            inProgress: Joi.number().required(),
            completed: Joi.number().required(),
          }),
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const { user_id } = request.query as any;
        const counts = await projectRepository.getProjectCountsByUserId(user_id);
        return h.response(counts).code(200);
      } catch (err) {
        console.error("GET PROJECT COUNTS ERROR:", err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  // DETAILS ROUTE (load project data into form)
  {
    method: "GET",
    path: "/v1/projects/{projectId}/details",
    options: {
      description: "Get full project data for editing",
      tags: ["api", "project"],
      validate: {
        params: Joi.object({ projectId: Joi.number().integer().required() }),
      },
    },
    handler: async (request, h) => {
      try {
        const { projectId } = request.params as any;
        const data = await projectRepository.getProjectDetailsForEdit(parseInt(projectId));
        return h.response(data).code(200);
      } catch (err) {
        console.error("GET PROJECT DETAILS ERROR:", err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  // EXCEL EXPORT ROUTE
  {
    method: "GET",
    path: "/v1/projects/{projectId}/export",
    options: {
      description: "Get full project data for XLSX export",
      tags: ["api", "project"],
      validate: {
        params: Joi.object({ projectId: Joi.number().integer().required() }),
      },
    },
    handler: async (request, h) => {
      try {
        const { projectId } = request.params as any;
        const data = await projectRepository.getProjectExportData(parseInt(projectId));
        return h.response(data).code(200);
      } catch (err) {
        console.error("PROJECT EXPORT ERROR:", err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },
];