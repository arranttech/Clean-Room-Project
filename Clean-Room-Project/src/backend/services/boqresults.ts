import { CalculatedZoneResults } from "../services/cummulativecal.ts";

export type BOQPayload = CalculatedZoneResults;

export function boqresults(zone: BOQPayload) {

    let AHUCfm: number | string = 0;

    function calculatedAHUCfm() {
        AHUCfm = Math.ceil(zone.zoneResultantCfm / 250) * 250;
        return AHUCfm;
    }

console.log("AHU Cfm",AHUCfm);
    return {
        zoneName: zone.zoneName,
        AHUCfm: calculatedAHUCfm(),

};

}