import { AirflowResults } from "../services/service.ts";

export type ZonePayload = AirflowResults;

export type ZoneFlag = "S" | "E" | "VS" | "VE" | "CS" | "HS";
export type ResultLabel = "PRIMARY" | "VENTILATION";

export type ZoneGroupInput = {
    room: any;
    result: any;
    resultLabel: ResultLabel;
};

export type CalculatedZoneResults = {
    zoneName: string;
    zoneSystem: string;
    zoneClassification?: string;
    zoneReqInsideTempC?: number | string;
    zoneArea: number;
    zoneVolume: number;
    zoneRoomCfm: number;
    zoneFreshAir: number;
    zoneResultantSupplyAir: number;
    zoneExhaustAir: number;
    zoneDehumidValue: number;
    zoneRemovedWater: number;
    zoneResultantCfm: number;
    zoneRoomACValue: number;
    zoneRoomTermSupplyValue: number;
    zoneCfmACLoadTR: number;
    zoneResultCoolLoadTR: number;
    zoneAddWaterValue: number;
    zoneHumidValue: number;
    zoneResultantHeatCfm: number;
    zoneRoomTermSupplyHeatValue: number;
    zoneCfmHeatLoadTRValue: number;
    zoneRoomHeatLoadTR: number;
    zoneResultHeatLoadTR: number;
};

interface AccumulatorTotals {
    zoneArea: number;
    zoneVolume: number;
    zoneRoomCfm: number;
    zoneFreshAir: number;
    zoneResultantSupplyAir: number;
    zoneExhaustAir: number;
    zoneDehumidValue: number;
    zoneRemovedWater: number;
    zoneResultantCfm: number;
    zoneRoomACValue: number;
    zoneRoomTermSupplyValue: number;
    zoneCfmACLoadTR: number;
    zoneResultCoolLoadTR: number;
    zoneAddWaterValue: number;
    zoneHumidValue: number;
    zoneResultantHeatCfm: number;
    zoneRoomTermSupplyHeatValue: number;
    zoneCfmHeatLoadTRValue: number;
    zoneRoomHeatLoadTR: number;
    zoneResultHeatLoadTR: number;
}

const ensureNumber = (val: any): number => {
    const num = Number(val);
    return Number.isFinite(num) ? num : 0;
};

export const normalizeSystemName = (value: any) =>
    String(value || "")
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase();

export const isSystemMatch = (
    zoneSystem: string,
    values: string | string[] = [],
) => {
    const valueArray = typeof values === "string" ? [values] : values;

    return valueArray.some(
        (item) => normalizeSystemName(item) === normalizeSystemName(zoneSystem),
    );
};

const hasExhaust = (item: ZonePayload) => ensureNumber(item.exhaustAir) !== 0;

const addRoomToTotals = (
    target: AccumulatorTotals,
    room: ZonePayload,
): void => {
    target.zoneArea += ensureNumber(room.areaFt2);
    target.zoneVolume += ensureNumber(room.volumeFt3);
    target.zoneRoomCfm += ensureNumber(room.roomCfm);
    target.zoneFreshAir += ensureNumber(room.freshAir);
    target.zoneResultantSupplyAir += ensureNumber(room.ResultantSupplyAir);
    target.zoneExhaustAir += ensureNumber(room.exhaustAir);
    target.zoneDehumidValue += ensureNumber(room.dehumidValue);
    target.zoneRemovedWater += ensureNumber(room.removedWater);
    target.zoneResultantCfm += ensureNumber(room.resultantCfm);
    target.zoneRoomACValue += ensureNumber(room.roomACValue);
    target.zoneRoomTermSupplyValue += ensureNumber(room.roomTermSupplyValue);
    target.zoneCfmACLoadTR += ensureNumber(room.cfmACLoadTR);
    target.zoneResultCoolLoadTR += ensureNumber(room.resultCoolLoadTR);
    target.zoneAddWaterValue += ensureNumber(room.addWaterValue);
    target.zoneHumidValue += ensureNumber(room.humidValue);
    target.zoneResultantHeatCfm += ensureNumber(room.resultantheatCfm);
    target.zoneRoomTermSupplyHeatValue += ensureNumber(
        room.roomTermSupplyHeatValue,
    );
    target.zoneCfmHeatLoadTRValue += ensureNumber(room.cfmHeatLoadTRValue);
    target.zoneRoomHeatLoadTR += ensureNumber(room.roomHeatLoadTR);
    target.zoneResultHeatLoadTR += ensureNumber(room.resultHeatLoadTR);
};

