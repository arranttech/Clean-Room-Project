import { database } from "../dbConnection/connections";

export const resultRepository = {
  storeResults: async (payload: any) => {
    try {
      const [result] = await database.execute(
        `INSERT INTO tProjectResults (
          project_RoomId, 
          project_id,
          project_RoomName, 
          project_Area,
          project_Volume, 
          project_RoomCfm, 
          project_FreshAir,
          project_ResultantSupplyAir,
          project_ExhaustAir, 
          project_DehumidCfm,
          project_Rem_Water_Vapour,
          project_ResultCfm, 
          project_Room_Termi_Supply_Mod,
          project_Room_AC_Load_TR,
          project_Cfm_AC_Load_TR,
          project_Res_Cooling_Load_TR,
          project_add_Water_Vapour, 
          project_HumidCfm, 
          project_ResultCfm_Hot,
          project_Room_Term_Supply_Mod,
          project_Room_Heating_Load_TR,
          project_Cfm_Heating_Load_TR,
          project_Result_Heating_Load_TR,
          created_by, 
          updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payload?.project_RoomId ?? null,
          payload.project_id,
          payload.roomName ?? null,
          payload.project_Area ?? null,
          payload.project_Volume ?? null,
          payload.project_RoomCfm ?? null,
          payload.project_FreshAir ?? null,
          payload.project_ResultantSupplyAir ?? null,
          payload.project_ExhaustAir ?? null,
          payload.project_DehumidCfm ?? null,
          payload.project_Rem_Water_Vapour ?? null,
          payload.project_ResultCfm ?? null,
          payload.project_Room_Termi_Supply_Mod ?? null,
          payload.project_Room_AC_Load_TR ?? null,
          payload.project_Cfm_AC_Load_TR ?? null,
          payload.project_Res_Cooling_Load_TR ?? null,
          payload.project_add_Water_Vapour ?? null,
          payload.project_HumidCfm ?? null,
          payload.project_ResultCfm_Hot ?? null,
          payload.project_Room_Term_Supply_Mod ?? null,
          payload.project_Room_Heating_Load_TR ?? null,
          payload.project_Cfm_Heating_Load_TR ?? null,
          payload.project_Result_Heating_Load_TR ?? null,
          payload.user_id ?? null,
          payload.user_id ?? null,
        ]
      );
      return (result as any).insertId;
    } catch (error) {
      console.error("SQL Error in storeResults:", error);
      throw error;
    }
  },

  getResultsSummaryByProjectId: async (payload?: { projectId: number }) => {
    try {
      const projectId = payload?.projectId;
      const [rows]: any = await database.execute("CALL GetProjectResultSummary(?)", [projectId]);
      console.log("Results summary fetched from DB:", rows);
      return rows[0] || [];
    } catch (error) {
      console.error("SQL Error in getResultsSummaryByProjectId:", error);
      throw error;
    }
  },
};