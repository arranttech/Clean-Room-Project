import { database } from "../dbConnection/connections";

export const projectRepository = {
	createProject: async (payload: any) => {
		const [customer]: any = await database.execute(
			`SELECT customer_id FROM tCustomers WHERE customer_id = ?`,
			[payload.customer_id]
		);

		if (!customer.length) {
			throw new Error(`Customer ID ${payload.customer_id} does not exist`);
		}

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

		return (result as any).insertId;
	},

	getProjectByCustomerId: async (customer_id: number) => {
		const [rows]: any = await database.execute(
			`SELECT * FROM tProjects WHERE customer_id = ? ORDER BY project_id DESC LIMIT 1`,
			[customer_id]
		);

		return rows[0] || null;
	},
};
