import { database } from "../dbConnection/connections";

export const ApplicationRepository = {


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
	// repository.ts
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
			// Fallback customer ID
			const fallbackCustomerId = "1001";

			const customer_id = payload.customer_id || fallbackCustomerId;

			// Check if the customer exists
			const [customer]: any = await database.execute(
				`SELECT customer_id FROM tCustomers WHERE customer_id = ?`,
				[customer_id]
			);

			if (!customer.length) {
				throw new Error(
					`Customer ID ${customer_id} does not exist in tCustomers`
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
					customer_id,
					payload.uniqueId,
					payload.projectName,
					payload.unitBranch,
					JSON.stringify(payload.industry),
					JSON.stringify(payload.handling),
					payload.selectedLocation.display_name,
					parseFloat(payload.maxTemp),
					parseFloat(payload.minTemp),
					parseFloat(payload.relativeHumidityMin),
					parseFloat(payload.relativeHumidityMax),
				]
			);

			// Return generated project_id
			const [rows]: any = await database.execute(
				`SELECT project_id FROM tProjects WHERE project_unique_id = ? LIMIT 1`,
				[payload.uniqueId]
			);

			return rows[0].project_id;
		} catch (error) {
			console.error("Create Project Error:", error);
			throw error;
		}
	},

	// Create a new project zone
	createProjectZone: async (payload: any) => {
		try {
			// Fallback project ID
			const fallbackProjectId = "1003";
			const project_id = payload.projectId || fallbackProjectId;

			const [result] = await database.execute(
				`INSERT INTO tProjectZones
          (
            project_id,
            zone_name
          )
        VALUES (?, ?)`,
				[project_id, payload.zone_name || "Zone 002"]
			);

			// Return generated project_id
			const [rows]: any = await database.execute(
				`SELECT zone_id FROM tProjectZones WHERE zone_name = ? LIMIT 1`,
				["Zone 001"]
			);

			return rows[0].zone_id;
		} catch (err) {
			console.error("Error in createZone:", err);
			throw err;
		}
	},

	// Insert room standards
	createRoomStandards: async (payload: any) => {
		try {
			// Fallback project ID
			const fallbackProjectId = "1003";
			const project_id = payload.projectId || fallbackProjectId;
			console.log(
				"Inserting room standards with project_id:",
				project_id,
				"and payload:",
				payload
			);
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
					project_id,
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
	// Insert Zone Rooms
	createZoneRooms: async (payload: any) => {
		// Fallback zone ID
		const fallbackZoneId = 11;
		const fallbackProjectStandardId = 1;
		const zone_id = payload.zoneId ?? fallbackZoneId;
		const project_standard_id =
			payload.projectStandardId ?? fallbackProjectStandardId;
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
					zone_id,
					project_standard_id,
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
			throw err; // this will trigger Hapi 500
		}
	},
	storeResults: async (payload: any) => {
		try {
			// Fallback project ID
			const fallbackProjectId = "1003";
			const project_id = payload.projectId || fallbackProjectId;
			const fallbackProjectRoomId = 9;
			const project_RoomId = payload.project_RoomId || fallbackProjectRoomId;
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
					project_id,
					payload.project_RoomName,
					project_RoomId,
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
};
