import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { customerRepository } from "../repositories";

const errorSchema = Joi.object({ error: Joi.string().required() });

export const customerRoute: ServerRoute[] = [
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
				const { admin_id } = request.query as { admin_id: string };
				const customers = await customerRepository.getCustomerDetails({
					admin_user_id: admin_id,
				});
				return h.response({ customers }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "POST",
		path: "/v1/customerinfo",
		options: {
			description: "Create a new customer",
			tags: ["api", "customer"],
			validate: {
				payload: Joi.object({
					name: Joi.string().required(),
					email: Joi.string().email().required(),
					admin_user_id: Joi.string().required(),
					// add other fields as required
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
];
