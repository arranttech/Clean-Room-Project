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

  getProjectCountsByUserId: async (user_login_id: number) => {
    const [rows]: any = await database.execute(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN project_status = 'INPROGRESS' THEN 1 ELSE 0 END) AS inProgress,
        SUM(CASE WHEN project_status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed
      FROM tProjects
      WHERE user_login_id = ?`,
      [user_login_id]
    );
    return {
      total: rows[0]?.total ?? 0,
      inProgress: rows[0]?.inProgress ?? 0,
      completed: rows[0]?.completed ?? 0,
    };
  },

  getCompletedProjectsByUserId: async (user_login_id: number) => {
    try {
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
        c.customer_email_id,
        s.project_standard_id, 
        s.project_standard,
s.project_classification_name,
s.project_ACPH,
r.project_RoomName,
r.room_Length,
r.room_Width,
r.room_Height,
r.room_Occupancy,
r.room_Equipment_Load,
r.room_Lighting,
r.room_FreshAir,
r.room_ExhaustAir
      FROM tProjects p
       JOIN tCustomers c ON c.customer_id = p.customer_id
      JOIN tRoomStandards s ON s.project_id = p.project_id
 JOIN  tZoneRooms r ON r.project_standard_id = s.project_standard_id
      WHERE p.user_login_id = ?
        AND p.project_status = 'COMPLETED'
        
      ORDER BY p.created_at DESC`,
        [user_login_id]
      );
      console.log("Repository SQL Result:", JSON.stringify(rows, null, 2));
      return rows;
    } catch (err) {
      console.error("Repository ERROR:", err);
      throw err;
    }

  },

  
  // EXCEL REPO
  getProjectExportData: async (projectId: number) => {
    // Project + Customer
    const [[project]]: any = await database.execute(
      `SELECT 
        p.project_id, p.project_unique_id, p.project_name, p.project_status,
        p.project_unit_branch, p.project_Industry, p.project_Handling,
        p.project_Location, p.project_max_temp, p.project_min_temp,
        p.project_relative_min_humid, p.project_relative_max_humid, p.created_at,
        c.customer_name, c.customer_phone, c.customer_address,
        c.customer_email_id, c.customers_additional_notes
      FROM tProjects p
      INNER JOIN tCustomers c ON c.customer_id = p.customer_id
      WHERE p.project_id = ?`,
      [projectId]
    );
  
    // Standards
    const [standards]: any = await database.execute(
      `SELECT * FROM tRoomStandards WHERE project_id = ?`,
      [projectId]
    );
  
    // Zones
    const [zones]: any = await database.execute(
      `SELECT zone_id, zone_name FROM tProjectZones WHERE project_id = ?`,
      [projectId]
    );
  
   // Rooms with Zone name
const [rooms]: any = await database.execute(
  `SELECT 
    z.zone_name,
    r.project_RoomName, r.room_Length, r.room_Width,
    r.room_Height, r.room_Occupancy, r.room_Equipment_Load,
    r.room_Lighting, r.room_Infiltrations, r.room_FreshAir,
    r.room_ExhaustAir, r.project_ACPH
  FROM tZoneRooms r
  INNER JOIN tRoomStandards rs ON rs.project_standard_id = r.project_standard_id
  INNER JOIN tProjectZones z ON z.zone_id = r.zone_id
  WHERE rs.project_id = ?`,
  [projectId]
);
    // Results
    const [results]: any = await database.execute(
      `SELECT * FROM tProjectResults WHERE project_id = ?`,
      [projectId]
    );
  
    return { project, standards, zones, rooms, results };
  },
};
