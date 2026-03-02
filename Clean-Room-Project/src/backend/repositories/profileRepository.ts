import { database } from "../dbConnection/connections";

export const profileRepository = {
    // Get Profiles
    getProfiles: async () => {
        try {
            const [profiles]: any = await database.execute(
                `SELECT * FROM tSystemProfiles ORDER BY system_profile_id DESC`
            );
            return profiles.map((p: any) => ({
                id: p.system_profile_id.toString(),
                name: p.system_profile_name,
                description: p.system_profile_description || "",
                status: p.system_profile_status === "ACTIVE" ? "Active" : "In Progress",
                created: p.created_date ? p.created_date.toISOString().split("T")[0] : "",
            }));
        } catch (err) {
            console.error("Error in getProfiles:", err);
            throw err;
        }
    },

    // Get Profile Details (Permissions) by Profile ID
    getProfileDetails: async (profileId: number) => {
        try {
            const [details]: any = await database.execute(
                `SELECT d.system_profile_id, s.screen_name, d.profile_access_right 
				 FROM tSystemProfileDetails d
				 JOIN tSystemScreens s ON d.screen_id = s.screen_id
                 WHERE d.system_profile_id = ?`,
                [profileId]
            );

            // Format
            const permissions: Record<string, string> = {};
            details.forEach((row: any) => {
                let uiPerm = "None";
                if (row.profile_access_right === "FULL") uiPerm = "Full Access";
                if (row.profile_access_right === "READ") uiPerm = "Read Only";
                permissions[row.screen_name] = uiPerm;
            });

            return permissions;
        } catch (err) {
            console.error("Error in getProfileDetails:", err);
            throw err;
        }
    },

    // Create Profile
    createProfile: async (payload: any) => {
        try {
            const status = payload.status === "Active" ? "ACTIVE" : "INACTIVE";
            const [insertResult]: any = await database.execute(
                `INSERT INTO tSystemProfiles (system_profile_name, system_profile_description, system_profile_status, created_by, updated_by)
				 VALUES (?, ?, ?, ?, ?)`,
                [payload.name, payload.description, status, "admin", "admin"]
            );
            return insertResult.insertId;
        } catch (err) {
            console.error("Error in createProfile:", err);
            throw err;
        }
    },

    // Update Profile
    updateProfile: async (id: number, payload: any) => {
        try {
            const status = payload.status === "Active" ? "ACTIVE" : "INACTIVE";
            const [result]: any = await database.execute(
                `UPDATE tSystemProfiles 
				 SET system_profile_name = ?, system_profile_description = ?, system_profile_status = ?, updated_by = ?, updated_date = CURRENT_TIMESTAMP 
				 WHERE system_profile_id = ?`,
                [payload.name, payload.description, status, "admin", id]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error("Error in updateProfile:", err);
            throw err;
        }
    },

    // Delete Profile
    deleteProfile: async (id: number) => {
        try {
            const [result]: any = await database.execute(
                `DELETE FROM tSystemProfiles WHERE system_profile_id = ?`,
                [id]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error("Error in deleteProfile:", err);
            throw err;
        }
    },

    // Bulk Insert/Update permissions
    saveProfileDetails: async (profileId: number, permissionsValueMap: Record<string, string>) => {
        const connection = await database.getConnection();
        try {
            await connection.beginTransaction();

            // Get all available screens
            const [screens]: any = await connection.execute(
                `SELECT screen_id, screen_name FROM tSystemScreens`
            );

            // Get existing details for this profile
            const [existingDetails]: any = await connection.execute(
                `SELECT screen_id FROM tSystemProfileDetails WHERE system_profile_id = ?`,
                [profileId]
            );

            const existingScreenIds = new Set(existingDetails.map((d: any) => d.screen_id));

            if (Object.keys(permissionsValueMap).length > 0 && screens.length > 0) {
                for (const screen of screens) {
                    const uiPerm = permissionsValueMap[screen.screen_name] || "None";
                    let dbPerm = "NONE";
                    if (uiPerm === "Full Access") dbPerm = "FULL";
                    if (uiPerm === "Read Only") dbPerm = "READ";

                    if (existingScreenIds.has(screen.screen_id)) {
                        // UPDATE existing row to preserve system_profile_detail_id
                        await connection.execute(
                            `UPDATE tSystemProfileDetails 
                             SET profile_access_right = ?, updated_by = ?, updated_date = CURRENT_TIMESTAMP
                             WHERE system_profile_id = ? AND screen_id = ?`,
                            [dbPerm, "admin", profileId, screen.screen_id]
                        );
                    } else {
                        // INSERT new row if it didn't exist
                        await connection.execute(
                            `INSERT INTO tSystemProfileDetails (system_profile_id, screen_id, profile_access_right, created_by, updated_by)
                             VALUES (?, ?, ?, ?, ?)`,
                            [profileId, screen.screen_id, dbPerm, "admin", "admin"]
                        );
                    }
                }
            }

            await connection.commit();
            return true;
        } catch (err) {
            await connection.rollback();
            console.error("Error saving profile details:", err);
            throw err;
        } finally {
            connection.release();
        }
    },

    // Delete Profile Details
    deleteProfileDetails: async (profileId: number) => {
        try {
            const [result]: any = await database.execute(
                `DELETE FROM tSystemProfileDetails WHERE system_profile_id = ?`,
                [profileId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting profile details:", error);
            throw error;
        }
    },

    // Assign Profile to User
    assignProfileToUser: async (payload: any) => {
        try {
            const { userId, systemProfileId, createdBy, updatedBy } = payload;
            const [result]: any = await database.execute(
                `INSERT INTO tUserProfiles (user_id, system_profile_id, created_by, updated_by)
                 VALUES (?, ?, ?, ?)`,
                [userId, systemProfileId, createdBy || "system", updatedBy || "system"]
            );
            return result.insertId;
        } catch (error) {
            console.error("Error assigning profile to user:", error);
            throw error;
        }
    },

    // Get Assigned Profiles
    getAssignedProfiles: async () => {
        try {
            const [rows]: any = await database.execute(
                `SELECT 
                    up.user_profile_id as id,
                    u.user_first_name,
                    u.user_last_name,
                    p.system_profile_name as profileName,
                    up.created_date as createdAt
                 FROM tUserProfiles up
                 JOIN tUsers u ON up.user_id = u.user_id
                 JOIN tSystemProfiles p ON up.system_profile_id = p.system_profile_id
                 ORDER BY up.created_date DESC`
            );
            return rows.map((row: any) => ({
                id: row.id.toString(),
                userName: `${row.user_first_name} ${row.user_last_name}`.trim(),
                profileName: row.profileName,
                createdAt: row.createdAt
            }));
        } catch (error) {
            console.error("Error fetching assigned profiles:", error);
            throw error;
        }
    }
};