export function cumulativeZoneService(
    zoneName: string,
    rooms: ZonePayload[],
): CalculatedZoneResults {
    const zoneSystem = rooms.length > 0 ? rooms[0].zoneSystem : "";
    const zoneClassification =
        rooms.length > 0 ? rooms[0].zoneClassification : "";
    const zoneReqInsideTempC =
        rooms.length > 0 ? rooms[0].zoneReqInsideTempC : "";

    const totals: AccumulatorTotals = {
        zoneArea: 0,
        zoneVolume: 0,
        zoneRoomCfm: 0,
        zoneFreshAir: 0,
        zoneResultantSupplyAir: 0,
        zoneExhaustAir: 0,
        zoneDehumidValue: 0,
        zoneRemovedWater: 0,
        zoneResultantCfm: 0,
        zoneRoomACValue: 0,
        zoneRoomTermSupplyValue: 0,
        zoneCfmACLoadTR: 0,
        zoneResultCoolLoadTR: 0,
        zoneAddWaterValue: 0,
        zoneHumidValue: 0,
        zoneResultantHeatCfm: 0,
        zoneRoomTermSupplyHeatValue: 0,
        zoneCfmHeatLoadTRValue: 0,
        zoneRoomHeatLoadTR: 0,
        zoneResultHeatLoadTR: 0,
    };

    rooms.forEach((room) => addRoomToTotals(totals, room));

    console.log(`Cumulative totals for `, totals.zoneResultantHeatCfm);
    return {
        zoneName,
        zoneSystem,
        zoneClassification,
        zoneReqInsideTempC,
        zoneArea: Number(totals.zoneArea.toFixed(2)),
        zoneVolume: Number(totals.zoneVolume.toFixed(2)),
        zoneRoomCfm: Number(totals.zoneRoomCfm.toFixed(2)),
        zoneFreshAir: Number(totals.zoneFreshAir.toFixed(2)),
        zoneResultantSupplyAir: Number(totals.zoneResultantSupplyAir.toFixed(2)),
        zoneExhaustAir: Number(totals.zoneExhaustAir.toFixed(2)),
        zoneDehumidValue: Number(totals.zoneDehumidValue.toFixed(2)),
        zoneRemovedWater: Number(totals.zoneRemovedWater.toFixed(3)),
        zoneResultantCfm: Number(totals.zoneResultantCfm.toFixed(2)),
        zoneRoomACValue: Number(totals.zoneRoomACValue.toFixed(2)),
        zoneRoomTermSupplyValue: Number(totals.zoneRoomTermSupplyValue.toFixed(2)),
        zoneCfmACLoadTR: Number(totals.zoneCfmACLoadTR.toFixed(2)),
        zoneResultCoolLoadTR: Number(totals.zoneResultCoolLoadTR.toFixed(2)),
        zoneAddWaterValue: Number(totals.zoneAddWaterValue.toFixed(2)),
        zoneHumidValue: Number(totals.zoneHumidValue.toFixed(2)),
        zoneResultantHeatCfm: Number(totals.zoneResultantHeatCfm.toFixed(2)),
        zoneRoomTermSupplyHeatValue: Number(
            totals.zoneRoomTermSupplyHeatValue.toFixed(2),
        ),
        zoneCfmHeatLoadTRValue: Number(totals.zoneCfmHeatLoadTRValue.toFixed(2)),
        zoneRoomHeatLoadTR: Number(totals.zoneRoomHeatLoadTR.toFixed(2)),
        zoneResultHeatLoadTR: Number(totals.zoneResultHeatLoadTR.toFixed(2)),
    };
}

