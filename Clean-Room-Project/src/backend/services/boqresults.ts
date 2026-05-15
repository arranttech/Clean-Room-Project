import boqresult from "../../json/boqresult.json";
import { CalculatedZoneResults } from "../services/cummulativecal";
import { RoomPayload } from "../services/service";
import { getSystemFlags, AirflowResults } from "./service";

export type RoomBOQPayload = RoomPayload;
export type ResultPayload = AirflowResults;
export type BOQPayload = CalculatedZoneResults;

export type BOQRowType =
    | "COOLING_SUPPLY"
    | "COOLING_EXHAUST"
    | "HEATING_SUPPLY"
    | "HEATING_EXHAUST"
    | "VENTILATION_SUPPLY"
    | "VENTILATION_EXHAUST";

const bdb = boqresult?.fields?.BDB;
const m = boqresult?.fields?.MotorHP;
const c = boqresult?.fields?.RowsofCoolingCoil?.Coolval || [];
const w = boqresult?.fields?.WaterLS?.waterval || 0;
const ps = boqresult?.fields?.PipeSize?.pipesize || [];

export function boqresults(
    zone: BOQPayload,
    standards: any,
    room?: RoomBOQPayload,
    result?: ResultPayload | ResultPayload[],
    boqRowType?: BOQRowType
) {
    try {
        const {
            heatingFlowVelocity,
            coolingFlowVelocity,
            totalFiltrationStagesSupply,
            totalFiltrationStagesExhaust,
            staticPressureSupply,
            staticPressureExhaust,
            pipeConfiguration
        } = standards;

        const currentZoneSystem = zone.zoneSystem ?? "";
        const currentZoneSystemType = room?.zoneSystemType ?? "";

        const { showCooling, showHeating, isVentilationSystem } =
            getSystemFlags(currentZoneSystem, currentZoneSystemType, room || {} as RoomPayload);

        const isHeatingandCooling = showCooling && showHeating;
        const ahu = boqresult?.fields?.AHUSize;

        const isCoolingSupply = boqRowType === "COOLING_SUPPLY";
        const isCoolingExhaust = boqRowType === "COOLING_EXHAUST";

        const isHeatingSupply = boqRowType === "HEATING_SUPPLY";
        const isHeatingExhaust = boqRowType === "HEATING_EXHAUST";

        const isVentilationSupply = boqRowType === "VENTILATION_SUPPLY";
        const isVentilationExhaust = boqRowType === "VENTILATION_EXHAUST";

        const isSupplyRow =
            isCoolingSupply || isHeatingSupply || isVentilationSupply;

        const isExhaustRow =
            isCoolingExhaust || isHeatingExhaust || isVentilationExhaust;

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

            const allResults = Array.isArray(result)
                ? result
                : result
                    ? [result]
                    : [];

            const exhaustValues = allResults.map(
                (r: any) => Number(r?.exhaustAir ?? 0)
            );

            const isSupplySystem =
                exhaustValues.length > 0
                    ? exhaustValues.some((v: number) => v === 0)
                    : exhaustAir === 0;

            const isExhaustSystem =
                exhaustValues.length > 0
                    ? exhaustValues.every((v: number) => v !== 0)
                    : exhaustAir !== 0;

            const coolingSupplyCfm = Math.ceil(coolingBase / 250) * 250;
            const coolingExhaustCfm = Math.ceil(exhaustAir / 250) * 250;

            const heatingSupplyCfm = Math.ceil(heatingBase / 250) * 250;
            const heatingExhaustCfm = Math.ceil(exhaustAir / 250) * 250;

            const ventilationSupplyCfm =
                Math.ceil((roomCFM + freshAir) / 250) * 250;

            const ventilationExhaustCfm =
                Math.ceil(roomCFM / 250) * 250;

            if (isCoolingSupply) ahuCfm = coolingSupplyCfm;
            else if (isCoolingExhaust) ahuCfm = coolingExhaustCfm;
            else if (isHeatingSupply) ahuCfm = heatingSupplyCfm;
            else if (isHeatingExhaust) ahuCfm = heatingExhaustCfm;
            else if (isVentilationSupply) ahuCfm = ventilationSupplyCfm;
            else if (isVentilationExhaust) ahuCfm = ventilationExhaustCfm;
            else if (isVentilationSystem) ahuCfm = isSupplySystem ? ventilationSupplyCfm : ventilationExhaustCfm;
            // ... existing logic above ...

            else if (isHeatingandCooling) {
                const coolsupplyCfm = coolingSupplyCfm;
                const heatsupplyCfm = heatingSupplyCfm;
                const exhaustCfm = coolingExhaustCfm || heatingExhaustCfm;

                if (isSupplySystem) {
                    if (isCoolingSupply) {
                        ahuCfm = coolsupplyCfm;
                    } else if (isHeatingSupply) {
                        ahuCfm = heatsupplyCfm;
                    } else {
                        ahuCfm = coolsupplyCfm || heatsupplyCfm;
                    }
                } else {

                    ahuCfm = exhaustCfm;
                }
            }

            else if (showCooling) ahuCfm = isSupplySystem ? coolingSupplyCfm : isExhaustSystem ? coolingExhaustCfm : 0;
            else if (showHeating) ahuCfm = isSupplySystem ? heatingSupplyCfm : isExhaustSystem ? heatingExhaustCfm : 0;

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

        function calculateCoolingCoil(width: number, height: number): number {
            const requiredload = Math.max(
                Number(zone.zoneRoomACValue || 0),
                Number(zone.zoneCfmACLoadTR || 0)
            );

            if (isVentilationSystem && requiredload === 0) return 0;
            if (!c || c.length < 6) return 0;

            const baseCapacity =
                ((width - c[0]) * (height - c[1]) * c[2]) / c[3];

            if (baseCapacity >= requiredload) return 4;
            else if (baseCapacity * c[4] >= requiredload) return 6;
            else if (baseCapacity * c[5] >= requiredload) return 8;

            return 0;
        }

        function calculateStagesofFiltration(exhaustAir: number): number {
            if (exhaustAir !== 0)
                return totalFiltrationStagesExhaust;
            else return totalFiltrationStagesSupply;
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

        function calculateStaticPressure(exhaustAir: number): number {
            if (exhaustAir !== 0) return staticPressureExhaust;
            else return staticPressureSupply;
        }

        function calculateGPM(): number {
            if (isVentilationSystem) return 0;

            const ChilledWaterGPM =
                Math.max(zone.zoneRoomACValue || 0, zone.zoneCfmACLoadTR || 0) * 4;

            const HotWaterGPM =
                Math.max(zone.zoneRoomHeatLoadTR || 0, zone.zoneCfmHeatLoadTRValue || 0) * 4;

            if (showCooling && !showHeating) {
                return ChilledWaterGPM;
            }
            if (showHeating && !showCooling) {
                return HotWaterGPM;
            }
            if (isHeatingandCooling) {

                if (isCoolingSupply) {
                    return ChilledWaterGPM;
                }

                if (isHeatingSupply) {
                    return HotWaterGPM;
                }

                if (isCoolingExhaust || isHeatingExhaust) {
                    return 0;
                }
            }

            return 0;
        }

        function displayflowvelocity(): number | number[] {
            if (isHeatingandCooling) {
                if ((pipeConfiguration || "").toUpperCase() === "SINGLE PIPE") {
                    return heatingFlowVelocity || coolingFlowVelocity || 0;
                }
                return [heatingFlowVelocity || 0, coolingFlowVelocity || 0];
            }

            if (showHeating) return heatingFlowVelocity || 0;
            if (showCooling) return coolingFlowVelocity || 0;
            return 0;
        }

        function calculateWaterLS(GPM: number): number {
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
        const finalCoolingCoil = calculateCoolingCoil(finalWidth, finalHeight);

        const boqExhaustValue = isExhaustRow ? 1 : 0;

        const stagesoffilteration = calculateStagesofFiltration(boqExhaustValue);
        const staticPressure = calculateStaticPressure(boqExhaustValue);

        const displayVelocity = displayflowvelocity();
        const finalWaterGPM = calculateGPM();

        const safeBDB = typeof finalBDB === "number" ? finalBDB : 0;

        return {
            zoneName: zone.zoneName,
            boqRowType,
            AHUCfm: finalCfm,
            AHUWidth: finalWidth,
            AHUHeight: finalHeight,
            stageFilter: stagesoffilteration,
            AHULength: calculateAHULength(safeBDB, stagesoffilteration, finalCoolingCoil),
            staticPressure: staticPressure,
            BDB: finalBDB,
            motorHP: calculateMotorHP(finalCfm, staticPressure),
            AHULoadTR: Number(AHUCoolLoadTR),
            noofrowsofCoil: finalCoolingCoil,
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

export function getBOQRowsForZone(
    zone: BOQPayload,
    standards: any,
    room?: RoomBOQPayload,
    result?: ResultPayload | ResultPayload[]
) {
    const system = String(zone.zoneSystem ?? "").toLowerCase();

    const isCoolingOnly =
        system.includes("cooling") &&
        !system.includes("heating") &&
        !system.includes("ventilation");

    const isHeatingOnly =
        system.includes("heating") &&
        !system.includes("cooling") &&
        !system.includes("ventilation");

    const isVentilationOnly =
        system.includes("ventilation") &&
        !system.includes("cooling") &&
        !system.includes("heating");

    const isCoolingVentilation =
        system.includes("cooling") &&
        system.includes("ventilation");

    const isHeatingVentilation =
        system.includes("heating") &&
        system.includes("ventilation");

    const isCoolingHeating =
        system.includes("cooling") &&
        system.includes("heating") &&
        !system.includes("ventilation");

    if (isCoolingOnly) {
        return [
            boqresults(zone, standards, room, result, "COOLING_SUPPLY"),
            boqresults(zone, standards, room, result, "COOLING_EXHAUST"),
        ];
    }

    if (isHeatingOnly) {
        return [
            boqresults(zone, standards, room, result, "HEATING_SUPPLY"),
            boqresults(zone, standards, room, result, "HEATING_EXHAUST"),
        ];
    }

    if (isVentilationOnly) {
        return [
            boqresults(zone, standards, room, result, "VENTILATION_SUPPLY"),
            boqresults(zone, standards, room, result, "VENTILATION_EXHAUST"),
        ];
    }

    if (isCoolingVentilation) {
        return [
            boqresults(zone, standards, room, result, "COOLING_SUPPLY"),
            boqresults(zone, standards, room, result, "COOLING_EXHAUST"),
            boqresults(zone, standards, room, result, "VENTILATION_SUPPLY"),
            boqresults(zone, standards, room, result, "VENTILATION_EXHAUST"),
        ];
    }

    if (isHeatingVentilation) {
        return [
            boqresults(zone, standards, room, result, "HEATING_SUPPLY"),
            boqresults(zone, standards, room, result, "HEATING_EXHAUST"),
            boqresults(zone, standards, room, result, "VENTILATION_SUPPLY"),
            boqresults(zone, standards, room, result, "VENTILATION_EXHAUST"),
        ];
    }

    if (isCoolingHeating) {
        return [
            boqresults(zone, standards, room, result, "COOLING_SUPPLY"),
            boqresults(zone, standards, room, result, "HEATING_SUPPLY"),
            boqresults(zone, standards, room, result, "COOLING_EXHAUST"),
        ];
    }

    return [boqresults(zone, standards, room, result)];
}