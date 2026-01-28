import resultsDesign from "./resultsDesign";
import resultsText from "../../json/resultsText.json";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
//payload
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
  reqInsideTemp: number | "";
  reqInsideHum: number | "";
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
    const [Dehumidification, setDehumidification] = useState(0);
    const [removedWaterVapor, setremovedWaterVapor] = useState(0)
    const [ResultantCfm, setResultantCfm] = useState(0);;
  
    const calculateResults = () => {
      const L = Number(roomPayload.length || 0);
      const W = Number(roomPayload.width || 0);
      const H = Number(roomPayload.height || 0);
      const ACPH = Number(roomPayload.acph || 0);
      const occupancy = Number(roomPayload.occupancy || 0);
      const infiltrationsPerHour = Number(roomPayload.infiltrationsPerHour || 0);
      const reqInsideTemp = Number(roomPayload.reqInsideTemp || 0);
      const reqInsideHum = Number(roomPayload.reqInsideHum || 0);
      const maxTemp = Number(roomPayload.maxTemp || 0);
      const rhMax = Number(roomPayload.rhMax || 0);
      const faRaw = Number(roomPayload.freshAirPercent || 0);
      const faFactor = faRaw > 1 ? faRaw / 100 : faRaw;
      const eaRaw = Number(roomPayload.exhaustAir || 0);
      const eaFactor = eaRaw > 1 ? eaRaw / 100 : eaRaw;
      const calculatedArea = L * W * 10.76;
      const calculatedVolume = Math.ceil(calculatedArea * H * 3.28 * 100) / 100;
      const calculatedRoomCfm = (calculatedVolume * ACPH) / 60;
      const calculatedFreshAir = calculatedRoomCfm * faFactor;
      const calculatedExhaustAir = calculatedRoomCfm * eaFactor;
      const calculatedDehumid = Math.ceil(((occupancy * 200) + (infiltrationsPerHour * 375) + calculatedFreshAir + calculatedRoomCfm) / 25) * 25;
      const frAirCal = t.fields.remWaterVapour.FrAirCal.value; 
      const c1 = t.fields.remWaterVapour.delTempConst;
      const c2 = t.fields.remWaterVapour.watConst;
      const peakTempVP = c1.value1 * Math.pow(10, (c1.value2 * maxTemp) / (c1.value3 + maxTemp));
      const roomTempVP = c1.value1 * Math.pow(10, (c1.value2 * reqInsideTemp) / (c1.value3 + reqInsideTemp));
      const humidOut = (rhMax / 100) * peakTempVP;
      const humidIn = (reqInsideHum / 100) * roomTempVP;
      const waterOut = humidOut / (c2.value2 - humidOut);
      const waterIn = humidIn / (c2.value2 - humidIn);
      const delWater = c2.value1 * (waterOut - waterIn);
      const calcRemovedVapor = (calculatedFreshAir * frAirCal) * delWater;
      const resultant =Math.ceil(Math.max(calculatedRoomCfm + calculatedFreshAir, calculatedDehumid) / 25) *25;

      setArea(Number(calculatedArea.toFixed(2)));
      setVolume(Number(calculatedVolume.toFixed(2)));
      setRoomCfm(Number(calculatedRoomCfm.toFixed(3)));
      setFreshAir(Number(calculatedFreshAir.toFixed(3)));
      setExhaustAir(Number(calculatedExhaustAir.toFixed(3)));
      setDehumidification(Number(calculatedDehumid.toFixed(2)));
      setremovedWaterVapor(Number(calcRemovedVapor.toFixed(3)));
      setResultantCfm(Number(resultant.toFixed(0)));
    };
  
    useEffect(() => {
      calculateResults();
    }, [roomPayload]);

  useEffect(() => {
    console.log("RESULTS:", {
      roomPayload,
      acphUsed: roomPayload.acph,
      area,
      volume,
      roomCfm,
      freshAir,
      exhaustAir,
      Dehumidification,
      removedWaterVapor,
      ResultantCfm
    });
  }, [roomPayload, area, volume, roomCfm, freshAir, exhaustAir, Dehumidification, removedWaterVapor,ResultantCfm ]);

  return (
    <div className={s.wrap}>
      <div className={s.card}>
        <div>
          <div className={s.title}>{t.title}</div>
          <div className={s.subtitle}>{t.subtitle}</div>
        </div>

        <div className={s.grid}>
          <div className={s.item}>
            <div className={s.label}>{t.fields.area.label}</div>
            <div className={s.value}>{area}</div>
          </div>

          <div className={s.item}>
            <div className={s.label}>{t.fields.volume.label}</div>
            <div className={s.value}>{volume}</div>
          </div>

          <div className={s.item}>
            <div className={s.label}>{t.fields.roomCfm.label}</div>
            <div className={s.value}>{roomCfm}</div>
          </div>

          <div className={s.item}>
            <div className={s.label}>{t.fields.freshAir.label}</div>
            <div className={s.value}>{freshAir}</div>
          </div>

          <div className={s.item}>
            <div className={s.label}>{t.fields.exhaustAir.label}</div>
            <div className={s.value}>{exhaustAir}</div>
          </div>

          <div className={s.item}>
            <div className={s.label}>{t.fields.Dehumidification.label}</div>
            <div className={s.value}>{Dehumidification}</div>
          </div>
          <div className={s.item}>
            <div className={s.label}>{t.fields.remWaterVapour.label}</div>
            <div className={s.value}>{removedWaterVapor}</div>
          </div>
          <div className={s.item}>
            <div className={s.label}>{t.fields.ResultantCfm.label}</div>
            <div className={s.value}>{ResultantCfm}</div>
          </div>

        </div>
      </div>

      <div className={s.footer}>
        <Link to="/room" className={s.backLink}>
          <FaArrowLeft /> back
        </Link>
      </div>
    </div>
  );
}