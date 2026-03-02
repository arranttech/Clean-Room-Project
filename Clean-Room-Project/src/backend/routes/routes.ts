import { ServerRoute, Request, ResponseToolkit } from "@hapi/hapi";

import {
	authRepository,
	userRepository,
	customerRepository,
	projectRepository,
	zoneRepository,
	roomRepository,
	resultRepository,
	inputRepository,
	screenRepository,
} from "../repositories";

import { airflowService, RoomPayload } from "../services/service";
import { cumulativeZoneService } from "../services/cummulativecal";
import { boqresults, BOQPayload } from "../services/boqresults";

const applicationRoutes: ServerRoute[] = [
	{
		method: "GET",
		path: "/",
		handler: () => {
			return "API is running!";
		},
	},

	// INPUTS
	{
		method: "GET",
		path: "/v1/alldetails",
		handler: async (request: Request, h: ResponseToolkit) => {
			try {
				const room_id =
					typeof request.query.room_id === "number" ? request.query.room_id : 8;

				const roomdetails = await inputRepository.getAllInputs({
					room_id,
				});

				return h.response({ roomdetails }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// USERS
	{
		method: "GET",
		path: "/v1/users",
		handler: async (_, h) => {
			try {
				const users = await userRepository.getUsers();
				return h.response({ users }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "DELETE",
		path: "/v1/users/{id}",
		handler: async (request, h) => {
			try {
				const id = Number(request.params.id);
				if (!id) return h.response({ error: "Invalid user ID" }).code(400);

				const deleted = await userRepository.deleteUser(id);

				if (!deleted) return h.response({ error: "User not found" }).code(404);

				return h.response({ message: "User deleted successfully" }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "POST",
		path: "/v1/users",
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				const userLoginId = await userRepository.createUser(payload);

				return h
					.response({
						message: "User created successfully",
						userId: userLoginId,
					})
					.code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

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

	// CUSTOMERS
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
		method: "GET",
		path: "/v1/customerinfo",
		handler: async (request, h) => {
			try {
				const customer_id = request.query.customer_id
					? Number(request.query.customer_id)
					: undefined;

				if (!customer_id) {
					return h
						.response({ error: "customer_id query param required" })
						.code(400);
				}

				const customer = await customerRepository.getCustomerById(customer_id);

				if (!customer)
					return h.response({ error: "Customer not found" }).code(404);

				return h.response({ customer }).code(200);
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

	// PROJECT
	{
		method: "GET",
		path: "/v1/projectinfo",
		handler: async (request, h) => {
			try {
				const customer_id = request.query.customer_id
					? Number(request.query.customer_id)
					: undefined;

				if (!customer_id) {
					return h
						.response({ error: "customer_id query param required" })
						.code(400);
				}

				const project = await projectRepository.getProjectByCustomerId(
					customer_id
				);

				return h.response({ project: project || null }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "POST",
		path: "/v1/projectinfo",
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				const projectId = await projectRepository.createProject(payload);

				return h.response({ projectId }).code(201);
			} catch (err) {
				console.error("Failed to save project info:", err);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// ROOM STANDARDS
	{
		method: "GET",
		path: "/v1/roomstandards",
		handler: async (request, h) => {
			try {
				const project_id = request.query.project_id
					? Number(request.query.project_id)
					: undefined;

				const standards = await roomRepository.getRoomStandards({
					project_id,
				});

				return h.response({ standards }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "POST",
		path: "/v1/roomstandards",
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				const id = await roomRepository.createRoomStandards(payload);

				return h.response({ roomStandardsId: id }).code(201);
			} catch (err) {
				console.error("Failed to save room standards:", err);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// ZONES
	{
		method: "POST",
		path: "/v1/projectzones",
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				const zoneId = await zoneRepository.createProjectZone(payload);

				return h.response({ zoneId }).code(201);
			} catch (err) {
				console.error("Failed to create project zone:", err);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "GET",
		path: "/v1/zonerooms",
		handler: async (request, h) => {
			try {
				const zone_id = request.query.zone_id
					? Number(request.query.zone_id)
					: undefined;

				const rooms = await roomRepository.getZoneRooms({ zone_id });

				return h.response({ rooms }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	{
		method: "POST",
		path: "/v1/zonerooms",
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				const id = await roomRepository.createZoneRooms(payload);

				return h.response({ zoneRoomsId: id }).code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// STORE RESULTS
	{
		method: "POST",
		path: "/v1/storeresults",
		handler: async (request, h) => {
			try {
				const payload = request.payload as any;
				const resultId = await resultRepository.storeResults(payload);

				return h.response({ resultId }).code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// CUSTOMER BY USER LOGIN
	{
		method: "GET",
		path: "/v1/customers/user/{user_login_id}",
		handler: async (request, h) => {
			try {
				const user_login_id = Number(request.params.user_login_id);

				if (isNaN(user_login_id)) {
					return h
						.response({
							success: false,
							message: "Invalid user_login_id",
						})
						.code(400);
				}

				const result = await customerRepository.getCustomerInfo(user_login_id);

				if (!result.success) return h.response(result).code(404);

				return h.response(result).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// LOGIN
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

	// AIRFLOW
	{
		method: "POST",
		path: "/v1/airflow",
		handler: async (request, h) => {
			try {
				const payload = request.payload as RoomPayload;
				const result = airflowService(payload);
				return h.response(result).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// CUMULATIVE
	{
		method: "POST",
		path: "/v1/columncummaltion",
		handler: async (request, h) => {
			try {
				const { zoneName, rooms } = request.payload as any;
				const result = cumulativeZoneService(zoneName, rooms);
				return h.response(result).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// BOQ
	{
		method: "POST",
		path: "/v1/boqresults",
		handler: async (request, h) => {
			try {
				const payload = request.payload as BOQPayload;
				const result = boqresults(payload);
				return h.response(result).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	{
		method: "POST",
		path: "/v1/screens",
		handler: async (request: Request, h: ResponseToolkit) => {
			try {
				const payload = request.payload as any;

				if (!payload.name) {
					return h.response({ error: "Screen name is required" }).code(400);
				}

				const screenId = await screenRepository.createScreen(payload);

				return h
					.response({
						message: "Screen created successfully",
						screen_id: screenId, // returning auto ID
					})
					.code(201);
			} catch (err) {
				console.error("Error creating screen:", err);
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	{
		method: "PUT",
		path: "/v1/screens/{id}",
		handler: async (request: Request, h: ResponseToolkit) => {
			try {
				const id = Number(request.params.id);
				if (!id) return h.response({ error: "Invalid screen ID" }).code(400);
				const payload = request.payload as any;
				const updated = await screenRepository.updateScreen(id, payload);
				if (!updated)
					return h.response({ error: "Screen not found" }).code(404);
				return h.response({ message: "Screen updated successfully" }).code(200);
			} catch (err) {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	{
		method: "GET",
		path: "/v1/screens",
		handler: async (_request: Request, h: ResponseToolkit) => {
			try {
				const screens = await screenRepository.getScreens();
				return h.response({ screens }).code(200);
			} catch (err) {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
]