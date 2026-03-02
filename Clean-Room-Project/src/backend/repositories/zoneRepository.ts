import { database } from "../dbConnection/connections";

export const zoneRepository = {
	createProjectZone: async (payload: any) => {
		const [result] = await database.execute(
			`INSERT INTO tProjectZones (project_id, zone_name)
       VALUES (?, ?)`,
			[payload.project_id, payload.zone_name || "Zone 001"]
		);

		return (result as any).insertId;
	},
};
