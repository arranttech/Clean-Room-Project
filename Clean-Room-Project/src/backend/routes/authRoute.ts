import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { authRepository } from "../repositories";

const errorSchema = Joi.object({ error: Joi.string().required() });
const authErrorSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
  user: Joi.object({
    user_login_id: Joi.number().optional(),
    user_id: Joi.string().optional(),
    customer_id: Joi.number().allow(null).optional(),
    name: Joi.string().optional(),
  }).optional(),
});

export const authRoute: ServerRoute[] = [
  // Create user password
  {
    method: "POST",
    path: "/v1/userpassword",
    options: {
      description: "Create or update a user's password",
      tags: ["api", "auth"],
      validate: {
        payload: Joi.object({
          user_login_id: Joi.number().integer().positive().required(), // was Joi.string() — caused password to save with wrong ID
          password: Joi.string().required(),
        }),
      },
      response: {
        status: {
          201: Joi.object({ message: Joi.string().required() }),
          400: errorSchema,
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const payload = request.payload as any;
        await authRepository.createUserPassword(payload);
        return h.response({ message: "Password saved successfully" }).code(201);
      } catch {
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  // User login
  {
    method: "POST",
    path: "/v1/login",
    options: {
      auth: false,
      cors: true,
      description: "User login endpoint",
      tags: ["api", "auth"],
      validate: {
        payload: Joi.object({
          identifier: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
      response: {
        status: {
          200: authErrorSchema,
          400: authErrorSchema,
          401: authErrorSchema,
          500: authErrorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const { identifier, password } = request.payload as any;
        const result = await authRepository.loginUser(identifier, password);

        if (!result.success) {
          return h.response({ success: false, message: result.message }).code(401);
        }

        return h
          .response({ success: true, message: "Login successful", user: result.user })
          .code(200);
      } catch {
        return h.response({ success: false, message: "Internal server error" }).code(500);
      }
    },
  },
];