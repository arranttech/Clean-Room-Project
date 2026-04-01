import { AirflowResults } from "../services/service.ts";

export type ZonePayload = AirflowResults;

export type CalculatedZoneResults = {
	zoneName: string;
	zoneSystem: string;
	zoneClassification?: string;
	zoneReqInsideTempC?: number | string;
	zoneArea: number;
	zoneVolume: number;
	zoneRoomCfm: number;
	zoneFreshAir: number;
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
	totalFiltrationStages?: number;
	staticPressure?: number;
	pipeConfiguration?: string;
	flowVelocity?: number;
	heatingFlowVelocity?: number;
	coolingFlowVelocity?: number;
};

const ensureNumber = (val: any): number => {
	return typeof val === "number" && !isNaN(val) ? val : 0;
};

export function cumulativeZoneService(
	zoneName: string,
	rooms: ZonePayload[]
): CalculatedZoneResults {
	const zoneSystem = rooms.length > 0 ? rooms[0].zoneSystem : "";
	const zoneClassification =
		rooms.length > 0 ? rooms[0].zoneClassification : "";
	const zoneReqInsideTempC =
		rooms.length > 0 ? rooms[0].zoneReqInsideTempC : "";

	const totals = rooms.reduce(
		(acc, room) => {
			return {
				zoneName: zoneName,
				zoneArea: acc.zoneArea + ensureNumber(room.areaFt2),
				zoneVolume: acc.zoneVolume + ensureNumber(room.volumeFt3),
				zoneRoomCfm: acc.zoneRoomCfm + ensureNumber(room.roomCfm),
				zoneFreshAir: acc.zoneFreshAir + ensureNumber(room.freshAir),
				zoneExhaustAir: acc.zoneExhaustAir + ensureNumber(room.exhaustAir),
				zoneDehumidValue:
					acc.zoneDehumidValue + ensureNumber(room.dehumidValue),
				zoneRemovedWater:
					acc.zoneRemovedWater + ensureNumber(room.removedWater),
				zoneResultantCfm:
					acc.zoneResultantCfm + ensureNumber(room.resultantCfm),
				zoneRoomACValue: acc.zoneRoomACValue + ensureNumber(room.roomACValue),
				zoneRoomTermSupplyValue:
					acc.zoneRoomTermSupplyValue + ensureNumber(room.roomTermSupplyValue),
				zoneCfmACLoadTR: acc.zoneCfmACLoadTR + ensureNumber(room.cfmACLoadTR),
				zoneResultCoolLoadTR:
					acc.zoneResultCoolLoadTR + ensureNumber(room.resultCoolLoadTR),
				zoneAddWaterValue:
					acc.zoneAddWaterValue + ensureNumber(room.addWaterValue),
				zoneHumidValue: acc.zoneHumidValue + ensureNumber(room.humidValue),
				zoneResultantHeatCfm:
					acc.zoneResultantHeatCfm + ensureNumber(room.resultantheatCfm),
				zoneRoomTermSupplyHeatValue:
					acc.zoneRoomTermSupplyHeatValue +
					ensureNumber(room.roomTermSupplyHeatValue),
				zoneCfmHeatLoadTRValue:
					acc.zoneCfmHeatLoadTRValue + ensureNumber(room.cfmHeatLoadTRValue),
				zoneRoomHeatLoadTR:
					acc.zoneRoomHeatLoadTR + ensureNumber(room.roomHeatLoadTR),
				zoneResultHeatLoadTR:
					acc.zoneResultHeatLoadTR + ensureNumber(room.resultHeatLoadTR),
			};
		},
		{
			zoneName: zoneName,
			zoneArea: 0,
			zoneVolume: 0,
			zoneRoomCfm: 0,
			zoneFreshAir: 0,
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
		}
	);

	return {
		zoneName: zoneName,
		zoneSystem: zoneSystem,
		zoneClassification: zoneClassification,
		zoneReqInsideTempC: zoneReqInsideTempC,
		zoneArea: Number(totals.zoneArea.toFixed(2)),
		zoneVolume: Number(totals.zoneVolume.toFixed(2)),
		zoneRoomCfm: Number(totals.zoneRoomCfm.toFixed(2)),
		zoneFreshAir: Number(totals.zoneFreshAir.toFixed(2)),
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
			totals.zoneRoomTermSupplyHeatValue.toFixed(2)
		),
		zoneCfmHeatLoadTRValue: Number(totals.zoneCfmHeatLoadTRValue.toFixed(2)),
		zoneRoomHeatLoadTR: Number(totals.zoneRoomHeatLoadTR.toFixed(2)),
		zoneResultHeatLoadTR: Number(totals.zoneResultHeatLoadTR.toFixed(2)),
	};
}
