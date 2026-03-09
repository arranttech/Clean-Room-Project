import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { authRepository } from "../repositories";
import jwt from "jsonwebtoken";

const errorSchema = Joi.object({ error: Joi.string().required() });
const authErrorSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
});
const loginSuccessSchema = Joi.object({
  success: Joi.boolean().required(),
  token: Joi.string().required(),
  user: Joi.object({
    user_login_id: Joi.number().optional(),
    user_id: Joi.string().optional(),
    customer_id: Joi.number().allow(null).optional(),
    name: Joi.string().optional(),
    status: Joi.string().optional(),
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

    // Login route
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
        200: loginSuccessSchema,

        400: Joi.object({
          success: Joi.boolean().required(),
          message: Joi.string().required(),
        }),

        401: Joi.object({
          success: Joi.boolean().required(),
          message: Joi.string().required(),
        }),

        500: Joi.object({
          success: Joi.boolean().required(),
          message: Joi.string().required(),
        }),
      },
    },
  },

  handler: async (request, h) => {
    try {
      const { identifier, password } = request.payload as {
        identifier: string;
        password: string;
      };

      if (!identifier || !password) {
        return h.response({
          success: false,
          message: "Identifier and password are required",
        }).code(400);
      }

      const result = await authRepository.loginUser(identifier, password);

      if (!result.success) {
        return h.response({
          success: false,
          message: result.message,
        }).code(401);
      }
      if (result.user?.status === "I") {
        return h.response({
          success: false,
          message: "User account is inactive"
        }).code(401);
    }

      const token = jwt.sign(
        { user_id: result.user!.user_id },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES || "20m" }
      );

      return h.response({
        success: true,
        token,
        user: result.user,
      }).code(200);

    } catch (err) {
      return h.response({
        success: false,
        message: "Internal server error",
      }).code(500);
    }
  },
},
{
  method: "POST",
  path: "/v1/session/refresh",
  options: {
    auth: false,
    cors: true,
    description: "Refresh session token",
    tags: ["api", "auth"],
    response: {
      status: {
        200: Joi.object({
          success: Joi.boolean().required(),
          message: Joi.string().required(),
          token: Joi.string().required(),
        }),
        401: authErrorSchema,
        500: authErrorSchema,
      },
    },
  },
  handler: async (request, h) => {
    try {
      const rawAuthHeader = request.headers.authorization;
      const authHeader = Array.isArray(rawAuthHeader)
        ? rawAuthHeader[0]
        : rawAuthHeader || "";
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

      if (!token) {
        return h
          .response({ success: false, message: "Unauthorized" })
          .code(401);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      if (!decoded || !decoded.user_id) {
        return h
          .response({ success: false, message: "Invalid or expired token" })
          .code(401);
      }

      const nextToken = jwt.sign(
        { user_id: decoded.user_id },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES || "20m" }
      );

      return h
        .response({
          success: true,
          message: "Session extended",
          token: nextToken,
        })
        .code(200);
    } catch {
      return h
        .response({ success: false, message: "Internal server error" })
        .code(500);
    }
  },
},
];