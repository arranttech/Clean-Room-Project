import boqresult from "../../json/boqresult.json";
import { CalculatedZoneResults } from "../services/cummulativecal.ts";
import { RoomPayload } from "../services/service.ts";
import { getSystemFlags } from "./service.ts";

export type RoomBOQPayload = RoomPayload;
export type BOQPayload = CalculatedZoneResults;


const s = boqresult.fields.NumberofStagesFilter;
const sp = boqresult.fields.StaticPressure;
const bdb = boqresult.fields.BDB;
const m = boqresult.fields.MotorHP;
const c = boqresult.fields.RowsofCoolingCoil.Coolval;
const w = boqresult.fields.WaterLS.waterval;


export function boqresults(zone: BOQPayload, room?: RoomBOQPayload) {

    const currentZoneSystem = zone.zoneSystem ?? "";
    const { showCooling, showHeating } =
        getSystemFlags(currentZoneSystem, room || {} as RoomPayload);

    const isHeatingandCooling = showCooling && showHeating;
    const ahu = boqresult.fields.AHUSize;

    let classification = String(room?.zoneClassification ?? zone.zoneClassification ?? "").trim().toUpperCase();
    let rawTemp = zone.zoneReqInsideTempC;
    let temp = String(rawTemp ?? "").trim().toUpperCase();
    let isNumericTemp = rawTemp !== null && rawTemp !== undefined && !isNaN(Number(rawTemp));

    const AHUCoolLoadTR = zone.zoneResultCoolLoadTR;
    let ChilledWaterGPM = 0;
    let HotWaterGPM = 0;


    function calculatedAHUCfm(): number {
        const coolingCfm = Math.ceil((zone.zoneResultantCfm || 0) / 250) * 250;
        const heatingCfm = Math.ceil((zone.zoneResultantHeatCfm || 0) / 250) * 250;

        if (isHeatingandCooling) return Math.max(coolingCfm, heatingCfm);
        if (showCooling) return coolingCfm;
        if (showHeating) return heatingCfm;
        return 0;
    }

    function calculateAHUWidth(cfm: number) {
        const limits = ahu.AHUWidthCfm.AHUWdCfm;
        const widths = ahu.AHUWidthCfm.AHUWidth;
        for (const key in limits) {
            const k = key as keyof typeof limits;
            if (cfm <= limits[k]) return widths[k];
        }
        return widths[8];
    }

    function calculateAHUHeight(cfm: number) {
        const limits = ahu.AHUHeightCfm.AHUHtCfm;
        const height = ahu.AHUHeightCfm.AHUHeight;
        for (const key in limits) {
            const k = key as keyof typeof limits;
            if (cfm <= limits[k]) return height[k];
        }
        return height[8];
    }

    function calculateFilterStages(): number {
        if (!classification) return 3;
        const stage3Match = s.stage3Or4?.some(item => String(item).trim().toUpperCase() === classification);
        const stage4Match = s.stage4Or5?.some(item => String(item).trim().toUpperCase() === classification);

        if (!isNumericTemp && temp !== "") {
            if (stage3Match) return 4;
            if (stage4Match) return 5;
            return 3;
        }
        if (isNumericTemp) {
            if (stage3Match) return 3;
            if (stage4Match) return 4;
        }
        return 3;
    }

    function calculateStaticPressure(stages: number): number {
        const sptemp = sp.SPTempNum;
        const spval = sp.SPVal;

        if (isNumericTemp) {
            if (stages === sptemp[4]) return spval[8];
            else if (stages === sptemp[3]) return spval[6];
            else if (stages === sptemp[2]) return spval[5];
            else if (stages === sptemp[1]) return spval[4];
            else return spval[6];
        }
        if (!isNumericTemp && temp !== "") {
            if (stages === sptemp[5]) return spval[7];
            else if (stages === sptemp[4]) return spval[5];
            else if (stages === sptemp[3]) return spval[3];
            else if (stages === sptemp[2]) return spval[2];
            else if (stages === sptemp[1]) return spval[1];
            return spval[4];
        }
        return 0;
    }

    function calculateBDB(cfm: number): number | string {
        const bdbCfm = bdb.BDBCfm;
        const bdbVal = bdb.BDBVal;
        for (const key in bdbCfm) {
            const k = key as keyof typeof bdbCfm;
            if (cfm <= bdbCfm[k]) return bdbVal[k];
        }
        return "Refer";
    }

    function calculateMotorHP(cfm: number, staticPressure: number): number | string {
        const mtpw = m.powerval;
        const mtbdb = m.BDBKw;
        const powerValue = (cfm * staticPressure) / mtpw;

        for (const key in mtbdb) {
            const k = key as keyof typeof mtbdb;
            if (powerValue <= mtbdb[k]) return mtbdb[k];
        }
        return "Refer";
    }

    function calculateCoolingCoil(width: number, height: number, ahucoolload: number): number | any {
        const requiredload = Math.max(zone.zoneRoomACValue, zone.zoneCfmACLoadTR);
        const baseCapacity = ((width - c[0]) * (height - c[1]) * c[2]) / c[3];

        if (ahucoolload === 0 && (!isNumericTemp && temp !== "")) {
            return zone.zoneReqInsideTempC;
        }

        if (baseCapacity >= requiredload) return 4;
        else if (baseCapacity * c[4] >= requiredload) return 6;
        else if (baseCapacity * c[5] >= requiredload) return 8;

        return 0;
    }

    function calculateAHULength(bdb: number, stages: number, coolingcoil: number): number | string {
        const ahuln = boqresult.fields.AHUSize.AHULengthCfm;
        const ahubdb = ahuln.BDB;
        const ahudbdval = ahuln.BlowerLength;

        const ahufltr = ahuln.FilterStages;
        const ahufltrval = ahuln.FilterLength;
        const ahucool = ahuln.CoolingCoil;
        const ahucoolval = ahuln.CoilLength;


        let BlowerLength: number = ahudbdval[ahudbdval.length - 1];
        let FilterLength: number = 0;
        let CoilLength: number = 0;
        let AHUlength: number;

        for (let i = 0; i < ahubdb.length; i++) {
            if (bdb <= ahubdb[i]) {
                BlowerLength = ahudbdval[i];
                break;
            }
        }
        const totalBlowerLength = BlowerLength;

        for (let i = 0; i < ahufltr.length; i++) {
            if (stages === ahufltr[i]) {
                FilterLength = ahufltrval[i];
                break;
            }
        }

        const totalFilterLength = FilterLength;

        for (let i = 0; i < ahucool.length; i++) {
            if (coolingcoil <= ahucool[i]) {
                CoilLength = ahucoolval[i];
                break;
            }
        }

        const totalCoilLength = CoilLength;

        const totalLength = totalBlowerLength + totalFilterLength + totalCoilLength;

        if (totalLength < 4000) {
            AHUlength = totalLength;
        }

        else AHUlength = totalLength + 400;

        return AHUlength;
    }

    function calculateGPM(): number {
        ChilledWaterGPM = Math.max(zone.zoneRoomACValue, zone.zoneCfmACLoadTR) * 4;
        HotWaterGPM = Math.max(zone.zoneRoomHeatLoadTR, zone.zoneCfmHeatLoadTRValue) * 4;

        if (isHeatingandCooling) return Math.max(ChilledWaterGPM, HotWaterGPM);
        if (showCooling) return ChilledWaterGPM;
        if (showHeating) return HotWaterGPM;
        return 0;
    }

    function calculateWaterLS(GPM: number): number {
        const ChilledWaterLS = GPM * w;
        return Math.round(ChilledWaterLS * 10) / 10;
    }



    const finalCfm = calculatedAHUCfm();
    const finalStages = calculateFilterStages();
    const finalStaticPressure = calculateStaticPressure(finalStages);
    const finalBDB = calculateBDB(finalCfm);
    const finalMotorHP = calculateMotorHP(finalCfm, finalStaticPressure);
    const finalWidth = calculateAHUWidth(finalCfm);
    const finalHeight = calculateAHUHeight(finalCfm);
    const finalCoolingCoil = calculateCoolingCoil(finalWidth, finalHeight, Number(AHUCoolLoadTR));
    const finalLength = calculateAHULength(Number(finalBDB), finalStages, Number(finalCoolingCoil));
    const finalWaterGPM = calculateGPM();
    const finalWaterLS = calculateWaterLS(finalWaterGPM);


    return {
        zoneName: zone.zoneName,
        AHUCfm: finalCfm,
        AHUWidth: finalWidth,
        AHUHeight: finalHeight,
        AHULength: finalLength,
        stageFilter: finalStages,
        staticPressure: finalStaticPressure,
        BDB: finalBDB,
        motorHP: finalMotorHP,
        AHUCoolingLoadTR: Number(AHUCoolLoadTR),
        coolingCoil: finalCoolingCoil,
        AHUlength: finalLength,
        WaterGPM: finalWaterGPM,
        WaterLS: finalWaterLS
    };
}