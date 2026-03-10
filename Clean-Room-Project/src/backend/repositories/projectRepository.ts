import { database } from "../dbConnection/connections";

const toFloat = (val: any): number | null => {
  if (val === null || val === undefined || val === "") return null;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? null : parsed;
};

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
        payload.uniqueId || null,
        payload.projectName,
        payload.unitBranch || null,
        JSON.stringify(payload.industry || []),
        JSON.stringify(payload.handling || []),
        payload.selectedLocation?.display_name ||
          payload.selectedLocation ||
          "",
        toFloat(payload.maxTemp),
        toFloat(payload.minTemp),
        toFloat(payload.relativeHumidityMin),
        toFloat(payload.relativeHumidityMax),
      ]
    );

    return (result as any).insertId;
  },

  // getProjectByCustomerId: async (customer_id: number) => {
  //   const [rows]: any = await database.execute(
  //     `SELECT * FROM tProjects WHERE customer_id = ? ORDER BY project_id DESC LIMIT 1`,
  //     [customer_id]
  //   );
  //   return rows[0] || null;
  // },
  updateProject: async (projectId: number, payload: any) => {
    await database.execute(
      `UPDATE tProjects SET
        project_name = ?,
        project_unit_branch = ?,
        project_Industry = ?,
        project_Handling = ?,
        project_Location = ?,
        project_max_temp = ?,
        project_min_temp = ?,
        project_relative_min_humid = ?,
        project_relative_max_humid = ?
      WHERE project_id = ?`,
      [
        payload.projectName,
        payload.unitBranch || null,
        JSON.stringify(payload.industry || []),
        JSON.stringify(payload.handling || []),
        payload.selectedLocation?.display_name || payload.selectedLocation || "",
        toFloat(payload.maxTemp),
        toFloat(payload.minTemp),
        toFloat(payload.relativeHumidityMin),
        toFloat(payload.relativeHumidityMax),
        projectId,
      ]
    );
  },
};
