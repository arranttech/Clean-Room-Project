import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { authRepository, userRepository } from "../repositories";
import jwt from "jsonwebtoken";

const errorSchema = Joi.object({ error: Joi.string().required() });
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
          return h
            .response({
              success: false,
              message: "Identifier and password are required",
            })
            .code(400);
        }

        const result = await authRepository.loginUser(identifier, password);

        if (!result.success) {
          return h
            .response({
              success: false,
              message: result.message,
            })
            .code(401);
        }
        if (result.user?.status === "I") {
          return h
            .response({
              success: false,
              message: "User account is inactive",
            })
            .code(401);
        }

        const token = jwt.sign(
          { user_id: result.user!.user_id },
          process.env.JWT_SECRET!,
          { expiresIn: process.env.JWT_EXPIRES || "20m" },
        );

        return h
          .response({
            success: true,
            token,
            user: result.user,
          })
          .code(200);
      } catch (err) {
        return h
          .response({
            success: false,
            message: "Internal server error",
          })
          .code(500);
      }
    },
  },

    {
    method: "POST",
    path: "/auth/v1/google-login",
    options: { auth: false },
    handler: async (request, h) => {
        try {
        const { access_token } = request.payload as any;

        //console.log("Google access token:", access_token);

        if (!access_token) {
            return h
            .response({
                success: false,
                message: "google authentication failed",
            })
            .code(400);
        }

        const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);

        const googleuser = await response.json();
        const email = googleuser.email;   

        if (!email) {
            return h
            .response({
                success: false,
                message: "Google authentication failed",
            })
            .code(400);
        }

        // 🔎 Check user in database
        const user = await userRepository.getUserByEmail(email);
        console.log("User from DB:", user);

        if (!user.success) {
            return h
            .response({
                success: false,
                message: "User not registered. Contact admin.",
            })
            .code(401);
        }

        if (user.user.status === "I") {
            return h
            .response({
                success: false,
                message: "User account is inactive",
            })
            .code(401);
        }
        

        // 🔑 Create JWT
        const token = jwt.sign(
            { user_id: user.user.user_id },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES || "20m" },
        );

        return h.response({
            success: true,
            token,
            user: {
                user_login_id: user.user.user_login_id,
                user_id: user.user.user_id,
                customer_id: user.user.customer_id,
                name: `${user.user.user_first_name || ""} ${user.user.user_last_name || ""}`.trim(),
                status: user.user.status,
            },
            })
            .code(200);
        } catch (err) {
        return h
            .response({
            success: false,
            message: "Google authentication failed",
            })
            .code(500);
        }
    },
    },
];
