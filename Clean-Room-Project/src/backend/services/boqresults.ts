import boqresult from "../../json/boqresult.json";
import { CalculatedZoneResults } from "../services/cummulativecal";
import { RoomPayload } from "../services/service";
import { getSystemFlags } from "./service";

export type RoomBOQPayload = RoomPayload;
export type BOQPayload = CalculatedZoneResults;

const bdb = boqresult?.fields?.BDB;
const m = boqresult?.fields?.MotorHP;
const c = boqresult?.fields?.RowsofCoolingCoil?.Coolval || [];
const w = boqresult?.fields?.WaterLS?.waterval || 0;
const ps = boqresult?.fields?.PipeSize?.pipesize || [];

export function boqresults(zone: BOQPayload, room?: RoomBOQPayload) {
    try {
        const flowVelocity = zone.flowVelocity ?? 0;
        const heatingFlowVelocity = zone.heatingFlowVelocity ?? 0;
        const coolingFlowVelocity = zone.coolingFlowVelocity ?? 0;
        const totalFiltrationStagesSupply = zone.totalFiltrationStagesSupply ?? 0;
        const totalFiltrationStagesExhaust = zone.totalFiltrationStagesExhaust ?? 0;
        const staticPressureSupply = zone.staticPressureSupply ?? 0;
        const staticPressureExhaust = zone.staticPressureExhaust ?? 0;
        const pipeConfiguration = zone.pipeConfiguration ?? "";

        const currentZoneSystem = zone.zoneSystem ?? "";
        const currentZoneSystemType = room?.zoneSystemType ?? "";

        const { showCooling, showHeating, isVentilationSystem } =
            getSystemFlags(currentZoneSystem, currentZoneSystemType, room || {} as RoomPayload);

        const isHeatingandCooling = showCooling && showHeating;
        const ahu = boqresult?.fields?.AHUSize;

        let rawTemp = zone.zoneReqInsideTempC;
        let temp = String(rawTemp ?? "").trim().toUpperCase();
        let isNumericTemp =
            rawTemp !== null && rawTemp !== undefined && !isNaN(Number(rawTemp));

        const AHUCoolLoadTR = zone.zoneResultCoolLoadTR ?? 0;

        // ================= CFM =================
        function calculatedAHUCfm(): number {
            const exhaustAir = Number(zone.zoneExhaustAir || 0);
            const freshAir = Number(zone.zoneFreshAir || 0);
            const roomCFM = Number(zone.zoneRoomCfm || 0);
            const coolingBase = Number(zone.zoneResultantCfm || 0);
            const heatingBase = Number(zone.zoneResultantHeatCfm || 0);

            let ahuCfm = 0;

            const coolingCfm =
                exhaustAir !== 0
                    ? Math.ceil((exhaustAir * 1.10) / 50) * 50
                    : Math.ceil(coolingBase / 250) * 250;

            const heatingCfm =
                exhaustAir !== 0
                    ? Math.ceil((exhaustAir * 1.10) / 50) * 50
                    : Math.ceil(heatingBase / 250) * 250;

            const ventilationCfm =
                exhaustAir !== 0
                    ? Math.ceil(roomCFM / 250) * 250
                    : Math.ceil(freshAir / 100) * 100;

            if (isVentilationSystem) ahuCfm = ventilationCfm;
            else if (isHeatingandCooling) ahuCfm = Math.max(coolingCfm, heatingCfm);
            else if (showCooling) ahuCfm = coolingCfm;
            else if (showHeating) ahuCfm = heatingCfm;

            return ahuCfm;
        }

        // Clamp CFM
        const MAX_CFM = 40000;
        const finalCfmRaw = calculatedAHUCfm();
        const finalCfm = Math.min(finalCfmRaw, MAX_CFM);

        // ================= AHU SIZE =================
        function calculateAHUWidth(cfm: number): number {
            const limits = ahu?.AHUWidthCfm?.AHUWdCfm || {};
            const widths = ahu?.AHUWidthCfm?.AHUWidth || {};

            for (const key in limits) {
                const k = key as keyof typeof limits;
                if (cfm <= limits[k]) return widths[k];
            }

            const lastKey = Object.keys(widths).pop() as keyof typeof widths;
            return widths[lastKey] || 0;
        }

        function calculateAHUHeight(cfm: number): number {
            const limits = ahu?.AHUHeightCfm?.AHUHtCfm || {};
            const height = ahu?.AHUHeightCfm?.AHUHeight || {};

            for (const key in limits) {
                const k = key as keyof typeof limits;
                if (cfm <= limits[k]) return height[k];
            }

            const lastKey = Object.keys(height).pop() as keyof typeof height;
            return height[lastKey] || 0;
        }

       
        function calculateBDB(cfm: number): number | string {
            const bdbCfm = bdb?.BDBCfm || {};
            const bdbVal = bdb?.BDBVal || {};

            for (const key in bdbCfm) {
                const k = key as keyof typeof bdbCfm;
                if (cfm <= bdbCfm[k]) return bdbVal[k];
            }

            return "Refer";
        }

        function calculateMotorHP(cfm: number, staticPressure: number): number {
            const mtpw = m?.powerval || 0;
            const mtbdb = m?.BDBKw || {};

            if (!mtpw) return 0;

            const powerValue = (cfm * staticPressure) / mtpw;

            for (const key in mtbdb) {
                const k = key as keyof typeof mtbdb;
                if (powerValue <= mtbdb[k]) return mtbdb[k];
            }

            const lastKey = Object.keys(mtbdb).pop() as keyof typeof mtbdb;
            return Number(mtbdb[lastKey] || 0);
        }

        function calculateCoolingCoil(width: number, height: number, ahucoolload: number): number {
            if (isVentilationSystem) return 0;
            if (!c || c.length < 6) return 0;
            if (zone.zoneExhaustAir > 0) return 0;

            const requiredload = Math.max(
                Number(zone.zoneRoomACValue || 0),
                Number(zone.zoneCfmACLoadTR || 0)
            );

            const baseCapacity =
                ((width - c[0]) * (height - c[1]) * c[2]) / c[3];

            if (ahucoolload === 0 && (!isNumericTemp && temp !== "")) {
                return 0;
            }

            if (baseCapacity >= requiredload) return 4;
            else if (baseCapacity * c[4] >= requiredload) return 6;
            else if (baseCapacity * c[5] >= requiredload) return 8;

            return 0;
        }

        function calculateAHULength(bdbVal: number, stages: number, coolingcoil: number): number {
            const ahuln = ahu?.AHULengthCfm;
            if (!ahuln) return 0;

            const ahubdb = ahuln.BDB || [];
            const ahudbdval = ahuln.BlowerLength || [];
            const ahufltr = ahuln.FilterStages || [];
            const ahufltrval = ahuln.FilterLength || [];
            const ahucool = ahuln.CoolingCoil || [];
            const ahucoolval = ahuln.CoilLength || [];

            let BlowerLength = ahudbdval[ahudbdval.length - 1] || 0;
            let FilterLength = 0;
            let CoilLength = 0;

            for (let i = 0; i < ahubdb.length; i++) {
                if (bdbVal <= ahubdb[i]) {
                    BlowerLength = ahudbdval[i] || BlowerLength;
                    break;
                }
            }

            for (let i = 0; i < ahufltr.length; i++) {
                if (stages === ahufltr[i]) {
                    FilterLength = ahufltrval[i] || 0;
                    break;
                }
            }

            for (let i = 0; i < ahucool.length; i++) {
                if (coolingcoil <= ahucool[i]) {
                    CoilLength = ahucoolval[i] || 0;
                    break;
                }
            }

            const totalLength = BlowerLength + FilterLength + CoilLength;
            return totalLength < 4000 ? totalLength : totalLength + 400;
        }

        function calculateGPM(): number {
            if (isVentilationSystem) return 0;
            if (zone.zoneExhaustAir > 0) return 0;

            const ChilledWaterGPM =
                Math.max(zone.zoneRoomACValue || 0, zone.zoneCfmACLoadTR || 0) * 4;

            const HotWaterGPM =
                Math.max(zone.zoneRoomHeatLoadTR || 0, zone.zoneCfmHeatLoadTRValue || 0) * 4;

            if (isHeatingandCooling) return Math.max(ChilledWaterGPM, HotWaterGPM);
            if (showCooling) return ChilledWaterGPM;
            if (showHeating) return HotWaterGPM;

            return 0;
        }

        function displayflowvelocity(): number | number[] {
            if (isHeatingandCooling) {
                if ((pipeConfiguration || "").toUpperCase() === "SINGLE PIPE") {
                    return heatingFlowVelocity || coolingFlowVelocity;
                }
                return [heatingFlowVelocity, coolingFlowVelocity];
            }

            if (showCooling || showHeating) return flowVelocity;
            return 0;
        }

        function calculateWaterLS(GPM: number): number {
            if (zone.zoneExhaustAir > 0 || !GPM) return 0;
            return Math.round((GPM * w) * 10) / 10;
        }

        function calculatePipeSize(GPM: number, velocity: number | number[]): number | number[] {
            const calc = (v: number) => {
                if (!GPM || !v) return 0;

                const [p1, p2, p3, p4] = ps.map(Number);
                if ([p1, p2, p3, p4].some(isNaN)) return 0;

                const val = Math.sqrt((p1 * GPM * p2) / (p3 * v)) * p4;
                return Math.round(val * 10) / 10;
            };

            return Array.isArray(velocity) ? velocity.map(calc) : calc(velocity);
        }

        // ================= FINAL =================
        const finalBDB = calculateBDB(finalCfm);
        const finalWidth = calculateAHUWidth(finalCfm);
        const finalHeight = calculateAHUHeight(finalCfm);
        const finalCoolingCoil = calculateCoolingCoil(finalWidth, finalHeight, Number(AHUCoolLoadTR));

        const displayVelocity = displayflowvelocity();
        const finalWaterGPM = calculateGPM();

       
        const safeBDB = typeof finalBDB === "number" ? finalBDB : 0;

        return {
            zoneName: zone.zoneName,
            AHUCfm: finalCfm,
            AHUWidth: finalWidth,
            AHUHeight: finalHeight,
            AHULength: calculateAHULength(safeBDB, totalFiltrationStages, finalCoolingCoil),
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

    } catch (err) {
        console.error("BOQ ERROR:", err);
        throw err;
    }
}