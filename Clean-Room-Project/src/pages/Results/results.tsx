import resultsDesign from "./resultsDesign";
import resultsText from "../../json/resultsText.json";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

type RoomPayload = {
  roomName: string;
  length: number | "";
  width: number | "";
  height: number | "";
  occupancy: number | "";
  equipmentLoad: number | "";
  lightingLoad: number | "";
  infiltrationsPerHour: number | "";
  freshAirPercent: number | "";
  exhaustAir: number | "";
  acph: number | "";
  reqInsideTemp: string | number;
  reqInsideHum: string | number;
  maxTemp: number | "";
  rhMax: number | "";
};

export default function Results() {
  const s = resultsDesign;
  const t = resultsText;
  const location = useLocation();
  const props = (location.state || {}) as RoomPayload;
  const roomPayload = useMemo(() => props, [props]);

  const [area, setArea] = useState(0);
  const [volume, setVolume] = useState(0);
  const [roomCfm, setRoomCfm] = useState(0);
  const [freshAir, setFreshAir] = useState(0);
  const [exhaustAir, setExhaustAir] = useState(0);
  const [Dehumidification, setDehumidification] = useState<number | string>(0);
  const [removedWaterVapor, setremovedWaterVapor] = useState<number | string>(
    0,
  );

  const [ResultantCfm, setResultantCfm] = useState<number | string>(0);

  // Helper to check if the value is a valid number for calculation
  const isNumeric = (val: any) => !isNaN(parseFloat(val)) && isFinite(val);

  const calculateResults = () => {
    const L = Number(roomPayload.length || 0);
    const W = Number(roomPayload.width || 0);
    const H = Number(roomPayload.height || 0);
    const ACPH = Number(roomPayload.acph || 0);
    const occupancy = Number(roomPayload.occupancy || 0);
    const infiltrationsPerHour = Number(roomPayload.infiltrationsPerHour || 0);

    // Check if we have numeric values for temperature-dependent calculations
    const hasNumericRequirements =
      isNumeric(roomPayload.reqInsideTemp) &&
      isNumeric(roomPayload.reqInsideHum);

    const faRaw = Number(roomPayload.freshAirPercent || 0);
    const faFactor = faRaw > 1 ? faRaw / 100 : faRaw;
    const eaRaw = Number(roomPayload.exhaustAir || 0);
    const eaFactor = eaRaw > 1 ? eaRaw / 100 : eaRaw;

    const calculatedArea = L * W * 10.76;
    const calculatedVolume = Math.ceil(calculatedArea * H * 3.28 * 100) / 100;
    const calculatedRoomCfm = (calculatedVolume * ACPH) / 60;
    const calculatedFreshAir = calculatedRoomCfm * faFactor;
    const calculatedExhaustAir = calculatedRoomCfm * eaFactor;

    setArea(Number(calculatedArea.toFixed(2)));
    setVolume(Number(calculatedVolume.toFixed(2)));
    setRoomCfm(Number(calculatedRoomCfm.toFixed(3)));
    setFreshAir(Number(calculatedFreshAir.toFixed(3)));
    setExhaustAir(Number(calculatedExhaustAir.toFixed(3)));

    if (hasNumericRequirements) {
      const reqInsideTemp = Number(roomPayload.reqInsideTemp);
      const reqInsideHum = Number(roomPayload.reqInsideHum);
      const maxTemp = Number(roomPayload.maxTemp || 0);
      const rhMax = Number(roomPayload.rhMax || 0);

      // Dehumidification calculation
      const calculatedDehumid =
        Math.ceil(
          (occupancy * 200 +
            infiltrationsPerHour * 375 +
            calculatedFreshAir +
            calculatedRoomCfm) /
            25,
        ) * 25;

      // Removed Water Vapour calculation
      const frAirCal = t.fields.remWaterVapour.FrAirCal.value;
      const c1 = t.fields.remWaterVapour.delTempConst;
      const c2 = t.fields.remWaterVapour.watConst;

      const peakTempVP =
        c1.value1 * Math.pow(10, (c1.value2 * maxTemp) / (c1.value3 + maxTemp));
      const roomTempVP =
        c1.value1 *
        Math.pow(10, (c1.value2 * reqInsideTemp) / (c1.value3 + reqInsideTemp));
      const humidOut = (rhMax / 100) * peakTempVP;
      const humidIn = (reqInsideHum / 100) * roomTempVP;
      const waterOut = humidOut / (c2.value2 - humidOut);
      const waterIn = humidIn / (c2.value2 - humidIn);
      const delWater = c2.value1 * (waterOut - waterIn);

      const calcRemovedVapor = calculatedFreshAir * frAirCal * (delWater/c2.value3);
      const resultant =
        Math.ceil(
          Math.max(calculatedRoomCfm + calculatedFreshAir, calculatedDehumid) /
            25,
        ) * 25;

      setDehumidification(Number(calculatedDehumid.toFixed(2)));
      setremovedWaterVapor(Number(calcRemovedVapor.toFixed(5)));
      setResultantCfm(Number(resultant.toFixed(0)));
    } else {
      // If it's a string (like "Ambient"), display that string in the result fields
      const displayValue = String(roomPayload.reqInsideTemp || "-");
      setDehumidification(displayValue);
      setremovedWaterVapor(displayValue);
      setResultantCfm(displayValue);
    }
  };

  useEffect(() => {
    calculateResults();
  }, [roomPayload]);

  const tableData = [
    { label: "Area (ft²)", value: area },
    { label: "Volume (ft³)", value: volume },
    { label: "Room CFM", value: roomCfm },
    { label: "Fresh Air", value: freshAir },
    { label: "Exhaust Air", value: exhaustAir },
    { label: "Dehumidification CFM", value: Dehumidification },
    { label: "Rem Water Vapour (Kg/hr)", value: removedWaterVapor },
    { label: "Resultant CFM", value: ResultantCfm },
  ];

  return (
    <div className={s.wrap}>
      <div className={s.card}>
        <div className={s.headerSection}>
          <div className={s.title}>Form Results</div>
          <div className={s.subtitle}>These values are calculated results.</div>
        </div>

        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>
                <th className={s.th}>Parameter</th>
                <th className={`${s.th} text-right pr-16`}>Value</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr
                  key={index}
                  className={`${s.tr} ${index % 2 !== 0 ? s.trEven : ""}`}
                >
                  <td className={s.tdLabel}>{item.label}</td>
                  <td className={s.tdValue}>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={s.footer}>
          <Link to="/room" className={s.backLink}>
            <FaArrowLeft /> Back to Room details
          </Link>
        </div>
      </div>
    </div>
  );
}
