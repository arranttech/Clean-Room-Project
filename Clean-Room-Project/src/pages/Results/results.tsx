// Imports
import resultsDesign from "./resultsDesign";
import resultsText from "../../json/resultsText.json";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

// Types
type RoomForm = {
  roomName: string;
  length: string;
  width: string;
  height: string;
  occupancy: string;
  equipmentLoad: string;
  lightingLoad: string;
  infiltrationsPerHour: string;
  freshAirPercent: string;
  exhaustAir: string;
};

type ResultsPayload = {
  acph?: number | string;
  reqInsideTempC?: number | string;
  reqInsideHum?: number | string;
  maxTempC?: number | string;
  rhMax?: number | string;
  rooms?: RoomForm[];
};

// Component
export default function Results() {

  // Styles & Text
  const s = resultsDesign;
  const t = resultsText;

  // Router State
  const location = useLocation();
  const props = (location.state || {}) as ResultsPayload;

  // Memoized Data
  const payload = useMemo(() => props, [props]);
  const rooms = payload.rooms || [];

  // Results State
  const [allResults, setAllResults] = useState<any[]>([]);

  // Calculations
  useEffect(() => {

    // System Inputs
    const ACPH = Number(payload.acph || 0);
    const reqInsideTemp = Number(payload.reqInsideTempC || 0);
    const reqInsideHum = Number(payload.reqInsideHum || 0);
    const maxTemp = Number(payload.maxTempC || 0);
    const rhMax = Number(payload.rhMax || 0);

    // Constants
    const frAirCal = t.fields.remWaterVapour.FrAirCal.value;
    const c1 = t.fields.remWaterVapour.delTempConst;
    const c2 = t.fields.remWaterVapour.watConst;

    // Room Loop
    const computed = rooms.map((room) => {

      // Room Inputs
      const L = Number(room.length || 0);
      const W = Number(room.width || 0);
      const H = Number(room.height || 0);
      const occupancy = Number(room.occupancy || 0);
      const infiltrationsPerHour = Number(room.infiltrationsPerHour || 0);

      // Percent Conversion
      const faRaw = Number(room.freshAirPercent || 0);
      const faFactor = faRaw > 1 ? faRaw / 100 : faRaw;
      const eaRaw = Number(room.exhaustAir || 0);
      const eaFactor = eaRaw > 1 ? eaRaw / 100 : eaRaw;

      // Area
      const areaFt2 = L * W * 10.76;

      // Volume
      const volumeFt3 = Math.ceil(areaFt2 * H * 3.28 * 100) / 100;

      // Room CFM
      const roomCfm = (volumeFt3 * ACPH) / 60;

      // Fresh Air
      const freshAir = roomCfm * faFactor;

      // Exhaust Air
      const exhaustAir = roomCfm * eaFactor;

      // Dehumidification
      const dehumid =
        Math.ceil(
          ((occupancy * 200) +
            (infiltrationsPerHour * 375) +
            freshAir +
            roomCfm) / 25
        ) * 25;

      // Vapor Pressure
      const peakTempVP =
        c1.value1 * Math.pow(10, (c1.value2 * maxTemp) / (c1.value3 + maxTemp));

      const roomTempVP =
        c1.value1 *
        Math.pow(10, (c1.value2 * reqInsideTemp) / (c1.value3 + reqInsideTemp));

      // Humidity
      const humidOut = (rhMax / 100) * peakTempVP;
      const humidIn = (reqInsideHum / 100) * roomTempVP;

      // Moisture Content
      const waterOut = humidOut / (c2.value2 - humidOut);
      const waterIn = humidIn / (c2.value2 - humidIn);

      // Water Difference
      const delWater = c2.value1 * (waterOut - waterIn);

      // Water Removal
      const removedWaterVapor =
        (freshAir * frAirCal) * (delWater / c2.value3);

      // Final CFM
      const resultant =
        Math.ceil(Math.max(roomCfm + freshAir, dehumid) / 25) * 25;

      // Return Object
      return {
        roomName: room.roomName,
        area: Number(areaFt2.toFixed(2)),
        volume: Number(volumeFt3.toFixed(2)),
        roomCfm: Number(roomCfm.toFixed(3)),
        freshAir: Number(freshAir.toFixed(3)),
        exhaustAir: Number(exhaustAir.toFixed(3)),
        dehumid: Number(dehumid.toFixed(0)),
        removedWaterVapor: Number(removedWaterVapor.toFixed(3)),
        resultant: Number(resultant.toFixed(0)),
      };
    });

    // Store Results
    setAllResults(computed);

  }, [payload, rooms, t.fields.remWaterVapour]);

  // UI
  return (
    <div className={s.wrap}>
      <div className={s.card}>

        {/* Header */}
        <div>
          <div className={s.title}>{t.title}</div>
          <div className={s.subtitle}>{t.subtitle}</div>
        </div>

        {/* List */}
        <div className="mt-8 space-y-6">
          {allResults.map((r, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 p-5">

              {/* Room Name */}
              <div className="text-lg font-semibold text-slate-900">
                Room: {r.roomName || `Room ${idx + 1}`}
              </div>

              {/* Values */}
              <div className="mt-3 text-sm text-slate-700 space-y-1">
                <div>{t.fields.area.label}: {r.area}</div>
                <div>{t.fields.volume.label}: {r.volume}</div>
                <div>{t.fields.roomCfm.label}: {r.roomCfm}</div>
                <div>{t.fields.freshAir.label}: {r.freshAir}</div>
                <div>{t.fields.exhaustAir.label}: {r.exhaustAir}</div>
                <div>{t.fields.Dehumidification.label}: {r.dehumid}</div>
                <div>{t.fields.remWaterVapour.label}: {r.removedWaterVapor}</div>
                <div>{t.fields.ResultantCfm.label}: {r.resultant}</div>
              </div>

            </div>
          ))}

          {/* Empty */}
          {allResults.length === 0 && (
            <div className="text-center text-slate-500">
              No rooms added yet.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={s.footer}>
        <Link to="/room" className={s.backLink}>
          <FaArrowLeft /> back
        </Link>
      </div>
    </div>
  );
}
