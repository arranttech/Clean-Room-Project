import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { customerRepository } from "../repositories";

const errorSchema = Joi.object({ error: Joi.string().required() });

export const customerRoute: ServerRoute[] = [
  // GET all customers
  {
    method: "GET",
    path: "/v1/customers",
    options: {
      description: "Fetch customers by admin user ID",
      tags: ["api", "customer"],
      validate: {
        query: Joi.object({
          admin_id: Joi.string().default("lnredd").optional(),
        }),
      },
      response: {
        status: {
          200: Joi.object({ customers: Joi.array().required() }),
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const customers = await customerRepository.getCustomerDetails();
        return h.response({ customers }).code(200);
      } catch {
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  // GET customer by user_login_id — MUST be before /v1/customers/{customer_id}
  // otherwise Hapi matches "user" as a customer_id param
  {
    method: "GET",
    path: "/v1/customers/user/{user_login_id}",
    options: {
      description: "Fetch customer details by user_login_id",
      tags: ["api", "customer"],
      validate: {
        params: Joi.object({ user_login_id: Joi.number().required() }),
      },
      response: {
        status: {
          200: Joi.object({
            success: Joi.boolean().required(),
            customer: Joi.object().optional(),
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
        const user_login_id = parseInt(request.params.user_login_id, 10);
        const result = await customerRepository.getCustomerInfo(user_login_id);
        if (!result.success)
          return h
            .response({ success: false, message: result.message })
            .code(404);
        return h.response(result).code(200);
      } catch {
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  // GET single customer by customer_id
  {
    method: "GET",
    path: "/v1/customers/{customer_id}",
    options: {
      description: "Fetch single customer by ID",
      tags: ["api", "customer"],
      validate: {
        params: Joi.object({ customer_id: Joi.number().required() }),
      },
      response: {
        status: {
          200: Joi.object({ customer: Joi.object().required() }),
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const customer_id = parseInt(request.params.customer_id, 10);
        const customer = await customerRepository.getCustomerById(customer_id);
        if (!customer)
          return h.response({ error: "Customer not found" }).code(404);
        return h.response({ customer }).code(200);
      } catch {
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  // POST create customer
  {
    method: "POST",
    path: "/v1/customerinfo",
    options: {
      description: "Create a new customer",
      tags: ["api", "customer"],
      validate: {
        payload: Joi.object({
          customerName: Joi.string().required(),
          phoneNumber: Joi.string().optional().allow(""),
          customerAddress: Joi.string().optional().allow(""),
          emailAddress: Joi.string()
            .email({ tlds: { allow: false } })
            .optional()
            .allow(""),
          additionalNotes: Joi.string().optional().allow(""),
          status: Joi.string().valid("A", "I").default("A"),
          admin_user_id: Joi.string().optional(),
        }),
      },
      response: {
        status: {
          201: Joi.object({ applicationId: Joi.number().required() }),
          500: errorSchema,
        },
      },
    },
    handler: async (request, h) => {
      try {
        const payload = request.payload as any;
        const id = await customerRepository.createCustomer(payload);
        return h.response({ applicationId: id }).code(201);
      } catch {
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  // PUT update customer
  {
    method: "PUT",
    path: "/v1/customers/{customer_id}",
    options: {
      description: "Update existing customer",
      tags: ["api", "customer"],
      validate: {
        params: Joi.object({ customer_id: Joi.number().required() }),
        payload: Joi.object({
          customerName: Joi.string().required(),
          phoneNumber: Joi.string().optional().allow(""),
          customerAddress: Joi.string().optional().allow(""),
          emailAddress: Joi.string()
            .email({ tlds: { allow: false } })
            .optional()
            .allow(""),
          additionalNotes: Joi.string().optional().allow(""),
          status: Joi.string().valid("A", "I").default("A"),
        }),
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
        const customer_id = parseInt(request.params.customer_id, 10);
        const payload = request.payload as any;
        const affectedRows = await customerRepository.updateCustomer(
          customer_id,
          payload
        );
        if (affectedRows === 0)
          return h.response({ error: "Customer not found" }).code(404);
        return h.response({ success: true }).code(200);
      } catch {
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  // DELETE (soft) customer
  {
    method: "DELETE",
    path: "/v1/customers/{customer_id}",
    options: {
      description: "Set customer Inactive — row never deleted",
      tags: ["api", "customer"],
      validate: {
        params: Joi.object({ customer_id: Joi.number().required() }),
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
        const customer_id = parseInt(request.params.customer_id, 10);
        const affectedRows = await customerRepository.deleteCustomer(
          customer_id
        );
        if (affectedRows === 0)
          return h.response({ error: "Customer not found" }).code(404);
        return h.response({ success: true }).code(200);
      } catch {
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },
];
