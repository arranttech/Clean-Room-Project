import { database } from "../dbConnection/connections";
import bcrypt from "bcrypt";

export const ApplicationRepository = {
	loginUser: async (identifier: string, password: string) => {
		try {
			// Call stored procedure
			const [resultSets]: any = await database.execute(
				"CALL new_cleanroom_db.UserLoginDetail(?)",
				[identifier]
			);

			// Stored procedures return results in resultSets[0]
			const rows = resultSets[0];

			if (!rows || rows.length === 0) {
				return { success: false, message: "Account does not exist" };
			}

			const user = rows[0];

			if (!user.user_password) {
				return { success: false, message: "Password not found" };
			}

			let valid = false;

			if (user.user_password.startsWith("$2")) {
				// hashed password
				valid = await bcrypt.compare(password, user.user_password);
			} else {
				// plain text password
				valid = password === user.user_password;
			}

			if (!valid) {
				return { success: false, message: "Invalid credentials" };
			}

			return {
				success: true,
				user: {
					user_login_id: user.user_login_id,
					user_id: user.user_id,
					name: `${user.user_first_name || ""} ${
						user.user_last_name || ""
					}`.trim(),
				},
			};
		} catch (err) {
			console.error("Error in loginUser:", err);
			throw err;
		}
	},

	createUser: async (payload: any) => {
		try {
			const [result] = await database.execute(
				`INSERT INTO tUsers (
       
        user_first_name,
        user_last_name,
        user_id,
        user_email_id,
        user_address,
        user_phone_home,
        user_phone_work,
        
        created_by,
        updated_by,
        
        user_admin_flag,
        customer_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					//payload.user_login_id || null,
					payload.user_first_name,
					payload.user_last_name,
					payload.user_id || null,
					payload.user_email_id,
					payload.user_address || null,
					payload.user_phone_home || null,
					payload.user_phone_work || null,
					//	payload.created_date || new Date().toISOString().split("T")[0],
					payload.created_by || "admin",
					payload.updated_by || "admin",
					//	payload.update_date || new Date().toISOString().split("T")[0],
					payload.user_admin_flag || "No",
					payload.customer_id || null,
				]
			);

			return (result as any).insertId;
		} catch (err) {
			console.error("Error in createUser:", err);
			throw err;
		}
	},

	getUsers: async () => {
		try {
			const [rows] = await database.execute(`
      SELECT 
        user_login_id,
        user_first_name,
        user_last_name,
        user_email_id,
		user_id AS user_id,                            
        user_address,
        user_phone_home,
        user_phone_work,
        created_date,
        created_by,
        updated_date,
        updated_by,
        user_admin_flag,
        customer_id
      FROM tUsers
    `);

			return rows;
		} catch (err) {
			console.error("Error in getUsers:", err);
			throw err;
		}
	},

	deleteUser: async (user_login_id: number) => {
		try {
			const [result]: any = await database.execute(
				`DELETE FROM tUsers WHERE user_login_id = ?`,
				[user_login_id]
			);

			// result.affectedRows tells if a row was deleted
			return result.affectedRows > 0;
		} catch (err) {
			console.error("Error deleting user:", err);
			throw err;
		}
	},

	getUserDetails: async (payload?: { admin_id?: string }) => {
		try {
			let query = `SELECT * FROM tUsers`;

			const params: any[] = [];

			if (payload?.admin_id) {
				query += ` WHERE admin_id = ?`;
				params.push(payload.admin_id);
			}

			const [result] = await database.execute(query, params);
			return result;
		} catch (err) {
			console.error("Error in getCustomerDetails:", err);
			throw err;
		}
	},

	getAllInputs: async (payload?: { room_id?: number }) => {
		try {
			let query = `SELECT * FROM tInputValue`;
			const params: any[] = [];

			if (payload?.room_id) {
				query += ` WHERE RoomId = ?`;
				params.push(payload.room_id);
			}

			const [result] = await database.execute(query, params);
			return result;
		} catch (err) {
			console.error("Error in getCustomerDetails:", err);
			throw err;
		}
	},

	// Get all customers
	getCustomerDetails: async (payload?: { admin_user_id?: string }) => {
		try {
			let query = `SELECT * FROM tCustomers`;
			const params: any[] = [];

			if (payload?.admin_user_id) {
				query += ` WHERE admin_user_id = ?`;
				params.push(payload.admin_user_id);
			}

			const [result] = await database.execute(query, params);
			return result;
		} catch (err) {
			console.error("Error in getCustomerDetails:", err);
			throw err;
		}
	},

	// Create a new customer/application
	createCustomer: async (payload: any) => {
		try {
			// Fallback customer ID
			const adminUserId = "lnredd";
			const admin_user_id = payload.admin_user_id || adminUserId;
			const [result] = await database.execute(
				`INSERT INTO tCustomers 
          (admin_user_id, customer_name, customer_phone, customer_address, customer_email_id,customers_additional_notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
				[
					payload.admin_user_id || admin_user_id,
					payload.customerName,
					payload.phoneNumber,
					payload.customerAddress,
					payload.emailAddress,
					payload.additionalNotes,
				]
			);

			return (result as any).insertId; // insertId from MySQL
		} catch (err) {
			console.error("Error in createApplication:", err);
			throw err;
		}
	},

	createProject: async (payload: any) => {
		try {
			// Check if the customer exists
			const [customer]: any = await database.execute(
				`SELECT customer_id FROM tCustomers WHERE customer_id = ?`,
				[payload.customer_id]
			);

			if (!customer.length) {
				throw new Error(
					`Customer ID ${payload.customer_id} does not exist in tCustomers`
				);
			}

			// Insert project
			const [result] = await database.execute(
				`INSERT INTO tProjects
          (
            customer_id,
            project_unique_id,
            project_name,
            project_unit_branch,
            project_Industry,
            project_Handling,
            project_Location,
            project_max_temp,
            project_min_temp,
            project_relative_min_humid,
            project_relative_max_humid
          )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					payload.customer_id,
					payload.uniqueId,
					payload.projectName,
					payload.unitBranch,
					JSON.stringify(payload.industry),
					JSON.stringify(payload.handling),
					payload.selectedLocation?.display_name ||
						payload.selectedLocation ||
						"",
					parseFloat(payload.maxTemp),
					parseFloat(payload.minTemp),
					parseFloat(payload.relativeHumidityMin),
					parseFloat(payload.relativeHumidityMax),
				]
			);

			console.log("Create Project Result:", result);

			// FIX: return insertId directly — avoids race condition when uniqueId has duplicates
			return (result as any).insertId;
		} catch (error) {
			console.error("Create Project Error:", error);
			throw error;
		}
	},

	// ZONE
	createProjectZone: async (payload: any) => {
		try {
			const [result] = await database.execute(
				`INSERT INTO tProjectZones
          (
            project_id,
            zone_name
          )
        VALUES (?, ?)`,
				[payload.project_id, payload.zone_name || "Zone 001"]
			);

			// Return the actual insertId of the newly created zone
			return (result as any).insertId;
		} catch (err) {
			console.error("Error in createZone:", err);
			throw err;
		}
	},

	// ROOM STANDARDS
	createRoomStandards: async (payload: any) => {
		try {
			const [result] = await database.execute(
				`INSERT INTO tRoomStandards 
          (
            project_id,
            project_system,
            project_system_type,
            project_heating_method,
            project_cooling_method,
            project_standard,
            project_classification_name,
            project_ACPH,
            project_temp_unit,
            project_required_inside_temp,
            project_required_inside_humid,
            project_max_temp,
            project_min_temp,
            project_relative_min_humid,
            project_relative_max_humid,
            flow_velocity
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					payload.project_id,
					payload.system ?? null,
					payload.systemType ?? null,
					payload.heatingMethod ?? null,
					payload.coolingMethod ?? null,
					payload.standard ?? null,
					payload.classification ?? null,
					payload.acph ?? null,
					payload.tempUnit ?? null,
					payload.reqInsideTempC ?? null,
					payload.reqInsideHum ?? null,
					payload.maxTempC ?? null,
					payload.minTempC ?? null,
					payload.rhMin ?? null,
					payload.rhMax ?? null,
					payload.flowVelocity ?? null,
				]
			);

			return (result as any).insertId;
		} catch (err) {
			console.error("Error in roomStandards:", err);
			throw err;
		}
	},

	//ZONE ROOMS

	createZoneRooms: async (payload: any) => {
		try {
			const [result] = await database.execute(
				`INSERT INTO tZoneRooms 
					(
						zone_id,
						project_standard_id,
						project_RoomName,
						room_Length,
						room_Width,
						room_Height,
						room_Occupancy,
						room_Equipment_Load,
						room_Lighting,
						room_Infiltrations,
						room_FreshAir,
						room_ExhaustAir,
						project_ACPH
					)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					payload.zone_id ?? null,
					payload.projectStandardId ?? null,
					payload.roomName ?? null,
					payload.length ?? null,
					payload.width ?? null,
					payload.height ?? null,
					payload.occupancy ?? null,
					payload.equipmentLoad ?? null,
					payload.lightingLoad ?? null,
					payload.infiltrationsPerHour ?? null,
					payload.freshAirPercent ?? null,
					payload.exhaustAir ?? null,
					payload.selectedAcph ?? null,
				]
			);

			return (result as any).insertId;
		} catch (err) {
			console.error("Error in zoneRooms:", err);
			throw err;
		}
	},

	//RESULTS
	storeResults: async (payload: any) => {
		try {
			const [result] = await database.execute(
				`INSERT INTO tProjectResults (
					project_id,
					project_RoomName,
					project_RoomId,
					project_Area,
					project_Volume,
					project_RoomCfm,
					project_FreshAir,
					project_ExhaustAir
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					payload.project_id,
					payload.roomName ?? null,
					payload.project_RoomId,
					payload.project_Area ?? null,
					payload.project_Volume ?? null,
					payload.project_RoomCfm ?? null,
					payload.project_FreshAir ?? null,
					payload.project_ExhaustAir ?? null,
				]
			);

			return (result as any).insertId;
		} catch (err) {
			console.error("Error storing project room results:", err);
			throw err;
		}
	},

	// GET single customer — CustomerInfoPage useEffect

	getCustomerById: async (customer_id: number) => {
		try {
			const [rows]: any = await database.execute(
				`SELECT * FROM tCustomers WHERE customer_id = ? LIMIT 1`,
				[customer_id]
			);
			return rows[0] || null;
		} catch (err) {
			console.error("Error in getCustomerById:", err);
			throw err;
		}
	},

	// GET
	getProjectByCustomerId: async (customer_id: number) => {
		try {
			const [rows]: any = await database.execute(
				`SELECT * FROM tProjects WHERE customer_id = ? ORDER BY project_id DESC LIMIT 1`,
				[customer_id]
			);
			return rows[0] || null;
		} catch (err) {
			console.error("Error in getProjectByCustomerId:", err);
			throw err;
		}
	},

	// GET
	getRoomStandards: async (payload?: { project_id?: number }) => {
		try {
			let query = `SELECT * FROM tRoomStandards`;
			const params: any[] = [];
			if (payload?.project_id) {
				query += ` WHERE project_id = ? ORDER BY project_standard_id DESC`;
				params.push(payload.project_id);
			}
			const [result] = await database.execute(query, params);
			return result;
		} catch (err) {
			console.error("Error in getRoomStandards:", err);
			throw err;
		}
	},

	// GET
	getZoneRooms: async (payload?: { zone_id?: number }) => {
		try {
			let query = `SELECT * FROM tZoneRooms`;
			const params: any[] = [];
			if (payload?.zone_id) {
				query += ` WHERE zone_id = ?`;
				params.push(payload.zone_id);
			}
			const [result] = await database.execute(query, params);
			return result;
		} catch (err) {
			console.error("Error in getZoneRooms:", err);
			throw err;
		}
	},

	getCustomerInfo: async (user_login_id: number) => {
		try {
			const [resultSets]: any = await database.execute(
				"CALL new_cleanroom_db.CustomerInfoDetail(?)",
				[user_login_id]
			);

			const rows = resultSets[0];

			if (!rows || rows.length === 0) {
				return {
					success: false,
					message: "Customer profile not found",
				};
			}

			const customer = rows[0];

			return {
				success: true,
				customer: {
					customer_id: customer.customer_id,
					customer_name: customer.customer_name,
					customer_phone: customer.customer_phone,
					customer_address: customer.customer_address,
					customer_email_id: customer.customer_email_id,
					customers_addional_notes: customer.customers_addional_notes,
				},
			};
		} catch (err) {
			console.error("Error in getCustomerInfo:", err);
			throw err;
		}
	},
};
