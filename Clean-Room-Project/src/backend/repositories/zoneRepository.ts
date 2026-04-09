
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

	// Updates ALL zone total columns including the 6 new cooling columns
	updateZoneTotals: async (zoneId: number | string, totals: any) => {
		await database.execute(
			`UPDATE tProjectZones SET
				zone_Area                    = ?,
				zone_Volume                  = ?,
				zone_RoomCfm                 = ?,
				zone_FreshAir                = ?,
				zone_ExhaustAir              = ?,
				zone_DehumidCfm              = ?,
				zone_Rem_Water_Vapour        = ?,
				zone_ResultCfm               = ?,
				zone_Room_Termi_Supply_Mod   = ?,
				zone_Room_AC_Load_TR         = ?,
				zone_Cfm_AC_Load_TR          = ?,
				zone_Res_Cooling_Load_TR     = ?,
				zone_add_Water_Vapour        = ?,
				zone_HumidCfm                = ?,
				zone_ResultCfm_Hot           = ?,
				zone_Room_Term_Supply_Mod    = ?,
				zone_Room_Heating_Load_TR    = ?,
				zone_Cfm_Heating_Load_TR     = ?,
				zone_Result_Heating_Load_TR  = ?,
				updated_at                   = NOW()
			WHERE zone_id = ?`,
			[
				totals.zone_Area                    ?? null,
				totals.zone_Volume                  ?? null,
				totals.zone_RoomCfm                 ?? null,
				totals.zone_FreshAir                ?? null,
				totals.zone_ExhaustAir              ?? null,
				totals.zone_DehumidCfm              ?? null,
				totals.zone_Rem_Water_Vapour        ?? null,
				totals.zone_ResultCfm               ?? null,
				totals.zone_Room_Termi_Supply_Mod   ?? null,
				totals.zone_Room_AC_Load_TR         ?? null,
				totals.zone_Cfm_AC_Load_TR          ?? null,
				totals.zone_Res_Cooling_Load_TR     ?? null,
				totals.zone_add_Water_Vapour        ?? null,
				totals.zone_HumidCfm                ?? null,
				totals.zone_ResultCfm_Hot           ?? null,
				totals.zone_Room_Term_Supply_Mod    ?? null,
				totals.zone_Room_Heating_Load_TR    ?? null,
				totals.zone_Cfm_Heating_Load_TR     ?? null,
				totals.zone_Result_Heating_Load_TR  ?? null,
				zoneId,
			]
		);
	},
};