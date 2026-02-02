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
  system?: string;
  coolingMethod?: string;
  standard?: string;
  classification?: string;
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

  ////////////////////////////////////////////////////////////////// Calculations//////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // System Inputs
    const ACPH = Number(payload.acph || 0);
    const reqInsideTemp = Number(payload.reqInsideTempC || 0);
    const reqInsideHum = Number(payload.reqInsideHum || 0);
    const maxTemp = Number(payload.maxTempC || 0);
    const rhMax = Number(payload.rhMax || 0);
    const roomClassi = String(payload.classification ?? "").trim();

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
      const equipment = Number(room.equipmentLoad || 0);
      const lighting = Number(room.lightingLoad || 0);
      const infiltrationsPerHour = Number(room.infiltrationsPerHour || 0);

      // Percentage Conversion
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

      const isTempValid =
        !isNaN(reqInsideTemp) && payload.reqInsideTempC !== "";

      // Logic for fields that depend on reqInsideTemp
      let dehumidValue: number | string;
      let removedWaterValue: number | string;
      let roomACValue: number | string;
      let cfmACLoadTRValue: number | string = "-";
      let resultant: number | string = 0;
      let resultCoolLoadTRValue: number | string;

      if (isTempValid) {
        // --- DEHUMIDIFICATION CALCULATION ---
        dehumidValue =
          Math.ceil(
            (occupancy * 200 +
              infiltrationsPerHour * 375 +
              freshAir +
              roomCfm) /
              25
          ) * 25;

        // --- WATER VAPOR CALCULATION ---
        const peakTempVP =
          c1.value1 *
          Math.pow(10, (c1.value2 * maxTemp) / (c1.value3 + maxTemp));
        const roomTempVP =
          c1.value1 *
          Math.pow(
            10,
            (c1.value2 * reqInsideTemp) / (c1.value3 + reqInsideTemp)
          );
        const humidOut = (rhMax / 100) * peakTempVP;
        const humidIn = (reqInsideHum / 100) * roomTempVP;
        const waterOut = humidOut / (c2.value2 - humidOut);
        const waterIn = humidIn / (c2.value2 - humidIn);
        const delWater = c2.value1 * (waterOut - waterIn);
        removedWaterValue = Number(
          (freshAir * frAirCal * (delWater / c2.value3)).toFixed(3)
        );

        // --- ROOM AC LOAD (TR) CALCULATION ---
        const roomACconst = t.fields.roomACloadTR;
        const pc = roomACconst.PeopleConst;
        const tempdiffer =
          roomACconst.TempdiffConst.value * Math.abs(maxTemp - reqInsideTemp);
        const wallConduction = roomACconst.WallConst.value * (H * (L + W));
        const peopleNAirflow =
          pc.value1 * (occupancy * pc.value2 + (freshAir + exhaustAir));
        const equipNlight =
          roomACconst.EqupConst.value * (equipment * 1000 + lighting * areaFt2);
        const infilteration =
          infiltrationsPerHour * roomACconst.InfilterConst.value;

        const ERSH =
          tempdiffer * (wallConduction + peopleNAirflow) +
          equipNlight +
          infilteration;
        roomACValue = Number(
          (Math.ceil((ERSH / roomACconst.TonsConst.value) * 2) / 2).toFixed(2)
        );
      } else {
        // If not a number, display the original input string
        dehumidValue = payload.reqInsideTempC || "Invalid";
        removedWaterValue = payload.reqInsideTempC || "Invalid";
        roomACValue = payload.reqInsideTempC || "Invalid";
        cfmACLoadTRValue = payload.reqInsideTempC || "Invalid";
      }

      // Final Resultant logic based on whether dehumidValue is a number
      const baseAirflow = roomCfm + freshAir;
      const baseResultant = Math.ceil(baseAirflow / 25) * 25;

      // --- Resultant Cfm ---
      if (typeof dehumidValue === "number") {
        resultant = Math.ceil(Math.max(baseAirflow, dehumidValue) / 25) * 25;
      } else {
        resultant = baseResultant;
      }

      // Room Terminal Supply Module in Sft
      const V1 = t.fields.ClassifiCondition;
      const V2 = t.fields.roomTerminalSupply.VelocityConst;
      let Classifi = String(roomClassi || "").toUpperCase().trim();
      let Value = parseFloat(String(resultant));
      let result = 0;

      if (V1.ISO8Cd.includes(Classifi) || V1.ISO7Cd.includes(Classifi)) {
        result = Value / V2.ISO8VV;
      } else if (V1.ISOCd6.includes(Classifi)) {
        result = Value / V2.ISO6VV;
      } else if (V1.ISOCd5.includes(Classifi)) {
        result = Value / V2.ISO5VV;
      } else if (V1.ISOCd4.includes(Classifi)) {
        result = Value / V2.ISO4VV;
      } else if (V1.ISOCd3.includes(Classifi)) {
        result = Value / V2.ISO3VV;
      } else if (V1.ISOCd2.includes(Classifi)) {
        result = Value / V2.ISO2VV;
      } else if (V1.ISOCd1.includes(Classifi)) {
        result = Value / V2.ISO1VV;
      } else {
        result = Value / V2.NCVV;
      }

      if (result > 0) {
        result = Number(result.toFixed(2));
      }
      const roomTermSupplyValue = Math.ceil(result / 2) * 2;

      if (isTempValid) {
        // CFM AC load in TR
        let rawValue = 0;
        if (typeof resultant === "number") {
          let divisor = 0;
          if (payload.coolingMethod === "Chilled Water") divisor = 400;
          else if (payload.coolingMethod === "DX") divisor = 300;
          else if (payload.coolingMethod === "Brine") divisor = 600;

          if (divisor > 0) rawValue = resultant / divisor;
        }
        cfmACLoadTRValue = Math.ceil(rawValue / 0.5) * 0.5;

        // --- RESULTANT COOLING LOAD IN TR ---
        resultCoolLoadTRValue =
          Math.ceil(
            Math.max(Number(roomACValue), Number(cfmACLoadTRValue)) / 0.5
          ) * 0.5;
      } else {
        cfmACLoadTRValue = payload.reqInsideTempC || "Invalid";
        resultCoolLoadTRValue = payload.reqInsideTempC || "Invalid";
      }

      return {
        roomName: room.roomName,
        area: Number(areaFt2.toFixed(2)),
        volume: Number(volumeFt3.toFixed(2)),
        roomCfm: Number(roomCfm.toFixed(3)),
        freshAir: Number(freshAir.toFixed(3)),
        exhaustAir: Number(exhaustAir.toFixed(3)),
        dehumid: dehumidValue,
        removedWaterVapor: removedWaterValue,
        resultant: resultant,
        roomACLoadTR: roomACValue,
        roomTermSupply: roomTermSupplyValue,
        cfmACLoadTR: cfmACLoadTRValue,
        resultCoolLoadTRValue,
      };
    });

    // Store Results
    setAllResults(computed);
  }, [payload, rooms, t.fields.remWaterVapour, t.fields.roomACloadTR]);

  // UI (TABULAR)
  return (
    <div className={s.wrap}>
      <div className={s.card}>
        {/* Header */}
        <div className={s.headerSection}>
          <div className={s.title}>{t.title}</div>
          <div className={s.subtitle}>{t.subtitle}</div>
        </div>

        {/* TABLE */}
        <div className={s.tableOuter}>
          <div className={s.tableScroll}>
            <table className={s.table}>
              <thead className={s.thead}>
                <tr>
                  <th className={s.thRoom}>Room Name</th>
                  <th className={s.th}>{t.fields.area.label}</th>
                  <th className={s.th}>{t.fields.volume.label}</th>
                  <th className={s.th}>{t.fields.roomCfm.label}</th>
                  <th className={s.th}>{t.fields.freshAir.label}</th>
                  <th className={s.th}>{t.fields.exhaustAir.label}</th>
                  <th className={s.th}>{t.fields.Dehumidification.label}</th>
                  <th className={s.th}>{t.fields.remWaterVapour.label}</th>
                  <th className={s.th}>{t.fields.resultantCfm.label}</th>
                  <th className={s.th}>{t.fields.RoomACloadTR.label}</th>
                  <th className={s.th}>{t.fields.RoomTerminalSupply.label}</th>
                  <th className={s.th}>{t.fields.cfmACLoadTR.label}</th>
                  <th className={s.th}>{t.fields.ResultCoolLoadTR.label}</th>
                </tr>
              </thead>

              <tbody>
                {allResults.map((r, idx) => (
                  <tr key={idx} className={s.tr}>
                    <td className={s.tdRoom}>
                      {r.roomName || `Room ${idx + 1}`}
                    </td>

                    <td className={s.td}>{r.area}</td>
                    <td className={s.td}>{r.volume}</td>
                    <td className={s.td}>{r.roomCfm}</td>
                    <td className={s.td}>{r.freshAir}</td>
                    <td className={s.td}>{r.exhaustAir}</td>
                    <td className={s.td}>{r.dehumid}</td>
                    <td className={s.td}>{r.removedWaterVapor}</td>
                    <td className={s.td}>{r.resultant}</td>
                    <td className={s.td}>{r.roomACLoadTR}</td>
                    <td className={s.td}>{r.roomTermSupply}</td>
                    <td className={s.td}>{r.cfmACLoadTR}</td>
                    <td className={s.td}>{r.resultCoolLoadTRValue}</td>
                  </tr>
                ))}

                {allResults.length === 0 && (
                  <tr>
                    <td className={s.emptyRow} colSpan={13}>
                      No rooms added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className={s.footer}>
          <Link to="/room" className={s.backLink}>
            <FaArrowLeft /> back
          </Link>
        </div>
      </div>
    </div>
  );
}

