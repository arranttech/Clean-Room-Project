import { database } from "../dbConnection/connections";

export const zoneRepository = {
    
    createProjectZone: async (payload: any, type: 'Exhaust' | 'Non-Exhaust') => {
        const [result] = await database.execute(
            `INSERT INTO tProjectZones (project_id, created_by, updated_by, total_type)
             VALUES (?, ?, ?, ?)`,
            [payload.project_id, payload.user_id ?? null, payload.user_id ?? null, type]
        );
        return (result as any).insertId;
    },

    updateZoneTotals: async (zoneId: number | string, totals: any) => {
        const dbValues = [
            totals.zoneArea ?? null,
            totals.zoneVolume ?? null,
            totals.zoneRoomCfm ?? null,
            totals.zoneFreshAir ?? null,
            totals.zoneExhaustAir ?? null,
            totals.zoneDehumidValue ?? null,            
            totals.zoneRemovedWater ?? null,            
            totals.zoneResultantCfm ?? null,           
            totals.zoneRoomTermSupplyValue ?? null,      
            totals.zoneRoomACValue ?? null,             
            totals.zoneCfmACLoadTR ?? null,            
            totals.zoneResultCoolLoadTR ?? null,        
            totals.zoneAddWaterValue ?? null,           
            totals.zoneHumidValue ?? null,              
            totals.zoneResultantHeatCfm ?? null,        
            totals.zoneRoomTermSupplyHeatValue ?? null, 
            totals.zoneRoomHeatLoadTR ?? null,          
            totals.zoneCfmHeatLoadTRValue ?? null,      
            totals.zoneResultHeatLoadTR ?? null,        
            zoneId
        ];

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
            dbValues
        );
    },
};