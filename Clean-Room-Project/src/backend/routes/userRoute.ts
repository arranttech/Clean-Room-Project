import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { userRepository } from "../repositories";

const errorSchema = Joi.object({ error: Joi.string().required() });

export const userRoute: ServerRoute[] = [
  {
    method: "GET",
    path: "/v1/users",
    options: {
      description: "Get users (optionally by user_login_id)",
      tags: ["api", "users"],
      validate: {
        query: Joi.object({
          user_login_id: Joi.number().integer().positive().optional(),
        }),
      },
      response: {
        status: {
          200: Joi.object().unknown(true),
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const { user_login_id } = request.query as { user_login_id?: number };
        if (user_login_id) {
          const result = await userRepository.getUserById(user_login_id);
          return h.response(result).code(200);
        }
        const users = await userRepository.getUsers();
        return h.response({ users }).code(200);
      } catch {
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  {
    method: "POST",
    path: "/v1/users",
    options: {
      description: "Create a new user",
      tags: ["api", "users"],
      validate: {
        payload: Joi.object({
          user_first_name: Joi.string().required(),
          user_last_name: Joi.string().required(),
          user_id: Joi.string().required(),
          user_email_id: Joi.string().email().required(),
          user_address: Joi.string().allow("", null),
          user_phone_home: Joi.string().allow("", null),
          user_phone_work: Joi.string().allow("", null),
          created_by: Joi.string().default("admin"),
          updated_by: Joi.string().default("admin"),
          user_admin_flag: Joi.string().valid("Yes", "No").default("No"),
          customer_ids: Joi.array()
            .items(Joi.number().integer())
            .min(1)
            .required(),
          password: Joi.string().allow("", null),
          status: Joi.string().valid("A", "I").default("A"),
        })
          .unknown(true)
          .required(),
      },
      response: {
        status: {
          201: Joi.object({
            message: Joi.string().required(),
            userId: Joi.number().required(),
          }),
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        console.log("BACKEND RAW PAYLOAD:", request.payload);
        const userLoginId = await userRepository.createUser(request.payload);
        return h
          .response({
            message: "User created successfully",
            userId: userLoginId,
          })
          .code(201);
      } catch (error) {
        console.error("BACKEND ERROR:", error);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  {
    method: "PUT",
    path: "/v1/users/update",
    options: {
      description: "Update user by ID (partial or full)",
      tags: ["api", "users"],
      validate: {
        payload: Joi.object({
          id: Joi.number().integer().positive().required(),
          user_first_name: Joi.string().optional(),
          user_last_name: Joi.string().optional(),
          user_email_id: Joi.string().email().optional(),
          user_address: Joi.string().optional().allow("", null),
          user_phone_home: Joi.string().optional().allow("", null),
          user_phone_work: Joi.string().optional().allow("", null),
          user_admin_flag: Joi.string().valid("Yes", "No").optional(),
          updated_by: Joi.string().optional().default("admin"),
          user_id: Joi.string().optional().allow("", null),
          customer_id: Joi.number().optional().allow(null, 0),
          customer_ids: Joi.array().items(Joi.number().integer()).optional(),
          created_by: Joi.string().optional().allow("", null),
          password: Joi.string().optional().allow("", null),
          status: Joi.string().valid("A", "I").optional().default("A"),
        }).required(),
      },
      response: {
        status: {
          200: Joi.object({ message: Joi.string().required() }),
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const payload = request.payload as any;
        const { id, ...updates } = payload;
        await userRepository.updateUser(Number(id), updates);
        return h.response({ message: "User updated successfully" }).code(200);
      } catch (err) {
        console.error("UPDATE USER ERROR:", err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  {
    method: "PUT",
    path: "/v1/password/update",
    options: {
      description: "Update user password",
      tags: ["api", "users"],
      validate: {
        payload: Joi.object({
          id: Joi.number().integer().positive().required(),
          current_password: Joi.string().required(),
          new_password: Joi.string().min(8).required(),
        }).required(),
      },
      response: {
        status: {
          200: Joi.object({ message: Joi.string().required() }),
          400: Joi.object({ error: Joi.string().required() }),
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const { id, current_password, new_password } = request.payload as any;
        console.log("PASSWORD UPDATE REQUEST — id:", id);
        const success = await userRepository.updatePassword(
          Number(id),
          current_password,
          new_password
        );
        console.log("updatePassword result:", success);
        if (!success) {
          return h
            .response({ error: "Current password is incorrect" })
            .code(400);
        }
        return h
          .response({ message: "Password updated successfully" })
          .code(200);
      } catch (err) {
        console.error("UPDATE PASSWORD ERROR:", err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  {
    method: "GET",
    path: "/v1/users/{user_login_id}",
    options: {
      description: "Fetch single user by user_login_id",
      tags: ["api", "users"],
      validate: {
        params: Joi.object({ user_login_id: Joi.number().required() }),
      },
      response: {
        status: {
          200: Joi.object({
            success: Joi.boolean().required(),
            user: Joi.object().optional(),
          }),
          404: Joi.object({
            success: Joi.boolean().required(),
            message: Joi.string().required(),
          }),
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const user_login_id = Number(request.params.user_login_id);
        if (!user_login_id || isNaN(user_login_id)) {
          return h
            .response({ success: false, message: "Invalid user_login_id" })
            .code(400);
        }
        const result = await userRepository.getUserById(user_login_id);
        if (!result.success)
          return h
            .response({ success: false, message: result.message })
            .code(404);
        return h.response(result).code(200);
      } catch (error) {
        console.error("GET USER ERROR:", error);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  {
    method: "DELETE",
    path: "/v1/users/{user_login_id}",
    options: {
      description: "Set user Inactive — row never deleted",
      tags: ["api", "users"],
      validate: {
        params: Joi.object({ user_login_id: Joi.number().required() }),
      },
      response: {
        status: {
          200: Joi.object({ success: Joi.boolean().required() }),
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const user_login_id = parseInt(request.params.user_login_id, 10);
        const affectedRows = await userRepository.deleteUser(user_login_id);
        if (affectedRows === 0)
          return h.response({ error: "User not found" }).code(404);
        return h.response({ success: true }).code(200);
      } catch {
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },
];
