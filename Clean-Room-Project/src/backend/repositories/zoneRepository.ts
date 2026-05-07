import { database } from "../dbConnection/connections";

export const zoneRepository = {
    createProjectZone: async (payload: any) => {
        const [result] = await database.execute(
            `INSERT INTO tProjectZones 
      (project_id, zone_name, created_by, updated_by)
     VALUES (?, ?, ?, ?)`,
            [
                payload.project_id,
                payload.zone_name,
                payload.user_id ?? null,
                payload.user_id ?? null,
            ],
        );

        return (result as any).insertId;
    },

    createZoneTotals: async (zoneId: number | string, totals: any) => {
        const connection = await database.getConnection();
        try {
            await connection.beginTransaction();
            await connection.execute(
                `DELETE FROM tZonesTotal WHERE zone_id = ? AND ExhaustFlag = ?`,
                [zoneId, totals.ExhaustFlag]
            );

            await connection.execute(
                `INSERT INTO tZonesTotal (
                    zone_id, zone_name, zone_Area, zone_Volume, zone_RoomCfm,
                    zone_FreshAir,zone_ResultantSupplyAir, zone_ExhaustAir, ExhaustFlag, zone_DehumidCfm,
                    zone_Rem_Water_Vapour, zone_HumidCfm, zone_add_Water_Vapour,
                    zone_ResultCfm_Hot, zone_Room_Term_Supply_Mod, zone_Room_Heating_Load_TR,
                    zone_Cfm_Heating_Load_TR, zone_Result_Heating_Load_TR, zone_ResultCfm,
                    zone_Room_Termi_Supply_Mod, zone_Room_AC_Load_TR, zone_Cfm_AC_Load_TR,
                    zone_Res_Cooling_Load_TR, created_by, updated_by
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    zoneId,                                    // 1
                    totals.zone_name ?? `Zone ${zoneId}`,      // 2
                    totals.zone_Area ?? 0,                     // 3
                    totals.zone_Volume ?? 0,                   // 4
                    totals.zone_RoomCfm ?? 0,                  // 5
                    totals.zone_FreshAir ?? 0,                 // 6
                    totals.zone_ResultantSupplyAir ?? 0,       // 7
                    totals.zone_ExhaustAir ?? 0,               // 8
                    totals.ExhaustFlag,                        // 9
                    totals.zone_DehumidCfm ?? 0,               // 10
                    totals.zone_Rem_Water_Vapour ?? 0,         // 11
                    totals.zone_HumidCfm ?? 0,                 // 12
                    totals.zone_add_Water_Vapour ?? 0,         // 13
                    totals.zone_ResultCfm_Hot ?? 0,            // 14
                    totals.zone_Room_Term_Supply_Mod ?? 0,     // 15
                    totals.zone_Room_Heating_Load_TR ?? 0,     // 16
                    totals.zone_Cfm_Heating_Load_TR ?? 0,      // 17
                    totals.zone_Result_Heating_Load_TR ?? 0,   // 18
                    totals.zone_ResultCfm ?? 0,                // 19
                    totals.zone_Room_Termi_Supply_Mod ?? 0,    // 20
                    totals.zone_Room_AC_Load_TR ?? 0,          // 21
                    totals.zone_Cfm_AC_Load_TR ?? 0,           // 22
                    totals.zone_Res_Cooling_Load_TR ?? 0,      // 23
                    totals.user_id ?? null,                    // 24
                    totals.user_id ?? null                     // 25
                ]
            );

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            console.error("Database Error in createZoneTotals:", error);
            throw error;
        } finally {
            connection.release();
        }
    },
    getZoneTotals: async (zoneId: number | string) => {
        const [rows] = await database.execute(
            `SELECT * FROM tZonesTotal WHERE zone_id = ?`,
            [zoneId]
        );
        return rows as any[];
    }
};