const createPayload = (
    zoneId: number | string,
    flag: ZoneFlag,
    user_id: string,
    results: ZonePayload[],
    mode: "ALL" | "COOLING" | "HEATING" = "ALL",
) => {
    const zoneName = `Zone ${zoneId}`;
    const totals = cumulativeZoneService(zoneName, results);

    return {
        zoneId,
        payload: {
            ExhaustFlag: flag,
            user_id,
            zone_name: zoneName,

            zone_Area: totals.zoneArea,
            zone_Volume: totals.zoneVolume,
            zone_RoomCfm: totals.zoneRoomCfm,
            zone_FreshAir: totals.zoneFreshAir,
            zone_ResultantSupplyAir: totals.zoneResultantSupplyAir,
            zone_ExhaustAir: totals.zoneExhaustAir,

            zone_DehumidCfm: mode === "HEATING" ? 0 : totals.zoneDehumidValue,
            zone_Rem_Water_Vapour: mode === "HEATING" ? 0 : totals.zoneRemovedWater,
            zone_ResultCfm: mode === "HEATING" ? 0 : totals.zoneResultantCfm,
            zone_Room_Termi_Supply_Mod:
                mode === "HEATING" ? 0 : totals.zoneRoomTermSupplyValue,
            zone_Room_AC_Load_TR: mode === "HEATING" ? 0 : totals.zoneRoomACValue,
            zone_Cfm_AC_Load_TR: mode === "HEATING" ? 0 : totals.zoneCfmACLoadTR,
            zone_Res_Cooling_Load_TR:
                mode === "HEATING" ? 0 : totals.zoneResultCoolLoadTR,

            zone_add_Water_Vapour: mode === "COOLING" ? 0 : totals.zoneAddWaterValue,
            zone_HumidCfm: mode === "COOLING" ? 0 : totals.zoneHumidValue,
            zone_ResultCfm_Hot:
                mode === "COOLING" ? 0 : totals.zoneResultantHeatCfm,
            zone_Room_Term_Supply_Mod:
                mode === "COOLING" ? 0 : totals.zoneRoomTermSupplyHeatValue,
            zone_Room_Heating_Load_TR:
                mode === "COOLING" ? 0 : totals.zoneRoomHeatLoadTR,
            zone_Cfm_Heating_Load_TR:
                mode === "COOLING" ? 0 : totals.zoneCfmHeatLoadTRValue,
            zone_Result_Heating_Load_TR:
                mode === "COOLING" ? 0 : totals.zoneResultHeatLoadTR,
        },
    };
};

export const buildZoneTotalsByFlag = (
    flatResults: ZoneGroupInput[],
    systemCond: any,
    user_id: string,
) => {
    const zoneMap = new Map<
        number | string,
        {
            zoneSystem: string;
            primary: ZonePayload[];
            ventilation: ZonePayload[];
        }
    >();

    flatResults.forEach(({ room, result, resultLabel }) => {
        const zoneId = room.zoneId;

        if (!zoneMap.has(zoneId)) {
            zoneMap.set(zoneId, {
                zoneSystem: String(room.zoneSystem || "").trim(),
                primary: [],
                ventilation: [],
            });
        }

        if (resultLabel === "VENTILATION") {
            zoneMap.get(zoneId)!.ventilation.push(result);
        } else {
            zoneMap.get(zoneId)!.primary.push(result);
        }
    });

    const output: {
        zoneId: number | string;
        payload: any;
    }[] = [];

    zoneMap.forEach(({ zoneSystem, primary, ventilation }, zoneId) => {
        const isVentilationOnly = isSystemMatch(zoneSystem, systemCond.ventilation);

        const isCoolingVentilation = isSystemMatch(
            zoneSystem,
            systemCond.coolingVentilation,
        );

        const isHeatingVentilation = isSystemMatch(
            zoneSystem,
            systemCond.heatingVentilation,
        );

        const isCoolingHeating =
            isSystemMatch(zoneSystem, systemCond.coolingHeating || []) ||
            isSystemMatch(zoneSystem, [
                "Air Cooling and Heating System",
                "Air Cooling and Air Heating System",
            ]);

        if (isCoolingHeating) {
            output.push(createPayload(zoneId, "CS", user_id, primary, "COOLING"));
            output.push(createPayload(zoneId, "HS", user_id, primary, "HEATING"));

            const exhaustRows = primary.filter(hasExhaust);
            if (exhaustRows.length > 0) {
                output.push(createPayload(zoneId, "E", user_id, exhaustRows));
            }

            return;
        }

        if (isVentilationOnly) {
            output.push(createPayload(zoneId, "VS", user_id, primary));

            const ventExhaustRows = primary.filter(hasExhaust);
            if (ventExhaustRows.length > 0) {
                output.push(createPayload(zoneId, "VE", user_id, ventExhaustRows));
            }

            return;
        }

        output.push(createPayload(zoneId, "S", user_id, primary));

        const exhaustRows = primary.filter(hasExhaust);
        if (exhaustRows.length > 0) {
            output.push(createPayload(zoneId, "E", user_id, exhaustRows));
        }

        if (isCoolingVentilation || isHeatingVentilation) {
            output.push(createPayload(zoneId, "VS", user_id, ventilation));

            const ventExhaustRows = ventilation.filter(hasExhaust);
            if (ventExhaustRows.length > 0) {
                output.push(createPayload(zoneId, "VE", user_id, ventExhaustRows));
            }
        }
    });

    return output;
};