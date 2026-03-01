import { ServerRoute } from "@hapi/hapi";
import { customerRepository } from "../repositories";

export const customerRoute: ServerRoute[] = [
	{
		method: "GET",
		path: "/v1/customers",
		handler: async (request, h) => {
			try {
				const adminId =
					typeof request.query.admin_id === "string"
						? request.query.admin_id
						: "lnredd";

				const customers = await customerRepository.getCustomerDetails({
					admin_user_id: adminId,
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
