import { database } from "../dbConnection/connections";

export const resultRepository = {
	storeResults: async (payload: any) => {
		const [result] = await database.execute(
			`INSERT INTO tProjectResults (
       	project_id,
					project_RoomName,
					project_RoomId,
					project_Area,
					project_Volume,
					project_RoomCfm,
					project_FreshAir,
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
					project_Result_Heating_Load_TR
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					payload.project_id,
					payload.roomName ?? null,
					payload.project_RoomId,
					payload.project_Area ?? null,
					payload.project_Volume ?? null,
					payload.project_RoomCfm ?? null,
					payload.project_FreshAir ?? null,
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
					payload.project_Result_Heating_Load_TR ?? null
				]
		);

		return (result as any).insertId;
	},
};
