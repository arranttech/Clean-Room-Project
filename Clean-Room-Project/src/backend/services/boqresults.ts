import boqresult from "../../json/boqresult.json";
import { CalculatedZoneResults } from "../services/cummulativecal.ts";
import { RoomPayload } from "../services/service.ts";
import { getSystemFlags } from "./service.ts";

export type RoomBOQPayload = RoomPayload;
export type BOQPayload = CalculatedZoneResults;

const s = boqresult.fields.NumberofStagesFilter;

export function boqresults(zone: BOQPayload, room?: RoomBOQPayload) {

    const currentZoneSystem = zone.zoneSystem ?? "";
    const { showCooling, showHeating, isTempValid } =
        getSystemFlags(currentZoneSystem, room || {} as RoomPayload);

    const isHeatingandCooling = showCooling && showHeating;

    const b = boqresult;
    const ahu = b.fields.AHUSize;

    function calculatedAHUCfm(): number {
        // Ensure values exist to prevent NaN errors
        const coolingCfm = Math.ceil((zone.zoneResultantCfm || 0) / 250) * 250;
        const heatingCfm = Math.ceil((zone.zoneResultantHeatCfm || 0) / 250) * 250;

        if (isHeatingandCooling) return Math.max(coolingCfm, heatingCfm);
        if (showCooling) return coolingCfm;
        if (showHeating) return heatingCfm;

        return 0;
    }

    const currentCfm = calculatedAHUCfm();

    function calculateAHUWidth() {
        const limits = ahu.AHUWidthCfm.AHUWdCfm;
        const widths = ahu.AHUWidthCfm.AHUWidth;

        if (currentCfm <= limits[1]) return widths[1];
        else if (currentCfm <= limits[2]) return widths[2];
        else if (currentCfm <= limits[3]) return widths[3];
        else if (currentCfm <= limits[4]) return widths[4];
        else if (currentCfm <= limits[5]) return widths[5];
        else if (currentCfm <= limits[6]) return widths[6];
        else if (currentCfm <= limits[7]) return widths[7];

        return widths[8];
    }

    function calculateAHUHeight() {
        const limits = ahu.AHUHeightCfm.AHUHtCfm;
        const height = ahu.AHUHeightCfm.AHUHeight;

        if (currentCfm <= limits[1]) return height[1];
        else if (currentCfm <= limits[2]) return height[2];
        else if (currentCfm <= limits[3]) return height[3];
        else if (currentCfm <= limits[4]) return height[4];
        else if (currentCfm <= limits[5]) return height[5];
        else if (currentCfm <= limits[6]) return height[6];
        else if (currentCfm <= limits[7]) return height[7];

        return height[8];
    }

   function calculateFilterStages() {

    const classification = String(
        room?.zoneClassification ??
        zone.zoneClassification ??
        ""
    ).trim().toUpperCase();

    if (!classification) return 3;

    const rawTemp = zone.zoneReqInsideTempC;
    const temp = String(rawTemp ?? "").trim().toUpperCase();

    const stage3Match = s.stage3Or4?.some(item =>
        String(item).trim().toUpperCase() === classification
    );

    const stage4Match = s.stage4Or5?.some(item =>
        String(item).trim().toUpperCase() === classification
    );

    const isNumericTemp =
        rawTemp !== null &&
        rawTemp !== undefined &&
        !isNaN(Number(rawTemp));

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

    return {
        zoneName: zone.zoneName,
        AHUCfm: currentCfm,
        AHUWidth: calculateAHUWidth(),
        AHUHeight: calculateAHUHeight(),
        stageFilter: calculateFilterStages()
    };
}