import { database } from "../dbConnection/connections";

export const roomRepository = {
	createRoomStandards: async (payload: any) => {
		const [result] = await database.execute(
			`INSERT INTO tRoomStandards (
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
	},

	getRoomStandards: async (payload?: { project_id?: number }) => {
		let query = `SELECT * FROM tRoomStandards`;
		const params: any[] = [];

		if (payload?.project_id) {
			query += ` WHERE project_id = ? ORDER BY project_standard_id DESC`;
			params.push(payload.project_id);
		}

		const [result] = await database.execute(query, params);
		return result;
	},

	createZoneRooms: async (payload: any) => {
		const [result] = await database.execute(
			`INSERT INTO tZoneRooms (
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
	},

	getZoneRooms: async (payload?: { zone_id?: number }) => {
		let query = `SELECT * FROM tZoneRooms`;
		const params: any[] = [];

		if (payload?.zone_id) {
			query += ` WHERE zone_id = ?`;
			params.push(payload.zone_id);
		}

		const [result] = await database.execute(query, params);
		return result;
	},
};
