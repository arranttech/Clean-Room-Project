import { database } from "../dbConnection/connections";

export const zoneRepository = {
	createProjectZone: async (payload: any) => {
		const [result] = await database.execute(
			`INSERT INTO tProjectZones (project_id)
       VALUES (?)`,
			[payload.project_id]
		);

		return (result as any).insertId;
	},
};
