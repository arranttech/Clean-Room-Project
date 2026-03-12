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
      (customer_id, user_login_id, project_unique_id, project_name,
       project_unit_branch, project_Industry, project_Handling,
       project_Location, project_max_temp, project_min_temp,
       project_relative_min_humid, project_relative_max_humid)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.customer_id,
        payload.user_login_id,
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

  updateProject: async (projectId: number, payload: any) => {
    await database.execute(
      `UPDATE tProjects SET
        project_name = ?, project_unit_branch = ?, project_Industry = ?,
        project_Handling = ?, project_Location = ?, project_max_temp = ?,
        project_min_temp = ?, project_relative_min_humid = ?,
        project_relative_max_humid = ?
      WHERE project_id = ?`,
      [
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
        projectId,
      ]
    );
  },

  updateProjectStatus: async (projectId: number, status: string) => {
    await database.execute(
      `UPDATE tProjects SET project_status = ? WHERE project_id = ?`,
      [status, projectId]
    );
  },

  getCompletedProjectsByUserId: async (user_login_id: number) => {
    const [rows]: any = await database.execute(
      `SELECT
        p.project_id,
        p.project_unique_id,
        p.project_name,
        p.project_unit_branch,
        p.project_Industry,
        p.project_Handling,
        p.project_Location,
        p.project_status,
        p.created_at,
        c.customer_name,
        c.customer_address,
        c.customer_phone,
        c.customer_email_id
      FROM tProjects p
      INNER JOIN tCustomers c ON c.customer_id = p.customer_id
      WHERE p.user_login_id = ?
        AND p.project_status = 'COMPLETED'
      ORDER BY p.created_at DESC`,
      [user_login_id]
    );
    return rows;
  },
};
