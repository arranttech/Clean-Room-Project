import boqresult from "../../json/boqresult.json";
import { CalculatedZoneResults } from "../services/cummulativecal.ts";
import { RoomPayload } from "../services/service.ts";
import { getSystemFlags } from "./service.ts";
import standardData from "../../json/standardData.json";

export type RoomBOQPayload = RoomPayload;
export type BOQPayload = CalculatedZoneResults;

const t = standardData.standards;

export function boqresults(zone: BOQPayload, room: RoomBOQPayload) {
    // Corrected: Convert temp to string and handle nullish values
    const { showCooling, showHeating, isTempValid } = getSystemFlags(zone.zoneSystem ?? "", room);
    const isHeatingandCooling = showCooling && showHeating;

    const b = boqresult;
    const ahu = b.fields.AHUSize;

    function calculatedAHUCfm(): number {
        const coolingCfm = Math.ceil(zone.zoneResultantCfm / 250) * 250;
        const heatingCfm = Math.ceil(zone.zoneResultantHeatCfm / 250) * 250;

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
        const temp = room.zoneReqInsideTempC;
        const classification = (room.zoneClassification ?? "").trim().toUpperCase();
       const iso9 = t[0].classifications.find(c => c.name.includes("ISO 9"));
        
        const isNumber = typeof temp === "number" || (typeof temp === "string"
            && temp.trim() != "" && !isNaN(Number(temp)));

        switch (classification) {
            // Cases where stage filter is the same regardless of Temperature Type
            case "ISO 9":
                return 3;

            // ISO 8 / GRADE D / 100K: 4 if number, 5 if text
            case "ISO 8":
            case "GRADE D":
            case "CLASS 100,000":
            case "CLASS 100K":
                return isNumber ? 4 : 5;

            // ISO 7 / ISO 6 / GRADE C: 3 if number, 4 if text
            case "ISO 7":
            case "GRADE C":
            case "CLASS 10,000":
            case "CLASS 10K":
            case "ISO 6":
            case "CLASS 1,000":
            case "CLASS 1K":
            case "GRADE B":
                return isNumber ? 3 : 4;

            // ISO 5 / GRADE A / CLASS 100: 4 if number, 5 if text
            case "ISO 5":
            case "GRADE A":
            case "CLASS 100":
                return isNumber ? 4 : 5;

            // ISO 1 - 4: 4 if number, 5 if text
            case "ISO 4":
            case "ISO 3":
            case "ISO 2":
            case "ISO 1":
                return isNumber ? 4 : 5;

            default:
                return 3; // The final fallback from your Excel formula
        }
    }

    return {
        zoneName: zone.zoneName,
        zoneSystem: zone.zoneSystem,
        AHUCfm: currentCfm,
        AHUWidth: calculateAHUWidth(),
        AHUHeight: calculateAHUHeight(),
        //AHULength: calculateAHULength()
    };
}