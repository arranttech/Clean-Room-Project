import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { profileRepository } from "../repositories";

const errorSchema = Joi.object({ error: Joi.string().required() });

export const profileRoute: ServerRoute[] = [
	// =========================
	// GET /v1/profiles
	// =========================
	{
		method: "GET",
		path: "/v1/profiles",
		options: {
			description: "Get all system profiles",
			tags: ["api", "profile"],
			response: {
				status: {
					200: Joi.object({ profiles: Joi.array().required() }),
					500: errorSchema,
				},
			},
		},
		handler: async (_request, h) => {
			try {
				const profiles = await profileRepository.getProfiles();
				return h.response({ profiles }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// =========================
	// POST /v1/profiles
	// =========================
	{
		method: "POST",
		path: "/v1/profiles",
		options: {
			description: "Create a new system profile",
			tags: ["api", "profile"],
			validate: {
				payload: Joi.object({
					name: Joi.string().required(),
					description: Joi.string().allow("").optional(),
					status: Joi.string().valid("Active", "Inactive").optional(),
				}),
			},
			response: {
				status: {
					201: Joi.object({
						message: Joi.string(),
						profile_id: Joi.number().required(),
					}),
					400: errorSchema,
					500: errorSchema,
				},
			},
		},
		handler: async (request, h) => {
			try {
				const profileId = await profileRepository.createProfile(
					request.payload
				);
				return h
					.response({
						message: "Profile created successfully",
						profile_id: profileId,
					})
					.code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// =========================
	// PUT /v1/profiles/{id}
	// =========================
	{
		method: "PUT",
		path: "/v1/profiles/{id}",
		options: {
			description: "Update a system profile",
			tags: ["api", "profile"],
			validate: {
				params: Joi.object({ id: Joi.number().integer().required() }),
				payload: Joi.object({
					name: Joi.string().required(),
					description: Joi.string().allow("").optional(),
					status: Joi.string().valid("Active", "Inactive").optional(),
				}),
			},
			response: {
				status: {
					200: Joi.object({ message: Joi.string() }),
					400: errorSchema,
					404: errorSchema,
					500: errorSchema,
				},
			},
		},
		handler: async (request, h) => {
			try {
				const { id } = request.params as unknown as { id: number };
				const updated = await profileRepository.updateProfile(
					id,
					request.payload
				);
				if (!updated)
					return h.response({ error: "Profile not found" }).code(404);
				return h
					.response({ message: "Profile updated successfully" })
					.code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// =========================
	// GET /v1/profiledetails
	// =========================
	{
		method: "GET",
		path: "/v1/profiledetails",
		options: {
			description: "Get profile permissions by profile_id",
			tags: ["api", "profile"],
			validate: {
				query: Joi.object({ profile_id: Joi.number().integer().required() }),
			},
			response: {
				status: {
					200: Joi.object({ permissions: Joi.object() }),
					400: errorSchema,
					500: errorSchema,
				},
			},
		},
		handler: async (request, h) => {
			try {
				const { profile_id } = request.query as unknown as {
					profile_id: number;
				};
				const permissions = await profileRepository.getProfileDetails(
					profile_id
				);
				return h.response({ permissions }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// =========================
	// POST /v1/profiledetails
	// =========================
	{
		method: "POST",
		path: "/v1/profiledetails",
		options: {
			description: "Save profile permissions",
			tags: ["api", "profile"],
			validate: {
				payload: Joi.object({
					profile_id: Joi.number().integer().required(),
					permissions: Joi.object().pattern(Joi.string(), Joi.string()).required(),
				}),
			},
			response: {
				status: {
					201: Joi.object({ message: Joi.string() }),
					400: errorSchema,
					500: errorSchema,
				},
			},
		},
		handler: async (request, h) => {
			try {
				const { profile_id, permissions } = request.payload as {
					profile_id: number;
					permissions: Record<string, string>;
				};
				await profileRepository.saveProfileDetails(profile_id, permissions);
				return h
					.response({ message: "Profile details saved successfully" })
					.code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// =========================
	// POST /v1/assign-profile
	// =========================
	{
		method: "POST",
		path: "/v1/assign-profile",
		options: {
			description: "Assign a system profile to a user",
			tags: ["api", "profile"],
			validate: {
				payload: Joi.object({
					userId: Joi.string().required(),
					systemProfileId: Joi.number().integer().required(),
				}),
			},
			response: {
				status: {
					201: Joi.object({ message: Joi.string(), insertId: Joi.number() }),
					400: errorSchema,
					500: errorSchema,
				},
			},
		},
		handler: async (request, h) => {
			try {
				const { userId, systemProfileId } = request.payload as {
					userId: string;
					systemProfileId: number;
				};
				const id = await profileRepository.assignProfileToUser({
					user_id: userId,
					system_profile_id: systemProfileId,
				});
				return h
					.response({
						message: "Profile assigned to user successfully",
						insertId: id,
					})
					.code(201);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},

	// =========================
	// GET /v1/assigned-profiles
	// =========================
	{
		method: "GET",
		path: "/v1/assigned-profiles",
		options: {
			description: "Get all assigned profiles",
			tags: ["api", "profile"],
			response: {
				status: {
					200: Joi.object({ assignedProfiles: Joi.array() }),
					500: errorSchema,
				},
			},
		},
		handler: async (_request, h) => {
			try {
				const assignedProfiles = await profileRepository.getAssignedProfiles();
				return h.response({ assignedProfiles }).code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
	// =========================
	// DELETE /v1/assigned-profiles/{id}
	// =========================
	{
		method: "DELETE",
		path: "/v1/assigned-profiles/{id}",
		options: {
			description: "Delete an assigned profile",
			tags: ["api", "profile"],
			validate: {
				params: Joi.object({ id: Joi.number().integer().required() }),
			},
			response: {
				status: {
					200: Joi.object({ message: Joi.string() }),
					404: errorSchema,
					500: errorSchema,
				},
			},
		},
		handler: async (request, h) => {
			try {
				const { id } = request.params as unknown as { id: number };
				const deleted = await profileRepository.deleteAssignedProfile(id);
				if (!deleted)
					return h.response({ error: "Assigned profile not found" }).code(404);
				return h
					.response({ message: "Assigned profile deleted successfully" })
					.code(200);
			} catch {
				return h.response({ error: "Internal Server Error" }).code(500);
			}
		},
	},
];
