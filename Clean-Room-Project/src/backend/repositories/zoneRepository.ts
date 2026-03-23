import { database } from "../dbConnection/connections";

export const zoneRepository = {
	createProjectZone: async (payload: any) => {
		const [result] = await database.execute(
			`INSERT INTO tProjectZones (project_id, created_by, updated_by)
       VALUES (?, ?, ?)`,
			[payload.project_id, payload.user_id ?? null, payload.user_id ?? null]
		);

		return (result as any).insertId;
	},
};
