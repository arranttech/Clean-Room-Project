import { ServerRoute } from "@hapi/hapi";
import { profileRepository } from "../repositories";

export const profileRoute: ServerRoute[] = [
    // PROFILES
    {
        method: "GET",
        path: "/v1/profiles",
        handler: async (_request: Request, h: ResponseToolkit) => {
            try {
                const profiles = await profileRepository.getProfiles();
                return h.response({ profiles }).code(200);
            } catch (err) {
                return h.response({ error: "Internal Server Error" }).code(500);
            }
        },
    },
    {
        method: "POST",
        path: "/v1/profiles",
        handler: async (request: Request, h: ResponseToolkit) => {
            try {
                const payload = request.payload as any;
                if (!payload.name) {
                    return h.response({ error: "Profile name is required" }).code(400);
                }
                const profileId = await profileRepository.createProfile(payload);
                return h
                    .response({
                        message: "Profile created successfully",
                        profile_id: profileId,
                    })
                    .code(201);
            } catch (err) {
                console.error("Error creating profile:", err);
                return h.response({ error: "Internal Server Error" }).code(500);
            }
        },
    },
    {
        method: "PUT",
        path: "/v1/profiles/{id}",
        handler: async (request: Request, h: ResponseToolkit) => {
            try {
                const id = Number(request.params.id);
                if (!id) return h.response({ error: "Invalid profile ID" }).code(400);
                const payload = request.payload as any;
                const updated = await profileRepository.updateProfile(id, payload);
                if (!updated)
                    return h.response({ error: "Profile not found" }).code(404);
                return h.response({ message: "Profile updated successfully" }).code(200);
            } catch (err) {
                return h.response({ error: "Internal Server Error" }).code(500);
            }
        },
    },
    {
        method: "DELETE",
        path: "/v1/profiles/{id}",
        handler: async (request: Request, h: ResponseToolkit) => {
            try {
                const id = Number(request.params.id);
                if (!id) return h.response({ error: "Invalid profile ID" }).code(400);

                await profileRepository.deleteProfileDetails(id); // Delete FK references first
                const deleted = await profileRepository.deleteProfile(id);

                if (!deleted)
                    return h.response({ error: "Profile not found" }).code(404);

                return h.response({ message: "Profile deleted successfully" }).code(200);
            } catch (err) {
                return h.response({ error: "Internal Server Error" }).code(500);
            }
        },
    },

    // PROFILE DETAILS (PERMISSIONS)
    {
        method: "GET",
        path: "/v1/profiledetails",
        handler: async (request: Request, h: ResponseToolkit) => {
            try {
                const profile_id = request.query.profile_id
                    ? Number(request.query.profile_id)
                    : undefined;

                if (!profile_id) {
                    return h
                        .response({ error: "profile_id query param required" })
                        .code(400);
                }

                const permissions = await profileRepository.getProfileDetails(profile_id);
                return h.response({ permissions }).code(200);
            } catch (err) {
                return h.response({ error: "Internal Server Error" }).code(500);
            }
        },
    },
    {
        method: "POST",
        path: "/v1/profiledetails",
        handler: async (request: Request, h: ResponseToolkit) => {
            try {
                const payload = request.payload as any;
                const profile_id = payload.profile_id;
                const permissions = payload.permissions;

                if (!profile_id || !permissions) {
                    return h.response({ error: "profile_id and permissions are required" }).code(400);
                }

                await profileRepository.saveProfileDetails(profile_id, permissions);
                return h.response({ message: "Profile details saved successfully" }).code(201);
            } catch (err) {
                console.error("Error saving profile details:", err);
                return h.response({ error: "Internal Server Error" }).code(500);
            }
        },
    },

    // ASSIGN PROFILES (tUserProfiles)
    {
        method: "POST",
        path: "/v1/assign-profile",
        handler: async (request: Request, h: ResponseToolkit) => {
            try {
                const payload = request.payload as any;

                if (!payload.userId || !payload.systemProfileId) {
                    return h.response({ error: "userId and systemProfileId are required" }).code(400);
                }

                const id = await profileRepository.assignProfileToUser(payload);
                return h.response({ message: "Profile assigned to user successfully", insertId: id }).code(201);
            } catch (err) {
                console.error("Error assigning profile:", err);
                return h.response({ error: "Internal Server Error" }).code(500);
            }
        },
    },
    {
        method: "GET",
        path: "/v1/assigned-profiles",
        handler: async (_request: Request, h: ResponseToolkit) => {
            try {
                const assignedProfiles = await profileRepository.getAssignedProfiles();
                return h.response({ assignedProfiles }).code(200);
            } catch (err) {
                console.error("Error fetching assigned profiles:", err);
                return h.response({ error: "Internal Server Error" }).code(500);
            }
        },
    },
]