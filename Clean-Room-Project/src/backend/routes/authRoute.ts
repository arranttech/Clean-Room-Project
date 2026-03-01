import { ServerRoute } from "@hapi/hapi";
import { authRepository } from "../repositories";

export const authRoute: ServerRoute[] = [
	{
		method: "POST",
		path: "/v1/userpassword",
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;

				if (!payload.user_login_id || !payload.password) {
					return h
						.response({
							error: "user_login_id and password are required",
						})
						.code(400);
				}

				await authRepository.createUserPassword(payload);

				return h.response({ message: "Password saved successfully" }).code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "POST",
		path: "/v1/login",
		options: { auth: false, cors: true },
		handler: async (req: any, h: any) => {
			try {
				const { identifier, password } = req.payload;

				if (!identifier || !password) {
					return h
						.response({
							success: false,
							message: "User ID/Email and password are required",
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

				return h
					.response({
						success: true,
						message: "Login successful",
						user: result.user,
					})
					.code(200);
			} catch {
				return h
					.response({
						success: false,
						message: "Internal server error",
					})
					.code(500);
			}
		},
	},
];
