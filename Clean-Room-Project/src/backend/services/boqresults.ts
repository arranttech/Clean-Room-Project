import boqresult from "../../json/boqresult.json";
import { CalculatedZoneResults } from "../services/cummulativecal";
import { RoomPayload } from "../services/service";
import { getSystemFlags } from "./service";

export type RoomBOQPayload = RoomPayload;
export type BOQPayload = CalculatedZoneResults;

// Mapping constants from JSON
const bdb = boqresult.fields.BDB;
const m = boqresult.fields.MotorHP;
const c = boqresult.fields.RowsofCoolingCoil.Coolval;
const w = boqresult.fields.WaterLS.waterval;
const ps = boqresult.fields.PipeSize.pipesize;

export function boqresults(zone: BOQPayload, room?: RoomBOQPayload) {
    const flowVelocity = zone.flowVelocity ?? 0;
    const heatingFlowVelocity = zone.heatingFlowVelocity ?? 0;
    const coolingFlowVelocity = zone.coolingFlowVelocity ?? 0;
    const totalFiltrationStages = zone.totalFiltrationStages ?? 0;
    const StaticPressure = zone.staticPressure ?? 0;
    const pipeConfiguration = zone.pipeConfiguration ?? "";

    const currentZoneSystem = zone.zoneSystem ?? "";
    const { showCooling, showHeating } = getSystemFlags(currentZoneSystem, room || {} as RoomPayload);

    const isHeatingandCooling = showCooling && showHeating;
    const ahu = boqresult.fields.AHUSize;

    let rawTemp = zone.zoneReqInsideTempC;
    let temp = String(rawTemp ?? "").trim().toUpperCase();
    let isNumericTemp = rawTemp !== null && rawTemp !== undefined && !isNaN(Number(rawTemp));

    const AHUCoolLoadTR = zone.zoneResultCoolLoadTR ?? 0;


    function calculatedAHUCfm(): number {
        const exhaustAir = Number(zone.zoneExhaustAir || 0);
        const coolingBase = Number(zone.zoneResultantCfm || 0);
        const heatingBase = Number(zone.zoneResultantHeatCfm || 0);

        const coolingCfm = Math.ceil(coolingBase / 250) * 250;
        const heatingCfm = Math.ceil(heatingBase / 250) * 250;
        const exhaustCfm = Math.ceil(exhaustAir / 250) * 250;

        if (exhaustAir > 0) return exhaustCfm;
        if (isHeatingandCooling) return Math.max(coolingCfm, heatingCfm);
        if (showCooling) return coolingCfm;
        if (showHeating) return heatingCfm;

        return 0;
    }

    function calculateAHUWidth(cfm: number): number {
        const limits = ahu.AHUWidthCfm.AHUWdCfm;
        const widths = ahu.AHUWidthCfm.AHUWidth;
        for (const key in limits) {
            const k = key as keyof typeof limits;
            if (cfm <= limits[k]) return widths[k];
        }
        return widths[8];
    }

    function calculateAHUHeight(cfm: number): number {
        const limits = ahu.AHUHeightCfm.AHUHtCfm;
        const height = ahu.AHUHeightCfm.AHUHeight;
        for (const key in limits) {
            const k = key as keyof typeof limits;
            if (cfm <= limits[k]) return height[k];
        }
        return height[8];
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
        if (zone.zoneExhaustAir > 0) return 0;
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

    function calculateAHULength(bdbVal: number, stages: number, coolingcoil: number): number {
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

        for (let i = 0; i < ahubdb.length; i++) {
            if (bdbVal <= ahubdb[i]) {
                BlowerLength = ahudbdval[i];
                break;
            }
        }

        for (let i = 0; i < ahufltr.length; i++) {
            if (stages === ahufltr[i]) {
                FilterLength = ahufltrval[i];
                break;
            }
        }

        for (let i = 0; i < ahucool.length; i++) {
            if (coolingcoil <= ahucool[i]) {
                CoilLength = ahucoolval[i];
                break;
            }
        }

        const totalLength = BlowerLength + FilterLength + CoilLength;
        return totalLength < 4000 ? totalLength : totalLength + 400;
    }

    function calculateGPM(): number {
        if (zone.zoneExhaustAir > 0) return 0;
        const ChilledWaterGPM = Math.max(zone.zoneRoomACValue || 0, zone.zoneCfmACLoadTR || 0) * 4;
        const HotWaterGPM = Math.max(zone.zoneRoomHeatLoadTR || 0, zone.zoneCfmHeatLoadTRValue || 0) * 4;

        if (isHeatingandCooling) return Math.max(ChilledWaterGPM, HotWaterGPM);
        if (showCooling) return ChilledWaterGPM;
        if (showHeating) return HotWaterGPM;
        return 0;
    }

    function displayflowvelocity(): number | number[] {
        if (isHeatingandCooling) {
            if (pipeConfiguration.toUpperCase() === "SINGLE PIPE") {
                return heatingFlowVelocity || coolingFlowVelocity;
            }
            return [heatingFlowVelocity, coolingFlowVelocity];
        }
        if (showCooling || showHeating) {
            return flowVelocity;
        }
        return 0;
    }

    function calculateWaterLS(GPM: number): number {
        if (zone.zoneExhaustAir > 0 || !GPM) return 0;
        // Rounding to 1 decimal place
        return Math.round((GPM * w) * 10) / 10;
    }

    function calculatePipeSize(GPM: number, velocity: number | number[]): number | number[] {
        const calc = (v: number) => {
            if (!GPM || !v || v === 0) return 0;

            const p1 = Number(ps[0]);
            const p2 = Number(ps[1]);
            const p3 = Number(ps[2]);
            const p4 = Number(ps[3]);

            if (isNaN(p1) || isNaN(p2) || isNaN(p3) || isNaN(p4)) return 0;

            const formulaPart = (p1 * GPM * p2) / (p3 * v);
            const val = Math.sqrt(formulaPart) * p4;
            
            return Math.round(val * 10) / 10; 
        };

        if (Array.isArray(velocity)) {
            return velocity.map(v => calc(v));
        }
        return calc(velocity);
    }

    const finalCfm = calculatedAHUCfm();
    const finalBDB = calculateBDB(finalCfm);
    const finalWidth = calculateAHUWidth(finalCfm);
    const finalHeight = calculateAHUHeight(finalCfm);
    const finalCoolingCoil = calculateCoolingCoil(finalWidth, finalHeight, Number(AHUCoolLoadTR));
    
    const displayVelocity = displayflowvelocity();
    const finalWaterGPM = calculateGPM();

    return {
        zoneName: zone.zoneName,
        AHUCfm: finalCfm,
        AHUWidth: finalWidth,
        AHUHeight: finalHeight,
        AHULength: calculateAHULength(Number(finalBDB), totalFiltrationStages, Number(finalCoolingCoil)),
        stageFilter: totalFiltrationStages,
        staticPressure: StaticPressure,
        BDB: finalBDB,
        motorHP: calculateMotorHP(finalCfm, StaticPressure),
        AHUCoolingLoadTR: Number(AHUCoolLoadTR),
        coolingCoil: finalCoolingCoil,
        WaterGPM: finalWaterGPM,
        WaterLS: calculateWaterLS(finalWaterGPM),
        flowVelocity: displayVelocity,
        PipeSize: calculatePipeSize(finalWaterGPM, displayVelocity)
    };
}