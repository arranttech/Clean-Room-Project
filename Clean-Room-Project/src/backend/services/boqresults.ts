import boqresult from "../../json/boqresult.json";
import { CalculatedZoneResults } from "../services/cummulativecal.ts";
import { RoomPayload } from "../services/service.ts";
import { getSystemFlags } from "./service.ts";

export type RoomBOQPayload = RoomPayload;
export type BOQPayload = CalculatedZoneResults;

const s = boqresult.fields.NumberofStagesFilter;

export function boqresults(zone: BOQPayload, room?: RoomBOQPayload) {
    // FIX: Use zone properties if room is undefined, as seen in your API request payload
    const currentZoneSystem = zone.zoneSystem ?? "";
    const { showCooling, showHeating } = getSystemFlags(currentZoneSystem, room || {} as RoomPayload);
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

    //function calculateAHULength(): number {
    //Blower Section Length
    //const limits = ahu.AHULengthCfm.BDB;
    //const length = ahu.AHULengthCfm.BlowerLength;

    //if      (currentCfm <= limits[1]) return length[1];
    //else if (currentCfm <= limits[2]) return length[2];
    //else if (currentCfm <= limits[3]) return length[3];
    //else if (currentCfm <= limits[4]) return length[4];
    //else if (currentCfm <= limits[5]) return length[5];
    //else if (currentCfm <= limits[6]) return length[6];
    // else if (currentCfm <= limits[7]) return length[7];

    //return length[8];
    //}

 function calculateFilterStages() {
    const temp = room?.zoneReqInsideTempC;
    const classification = (room?.zoneClassification ?? "").trim().toUpperCase();

    // Strict number check: will be false for "TEXT", null, or undefined
    const isNumber = typeof temp === 'number' && Number.isFinite(temp);

    // Using .some() with .includes() directly in the if statements
    if (s.stage3Or4.some(item => classification.includes(item.toUpperCase()))) {
        return isNumber ? 3 : 4;
    }

    if (s.stage4Or5.some(item => classification.includes(item.toUpperCase()))) {
        return isNumber ? 4 : 5;
    }

    return 3; 
}

    return {
        zoneName: zone.zoneName,
        AHUCfm: currentCfm,
        AHUWidth:calculateAHUWidth() ,
        AHUHeight: calculateAHUHeight(),
        stageFilter: calculateFilterStages() 
    };
}