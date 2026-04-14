import { database } from "../dbConnection/connections";

const toNum = (v: any): number | null => {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
};

const toStr = (v: any): string | null => {
  if (v === undefined || v === null) return null;
  return String(v);
};

// this function is used to handle the velocity data based on the system and pipe configuration
const s = (payload: any) => {
  const system = payload.system || "";
  const pipeConfig = payload.pipeConfiguration || "";

  const isDualPipeHeatingCooling =
    system === "Air Cooling and Air Heating System" && pipeConfig === "Dual Pipe";
  const isVentilation = system === "Ventilation System";

  return {
    ...payload,
    flowVelocity: (isVentilation || isDualPipeHeatingCooling) ? null : payload.flowVelocity,
    heatingFlowVelocity: isDualPipeHeatingCooling ? payload.heatingFlowVelocity : null,
    coolingFlowVelocity: isDualPipeHeatingCooling ? payload.coolingFlowVelocity : null,
    pipeConfiguration: isVentilation ? null : payload.pipeConfiguration,
  };
};

export const roomRepository = {


  createRoomStandards: async (rawPayload: any) => {
    console.log("RAW PAYLOAD:", rawPayload);

    const payload = s(rawPayload);

    console.log("TRANSFORMED PAYLOAD:", payload);

    const query = `INSERT INTO tRoomStandards (
    project_id,
    zone_name,
    project_system,
    project_system_type,
    project_heating_method,
    project_cooling_method,
    project_standard,
    project_classification_name,
    project_ACPH,
    project_temp_Unit,
    project_required_inside_temp,
    project_required_inside_humid,
    project_max_temp,
    project_min_temp,
    project_relative_min_humid,
    project_relative_max_humid,
    flow_velocity,
    heating_flow_velocity,
    cooling_flow_velocity,
    Additional_dp_exhaust,
    Additional_dp_supply,
    ahu_construction_specifications,
    ahu_filtration_data,
    pipe_configuration,
    static_Pressure_Supply,
    static_Pressure_Exhaust,
    number_of_Filtrations_Supply,
    number_of_Filtrations_Exhaust,
    created_by,
    updated_by
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      payload.project_id,
      payload.zone_name ?? null,
      payload.system ?? null,
      payload.systemType ?? null,
      payload.heatingMethod ?? null,
      payload.coolingMethod ?? null,
      payload.standard ?? null,
      payload.classification ?? null,
      toNum(payload.acph),
      payload.tempUnit ?? null,
      toNum(payload.reqInsideTempC),
      toNum(payload.reqInsideHum),
      toNum(payload.maxTempC),
      toNum(payload.minTempC),
      toNum(payload.rhMin),
      toNum(payload.rhMax),
      toNum(payload.flowVelocity),
      toNum(payload.heatingFlowVelocity),
      toNum(payload.coolingFlowVelocity),
      toNum(payload.additionalDpValueExhaust),
      toNum(payload.additionalDpValue),
      JSON.stringify(payload.ahuConstructionData || []),
      JSON.stringify(payload.ahufiltrationData || []),
      payload.pipeConfiguration ?? null,
      toNum(payload.staticPressureSupply),
      toNum(payload.staticPressureExhaust),
      toNum(payload.totalFiltrationStagesSupply),
      toNum(payload.totalFiltrationStagesExhaust),
      payload.user_id ?? null,
      payload.user_id ?? null,
    ];

    console.log("SQL VALUES:", values);

    const undefinedIndex = values.findIndex(v => v === undefined);
    if (undefinedIndex !== -1) {

      throw new Error("Undefined value found in SQL params");
    }

    const [result] = await database.execute(query, values);

    console.log("INSERT RESULT:", result);

    return (result as any).insertId;
  },

  getRoomStandards: async (payload?: { project_id?: number }) => {
    let query = `SELECT * FROM tRoomStandards`;
    const params: any[] = [];
    if (payload?.project_id) {
      query += ` WHERE project_id = ? ORDER BY project_standard_id DESC`;
      params.push(payload.project_id);
    }
    const [result] = await database.execute(query, params);
    return result;
  },
  updateRoomStandards: async (standardId: number, rawPayload: any) => {
    const payload = s(rawPayload);
    const params = [
      payload.zone_name ?? null,
      payload.system ?? null,
      payload.systemType ?? null,
      payload.heatingMethod ?? null,
      payload.coolingMethod ?? null,
      payload.standard ?? null,
      payload.classification ?? null,
      toNum(payload.acph),
      payload.tempUnit ?? null,
      toNum(payload.reqInsideTempC),
      toNum(payload.reqInsideHum),
      toNum(payload.maxTempC),
      toNum(payload.minTempC),
      toNum(payload.rhMin),
      toNum(payload.rhMax),
      toNum(payload.flowVelocity),
      toNum(payload.heatingFlowVelocity),
      toNum(payload.coolingFlowVelocity),
      toNum(payload.additionalDpValueExhaust),
      toNum(payload.additionalDpValue),
      JSON.stringify(payload.ahuConstructionData || []),
      JSON.stringify(payload.ahufiltrationData || []),
      payload.pipeConfiguration ?? null,
      toNum(payload.staticPressureSupply),
      toNum(payload.staticPressureExhaust),
      toNum(payload.totalFiltrationStagesSupply),
      toNum(payload.totalFiltrationStagesExhaust),
      payload.user_id ?? null,
      Number.isNaN(standardId) ? null : standardId,
    ];

    const undefIndex = params.indexOf(undefined);
    if (undefIndex !== -1) {
      console.error("FATAL: undefined param found at index:", undefIndex, params);
      throw new Error(`Bind parameter at index ${undefIndex} must not contain undefined.`);
    }

    await database.execute(
      `UPDATE tRoomStandards SET
        zone_name = ?,
        project_system = ?,
        project_system_type = ?,
        project_heating_method = ?,
        project_cooling_method = ?,
        project_standard = ?,
        project_classification_name = ?,
        project_ACPH = ?,
        project_temp_Unit = ?,
        project_required_inside_temp = ?,
        project_required_inside_humid = ?,
        project_max_temp = ?,
        project_min_temp = ?,
        project_relative_min_humid = ?,
        project_relative_max_humid = ?,
        flow_velocity = ?,
        heating_flow_velocity = ?,
        cooling_flow_velocity = ?,
        Additional_dp_exhaust = ?,
        Additional_dp_supply = ?,
        ahu_construction_specifications = ?,
        ahu_filtration_data = ?,
        pipe_configuration = ?,
        static_Pressure_Supply = ?,
        static_Pressure_Exhaust = ?,
        number_of_Filtrations_Supply = ?,
        number_of_Filtrations_Exhaust = ?,
        updated_by = ?
      WHERE project_standard_id = ?`,
      params
    );
  },

  createZoneRooms: async (payload: any) => {
    const [result] = await database.execute(
      `INSERT INTO tZoneRooms (
        zone_id,
        project_standard_id,
        project_RoomName,
        room_Length,
        room_Width,
        room_Height,
        room_Occupancy,
        room_Equipment_Load,
        room_Lighting,
        room_Infiltrations,
        room_FreshAir,
        room_ExhaustAir,
        room_ExhaustAirCfm,
        project_ACPH,
        created_by,
        updated_by
      ) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        toNum(payload.zone_id),
        toNum(payload.projectStandardId),
        toStr(payload.roomName) ?? "Room",
        toStr(payload.length),
        toStr(payload.width),
        toStr(payload.height),
        toStr(payload.occupancy),
        toStr(payload.equipmentLoad),
        toStr(payload.lightingLoad),
        toStr(payload.infiltrationsPerHour),
        toStr(payload.freshAirPercent),
        toStr(payload.exhaustAir),
        toStr(payload.exhaustAirCfm),
        toStr(payload.selectedAcph),
        payload.user_id ?? null,
        payload.user_id ?? null,
      ]
    );
    return (result as any).insertId;
  },

  getZoneRooms: async (payload?: { zone_id?: number }) => {
    let query = `SELECT * FROM tZoneRooms`;
    const params: any[] = [];
    if (payload?.zone_id) {
      query += ` WHERE zone_id = ?`;
      params.push(payload.zone_id);
    }
    const [result] = await database.execute(query, params);
    return result;
  },

  deleteZoneRoom: async (roomId: number, zoneId: number) => {
    // Step 1: delete the room
    await database.execute(
      `DELETE FROM tZoneRooms WHERE project_RoomId = ?`,
      [roomId]
    );

    await database.execute(
      `SELECT COUNT(*) as count FROM tZoneRooms WHERE zone_id = ?`,
      [zoneId]
    );
    // const remaining = (rows as any)[0].count;
    // console.log(`Zone ${zoneId} has ${remaining} rooms remaining`);

    // // no rooms left, delete the zone
    // if (remaining === 0) {
    //   console.log(`Deleting zone ${zoneId}`);
    //   await database.execute(
    //     `DELETE FROM tProjectZones WHERE zone_id = ?`,
    //     [zoneId]
    //   );
    // }
  },

  updateZoneRoom: async (roomId: number, payload: any) => {
    await database.execute(
      `UPDATE tZoneRooms SET
      zone_id=?,
      project_standard_id=?,
      project_RoomName=?,
      room_Length=?,
      room_Width=?,
      room_Height=?,
      room_Occupancy=?,
      room_Equipment_Load=?,
      room_Lighting=?,
      room_Infiltrations=?,
      room_FreshAir=?,
      room_ExhaustAir=?,
      room_ExhaustAirCfm=?,
      project_ACPH=?,
      updated_by=?
    WHERE project_RoomId=?`,
    [
      toNum(payload.zone_id),
      toNum(payload.projectStandardId),
      toStr(payload.roomName),
      toStr(payload.length),
      toStr(payload.width),
      toStr(payload.height),
      toStr(payload.occupancy),
      toStr(payload.equipmentLoad),
      toStr(payload.lightingLoad),
      toStr(payload.infiltrationsPerHour),
      toStr(payload.freshAirPercent),
      toStr(payload.exhaustAir),
      toStr(payload.exhaustAirCfm),
      toStr(payload.selectedAcph),
      payload.user_id,
      roomId,
    ]
  );
},

};