import { database } from "../dbConnection/connections";

const toFloat = (val: any): number | null => {
  if (val === null || val === undefined || val === "") return null;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? null : parsed;
};

const normalizeIndustry = (industry: unknown): string[] => {
  if (typeof industry === "string" && industry.trim()) {
    return [industry.trim()];
  }
  return [];
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
       project_unit_branch, project_Industry, project_Handling, project_SubIndustry,
       project_Location, project_max_temp, project_min_temp,
       project_relative_min_humid, project_relative_max_humid,
       created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.customer_id,
        payload.user_login_id,
        payload.uniqueId || null,
        payload.projectName,
        payload.unitBranch || null,
        JSON.stringify(normalizeIndustry(payload.industry)),
        JSON.stringify(payload.handling || []),
        payload.subIndustry || null,
        payload.selectedLocation?.display_name ||
          payload.selectedLocation ||
          "",
        toFloat(payload.maxTemp),
        toFloat(payload.minTemp),
        toFloat(payload.relativeHumidityMin),
        toFloat(payload.relativeHumidityMax),
        payload.user_id ?? null,
        payload.user_id ?? null,
      ]
    );
    return (result as any).insertId;
  },

  updateProject: async (projectId: number, payload: any) => {
    await database.execute(
      `UPDATE tProjects SET
        project_name = ?, project_unit_branch = ?, project_Industry = ?,
        project_Handling = ?, project_SubIndustry = ?, project_Location = ?,
        project_max_temp = ?, project_min_temp = ?, project_relative_min_humid = ?,
        project_relative_max_humid = ?, updated_by = ?
      WHERE project_id = ?`,
      [
        payload.projectName,
        payload.unitBranch || null,
        JSON.stringify(normalizeIndustry(payload.industry)),
        JSON.stringify(payload.handling || []),
        payload.subIndustry || null,
        payload.selectedLocation?.display_name ||
          payload.selectedLocation ||
          "",
        toFloat(payload.maxTemp),
        toFloat(payload.minTemp),
        toFloat(payload.relativeHumidityMin),
        toFloat(payload.relativeHumidityMax),
        payload.user_id || null,
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

  getProjectCountsByUserId: async (user_id: string, customer_id: number) => {
    const [rows]: any = await database.execute(
      // `SELECT
      //   COUNT(*) AS total,
      //   SUM(CASE WHEN project_status = 'INPROGRESS' THEN 1 ELSE 0 END) AS inProgress,
      //   SUM(CASE WHEN project_status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed
      // FROM tProjects
      // JOIN tCustomers c ON c.customer_id = p.customer_id,
      // WHERE user_login_id = ?`,
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN project_status = 'INPROGRESS' THEN 1 ELSE 0 END) AS inProgress,
        SUM(CASE WHEN project_status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed
      FROM tProjects p
      JOIN tCustomers c ON c.customer_id = p.customer_id
      WHERE p.user_login_id = ?
      AND p.customer_id = ?`,
      [user_id, customer_id]
    );
    return {
      total: rows[0]?.total ?? 0,
      inProgress: rows[0]?.inProgress ?? 0,
      completed: rows[0]?.completed ?? 0,
    };
  },

  getCompletedProjectsByUserId: async (user_id: string, customer_id: number) => {
    try {
      const [rows]: any = await database.execute(
        `SELECT
          p.project_id, p.project_unique_id, p.project_name, p.project_unit_branch,
          p.project_Industry, p.project_Handling, p.project_Location, p.project_status,
          p.created_at, p.created_by, p.updated_by,
          c.customer_name, c.customer_address, c.customer_phone, c.customer_email_id,
          s.project_standard_id, s.project_standard, s.project_classification_name, s.project_ACPH,
          r.project_RoomName, r.room_Length, r.room_Width, r.room_Height,
          r.room_Occupancy, r.room_Equipment_Load, r.room_Lighting, r.room_FreshAir, r.room_ExhaustAir, r.room_ExhaustAirCfm
        FROM tProjects p
        JOIN tCustomers c ON c.customer_id = p.customer_id
        LEFT JOIN tRoomStandards s ON s.project_id = p.project_id
        LEFT JOIN tZoneRooms r ON r.project_standard_id = s.project_standard_id
        WHERE p.user_login_id = ? AND p.customer_id = ? AND p.project_status = 'COMPLETED'
        ORDER BY p.created_at DESC`,
        [user_id, customer_id]
      );
      return rows;
    } catch (err) {
     
      throw err;
    }
  },

  getProjectDetailsForEdit: async (projectId: number) => {
    const [[project]]: any = await database.execute(
      `SELECT p.project_id, p.project_unique_id, p.project_name,
        p.project_unit_branch, p.project_Industry, p.project_Handling, p.project_SubIndustry,
        p.project_Location, p.project_max_temp, p.project_min_temp,
        p.project_relative_min_humid, p.project_relative_max_humid,
        c.customer_name
      FROM tProjects p
      JOIN tCustomers c ON c.customer_id = p.customer_id
      WHERE p.project_id = ?`,
      [projectId]
    );

    const [standards]: any = await database.execute(
      `SELECT project_standard_id, project_id, project_system, project_system_type,
        project_heating_method, project_cooling_method, project_standard,
        project_classification_name, project_ACPH, project_temp_unit,
        project_required_inside_temp, project_required_inside_humid,
        project_max_temp, project_min_temp, project_relative_min_humid,
        project_relative_max_humid, flow_velocity, pipe_configuration,
        static_Pressure_Supply, static_Pressure_Exhaust, number_of_Filtrations_Supply, number_of_Filtrations_Exhaust, heating_flow_velocity,
        cooling_flow_velocity
      FROM tRoomStandards
      WHERE project_id = ?
      ORDER BY project_standard_id ASC`,
      [projectId]
    );

    const [zones]: any = await database.execute(
      `SELECT zone_id, zone_name FROM tProjectZones WHERE project_id = ?`,
      [projectId]
    );

    const [rooms]: any = await database.execute(
      `SELECT r.project_RoomId, r.zone_id, r.project_standard_id,
        r.project_RoomName, r.room_Length, r.room_Width, r.room_Height,
        r.room_Occupancy, r.room_Equipment_Load, r.room_Lighting,
        r.room_Infiltrations, r.room_FreshAir, r.room_ExhaustAir, r.room_ExhaustAirCfm, r.project_ACPH
      FROM tZoneRooms r
      INNER JOIN tRoomStandards rs ON rs.project_standard_id = r.project_standard_id
      WHERE rs.project_id = ?`,
      [projectId]
    );

    return { project, standards, zones, rooms };
  },

  getInProgressProjectsByUserId: async (user_id: string, customer_id: number) => {
    const [rows]: any = await database.execute(
      `SELECT
        p.project_id, p.project_name, p.created_at AS last_modified, c.customer_name,
        COUNT(DISTINCT s.project_standard_id) > 0 AS has_standard,
        COUNT(DISTINCT r.project_RoomId) > 0 AS has_rooms
      FROM tProjects p
      JOIN tCustomers c ON c.customer_id = p.customer_id
      LEFT JOIN tRoomStandards s ON s.project_id = p.project_id
      LEFT JOIN tZoneRooms r ON r.project_standard_id = s.project_standard_id
      WHERE p.user_login_id = ? AND p.customer_id = ? AND p.project_status = 'INPROGRESS'
      GROUP BY p.project_id, p.project_name, p.created_at, c.customer_name
      ORDER BY p.created_at DESC`,
      [user_id, customer_id]
    );
    return rows.map((row: any) => ({
      project_id: row.project_id,
      project_name: row.project_name,
      customer_name: row.customer_name,
      created_by: row.created_by,
      updated_by: row.updated_by,
      last_modified: row.last_modified,
      has_standard: !!row.has_standard,
      has_rooms: !!row.has_rooms,
    }));
  },

  // ── EXCEL EXPORT ────────────────────────────────────────────────────────────
  // zones query fetches ALL 19 zone_* total columns so the Excel TOTAL row
  getProjectExportData: async (projectId: number) => {
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

    const [standards]: any = await database.execute(
      `SELECT * FROM tRoomStandards WHERE project_id = ?`,
      [projectId]
    );

    // Fetch ALL 19 zone_* total columns 
    const [zones]: any = await database.execute(
      `SELECT
        zone_id,
        zone_name,
        zone_Area,
        zone_Volume,
        zone_RoomCfm,
        zone_FreshAir,
        zone_ExhaustAir,
        zone_DehumidCfm,
        zone_Rem_Water_Vapour,
        zone_ResultCfm,
        zone_Room_Termi_Supply_Mod,
        zone_Room_AC_Load_TR,
        zone_Cfm_AC_Load_TR,
        zone_Res_Cooling_Load_TR,
        zone_add_Water_Vapour,
        zone_HumidCfm,
        zone_ResultCfm_Hot,
        zone_Room_Term_Supply_Mod,
        zone_Room_Heating_Load_TR,
        zone_Cfm_Heating_Load_TR,
        zone_Result_Heating_Load_TR
      FROM tProjectZones
      WHERE project_id = ?
      ORDER BY zone_id ASC`,
      [projectId]
    );

    const [rooms]: any = await database.execute(
      `SELECT
        z.zone_id,
        z.zone_name,
        r.project_RoomName, r.room_Length, r.room_Width,
        r.room_Height, r.room_Occupancy, r.room_Equipment_Load,
        r.room_Lighting, r.room_Infiltrations, r.room_FreshAir,
        r.room_ExhaustAir, r.room_ExhaustAirCfm, r.project_ACPH,
        r.project_standard_id
      FROM tZoneRooms r
      INNER JOIN tRoomStandards rs ON rs.project_standard_id = r.project_standard_id
      INNER JOIN tProjectZones z ON z.zone_id = r.zone_id
      WHERE rs.project_id = ?`,
      [projectId]
    );

    const [results]: any = await database.execute(
      `SELECT * FROM tProjectResults WHERE project_id = ?`,
      [projectId]
    );

    return { project, standards, zones, rooms, results };
  },
};
