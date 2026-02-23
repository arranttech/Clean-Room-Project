import resultsText from "../../json/resultsText.json";

export type RoomPayload = {
  roomName: string;
  length: number;
  width: number;
  height: number;
  acph: number;
  freshAirPercent: number;
  exhaustAir: number;
  occupancy: number;
  equipmentLoad: string;
  lightingLoad: string;
  infiltrationsPerHour: number;

  zoneSystem?: string;
  zoneSystemType?: string;
  zoneCoolingMethod?: string;
  zoneHeatingMethod?: string;
  zoneClassification?: string;

  zoneReqInsideTempC?: number | string;
  zoneReqInsideHum?: number | string;

  minTempC?: number | string;
  maxTempC?: number | string;
  rhMin?: number | string;
  rhMax?: number | string;
};

const t = resultsText;

export function airflowService(room: RoomPayload) {

  // ================= BASIC VALUES =================

  const ACPH = Number(room.acph || 0);
  const L = Number(room.length || 0);
  const W = Number(room.width || 0);
  const H = Number(room.height || 0);

  const maxTemp = Number(room.maxTempC || 0);
  const rhMax = Number(room.rhMax || 0);
  const minTemp = Number(room.minTempC || 0);
  const rhMin = Number(room.rhMin || 0);

  const occupancy = Number(room.occupancy || 0);
  const equipment = Number(room.equipmentLoad || 0);
  const lighting = Number(room.lightingLoad || 0);
  const infiltrationsPerHour = Number(room.infiltrationsPerHour || 0);

  const reqInsideTemp = Number(room.zoneReqInsideTempC || 0);
  const reqInsideHum = Number(room.zoneReqInsideHum || 0);

  const zoneCoolingMethod = room.zoneCoolingMethod || "";
  const zoneHeatingMethod = room.zoneHeatingMethod || "";
  const roomClassi = String(room.zoneClassification ?? "").trim();

  const zoneSystemName = String(room.zoneSystem || "").toUpperCase().trim();

  // ================= SYSTEM FLAGS (NEW PART ADDED) =================

  const isCoolingSystem = t.fields.SystemCond.cooling.some(
    (name: string) => name.toUpperCase() === zoneSystemName
  );

  const isHeatingSystem = t.fields.SystemCond.heating.some(
    (name: string) => name.toUpperCase() === zoneSystemName
  );

  const isHeatingandCoolingSystem = t.fields.SystemCond.heatandcold.some(
    (name: string) => name.toUpperCase() === zoneSystemName
  );

  const showCooling = isCoolingSystem || isHeatingandCoolingSystem;
  const showHeating = isHeatingSystem || isHeatingandCoolingSystem;


  const isVentilationSystem =
    room.zoneSystem === "Ventilation System" ||
    room.zoneSystemType === "Ventilation System";

  const isTempValid =
    !isNaN(reqInsideTemp) &&
    room.zoneReqInsideTempC !== "";

  const frAirCal = t.fields.remWaterVapour.FrAirCal.value;
  const c1 = t.fields.remWaterVapour.delTempConst;
  const c2 = t.fields.remWaterVapour.watConst;
  const roomACconst = t.fields.roomACloadTR;
  const roomHeatConst = t.fields.roomHeatLoadTR;
  const V1 = t.fields.ClassifiCondition;
  const V2 = t.fields.roomTerminalSupply.VelocityConst;
  let Classifi = roomClassi.toUpperCase().trim();

  // ================= AREA & AIRFLOW =================

  const areaFt2 = L * W * 10.76;

  const volumeFt3 =
    Math.ceil(areaFt2 * H * 3.28 * 100) / 100;

  const roomCfm = (volumeFt3 * ACPH) / 60;

  const faPercent = isVentilationSystem ? 100 : Number(room.freshAirPercent || 0);
  const faFactor = faPercent / 100;

  const eaRaw = Number(room.exhaustAir || 0);
  const eaFactor = eaRaw > 1 ? eaRaw / 100 : eaRaw;

  const freshAir = isVentilationSystem ? faPercent : roomCfm * faFactor;
  const exhaustAir = roomCfm * eaFactor;

  // ================= RESULT VARIABLES =================

  let dehumidValue: number | string = 0;
  let removedWater: number | string = 0;
  let resultantCfm: number | string = 0;
  let roomACValue: number | string = 0;
  let roomTermSupplyValue: number | string = 0;
  let cfmACLoadTR: number | string = 0;
  let resultCoolLoadTR: number | string = 0;
  let addWaterValue: number | string = 0;
  let humidValue: number | string;
  let resultantheatCfm: number | string = 0;
  let roomTermSupplyHeatValue: number | string = 0;
  let roomHeatLoad: number | string = 0;
  let resultHeatLoadTR: number | string = 0;
  let cfmHeatLoadTRValue: number | string = 0;
  let delWaterVal = 0;
  let baseLoad = 0;
  let delAHUVal = 0;
  let correction = 0;
  let ERLH = 0;
  let delWater1 = 0;

  // ================= COOLING VAST CALCULATION =================

  function calculateDehumidCfm() {
    if (isVentilationSystem) {
      dehumidValue =
        Math.ceil(
          (occupancy * 200 + infiltrationsPerHour * 375 + freshAir) / 25
        ) * 25;
    } else {
      dehumidValue =
        Math.ceil(
          (occupancy * 200 + infiltrationsPerHour * 375 + (exhaustAir + roomCfm)) /
          25
        ) * 25;
    }
    return dehumidValue;
  }

  function calculateRemovedWater() {
    const peakTempVP =
      c1.value1 * Math.pow(10, (c1.value2 * maxTemp) / (c1.value3 + maxTemp));

    const roomTempVP =
      c1.value1 * Math.pow(10, (c1.value2 * reqInsideTemp) / (c1.value3 + reqInsideTemp));

    const humidOut = (rhMax / 100) * peakTempVP;
    const humidIn = (reqInsideHum / 100) * roomTempVP;

    const waterOut = humidOut / (c2.value2 - humidOut);
    const waterIn = humidIn / (c2.value2 - humidIn);

    const delWater = c2.value1 * (waterOut - waterIn);

    removedWater = Number(
      (freshAir * frAirCal * (delWater / c2.value3)).toFixed(3)
    );

    return removedWater;
  }

  function calculateResultantCfm() {
    const baseAirflow = roomCfm + freshAir;

    resultantCfm =
      Math.ceil(Math.max(baseAirflow, Number(dehumidValue)) / 25) * 25;

    return resultantCfm;
  }

  function calculateRoomACValue() {
    const pc = roomACconst.PeopleConst;

    const tempdiffer =
      roomACconst.TempdiffConst.value *
      Math.abs(maxTemp - reqInsideTemp);

    const wallConduction =
      roomACconst.WallConst.value * (H * (L + W));

    const peopleNAirflow =
      pc.value1 *
      (occupancy * pc.value2 + (freshAir + exhaustAir));

    const equipNlight =
      roomACconst.EqupConst.value *
      (equipment * 1000 + lighting * areaFt2);

    const infilteration =
      infiltrationsPerHour *
      roomACconst.InfilterConst.value;

    const ERSH =
      tempdiffer * (wallConduction + peopleNAirflow) +
      equipNlight +
      infilteration;

    roomACValue =
      Number(
        (Math.ceil((ERSH / roomACconst.TonsConst.value) * 2) / 2).toFixed(2)
      );

    return roomACValue;
  }

  function calculateRoomTerminalSupply() {
    const V1 = t.fields.ClassifiCondition;
    const V2 = t.fields.roomTerminalSupply.VelocityConst;

    let Classifi = roomClassi.toUpperCase().trim();
    let result = 0;

    if (V1.ISO8Cd.includes(Classifi) || V1.ISO7Cd.includes(Classifi))
      result = Number(resultantCfm) / V2.ISO8VV;
    else if (V1.ISOCd6.includes(Classifi))
      result = Number(resultantCfm) / V2.ISO6VV;
    else if (V1.ISOCd5.includes(Classifi))
      result = Number(resultantCfm) / V2.ISO5VV;
    else if (V1.ISOCd4.includes(Classifi))
      result = Number(resultantCfm) / V2.ISO4VV;
    else if (V1.ISOCd3.includes(Classifi))
      result = Number(resultantCfm) / V2.ISO3VV;
    else if (V1.ISOCd2.includes(Classifi))
      result = Number(resultantCfm) / V2.ISO2VV;
    else if (V1.ISOCd1.includes(Classifi))
      result = Number(resultantCfm) / V2.ISO1VV;
    else
      result = Number(resultantCfm) / V2.NCVV;

    if (result > 0) result = Number(result.toFixed(2));

    roomTermSupplyValue = Math.ceil(result / 2) * 2;

    return roomTermSupplyValue;
  }

  function calculateCfmACLoad() {
    let rawValue = 0;
    if (typeof resultantCfm === "number") {
      let divisor = 0;
      if (zoneCoolingMethod === "Chilled Water") divisor = 400;
      else if (zoneCoolingMethod === "DX") divisor = 300;
      else if (zoneCoolingMethod === "Brine") divisor = 600;
      if (divisor > 0) rawValue = Number(resultantCfm) / divisor;
    }
    cfmACLoadTR =
      Math.ceil(rawValue / 0.5) * 0.5;

    return cfmACLoadTR;
  }

  function calculateResultCoolLoadTR() {
    resultCoolLoadTR =
      Math.ceil(
        Math.max(Number(roomACValue), Number(cfmACLoadTR)) / 0.5
      ) * 0.5;

    return resultCoolLoadTR;
  }

  // ================= HEATING VAST CALCULATION =================


  function calculateaddWaterVapour() {
      const peakTempMin = c1.value1 * Math.pow(10, (c1.value2 * minTemp) / (c1.value3 + minTemp));
      const roomAWVTemp = c1.value1 * Math.pow(10, (c1.value2 * reqInsideTemp) / (c1.value3 + reqInsideTemp));
      const humidOut1 = (rhMin / 100) * peakTempMin;
      const humidIn1 = (reqInsideHum / 100) * roomAWVTemp;
      const waterOut1 = humidOut1 / (c2.value2 - humidOut1);
      const waterIn1 = humidIn1 / (c2.value2 - humidIn1);
      delWater1 = Number((c2.value1 * (waterOut1 - waterIn1)).toFixed(3));
      addWaterValue = Math.abs(Number((freshAir * frAirCal * (delWater1 / c2.value3)).toFixed(3)));
    return addWaterValue;
  }

  function calculatehumidValue() {
    const peakTempAHU = c1.value1 * Math.pow(10, (c1.value2 * (reqInsideTemp - 8)) / (c1.value3 + (reqInsideTemp - 8)));
    const roomTempAHU = c1.value1 * Math.pow(10, (c1.value2 * reqInsideTemp) / (c1.value3 + reqInsideTemp));
    const humidAHUOut = ((reqInsideHum + 40) / 100) * peakTempAHU;
    const humidAHUIn = (reqInsideHum / 100) * roomTempAHU;
    const waterAHUOut = humidAHUOut / (c2.value2 - humidAHUOut);
    const waterAHUIn = humidAHUIn / (c2.value2 - humidAHUIn);
    const delWatAHU = Number((c2.value1 * (waterAHUOut - waterAHUIn)).toFixed(3));
    delAHUVal = 0.68 * delWatAHU;
    delWaterVal = 0.68 * delWater1;
    const waterRatio = delWater1 !== 0 ? delAHUVal / delWaterVal : 0;
    const freshroomCal = freshAir + exhaustAir;
    baseLoad = occupancy * 200 + infiltrationsPerHour * 375 + Number(freshroomCal.toFixed(3));
    correction = (roomCfm - freshAir) * waterRatio;
    humidValue = Math.ceil((baseLoad + correction) / 25) * 25;
    ERLH = delWaterVal * baseLoad + (roomCfm - freshAir) * delAHUVal;
    return humidValue;
  }
  function calculateResultantHeatCfm() {
    if (typeof humidValue === "number") {
      resultantheatCfm = Math.ceil(Math.max(roomCfm + freshAir, humidValue) / 25) * 25;
    } else {
      resultantheatCfm = Math.ceil((roomCfm + freshAir) / 25) * 25;
    }
    return resultantheatCfm;
  }
  function calculateRoomTerminalSupplyHeat() {
    let heatValue = parseFloat(String(resultantheatCfm));
    let heatresult = 0;
    if (V1.ISO8Cd.includes(Classifi) || V1.ISO7Cd.includes(Classifi)) { heatresult = heatValue / V2.ISO8VV; }
    else if (V1.ISOCd6.includes(Classifi)) { heatresult = heatValue / V2.ISO5VV; }
    else if (V1.ISOCd5.includes(Classifi)) { heatresult = heatValue / V2.ISO5VV; }
    else if (V1.ISOCd4.includes(Classifi)) { heatresult = heatValue / V2.ISO4VV; }
    else if (V1.ISOCd3.includes(Classifi)) { heatresult = heatValue / V2.ISO3VV; }
    else if (V1.ISOCd2.includes(Classifi)) { heatresult = heatValue / V2.ISO2VV; }
    else if (V1.ISOCd1.includes(Classifi)) { heatresult = heatValue / V2.ISO1VV; }
    else { heatresult = heatValue / V2.NCVV; }

    if (heatresult > 0) heatresult = Number(heatresult.toFixed(2));
    roomTermSupplyHeatValue = Math.ceil(heatresult / 2) * 2;

    return roomTermSupplyHeatValue;
  }

  function calculateCfmHeatLoadTR() {
      let rawValue = 0;
      if (typeof resultantheatCfm === "number" && resultantheatCfm > 0) {
        let divisor = 0;
        const method = zoneHeatingMethod?.trim();
        if (method === "Hot Water" || method === "Steam") divisor = 400;
        if (divisor > 0) rawValue = resultantheatCfm / divisor;
      }
      cfmHeatLoadTRValue = Math.ceil(rawValue / 0.5) * 0.5;
        return cfmHeatLoadTRValue;
  }
  function calculateRoomHeatLoadTR() {
    const pc = roomACconst.PeopleConst;
        const hc = roomHeatConst;
        const tempdiffer = roomACconst.TempdiffConst.value * (minTemp - reqInsideTemp);
        const dimenCal = Number((hc.value1 * tempdiffer).toFixed(5)) * (H * 2 * (L + W) + L * W);
        const FilterCal = Number((hc.value2 * (L * W + infiltrationsPerHour * hc.value3)).toFixed(5));
        const equpNlightn = Number((roomACconst.EqupConst.value * (equipment * hc.value4 + lighting * areaFt2)).toFixed(5));
        const peopCal = Number((pc.value1 * tempdiffer * (occupancy * pc.value2 + Number((freshAir + exhaustAir).toFixed(2)))).toFixed(5));
        const HeatERSH = dimenCal + FilterCal + equpNlightn + peopCal;
        const ERTH = HeatERSH + ERLH;
        const roomheatloadConst = ERTH / roomACconst.TonsConst.value;
        roomHeatLoad = Number(Math.ceil(Math.abs(roomheatloadConst) * 2) / 2);
        return roomHeatLoad;
  }
  function calculateResultantHeatLoadTR() { 
  resultHeatLoadTR = Math.ceil(Math.max(Number(roomHeatLoad), Number(cfmHeatLoadTRValue)) / 0.5) * 0.5;
  return resultHeatLoadTR;
   }
   
   // ================= RETURN =================

    return {
      roomName: room.roomName,
      areaFt2: Number(areaFt2.toFixed(2)),
      volumeFt3: Number(volumeFt3.toFixed(2)),
      roomCfm: Number(roomCfm.toFixed(3)),
      freshAir: Number(freshAir.toFixed(3)),
      exhaustAir: Number(exhaustAir.toFixed(3)),
      dehumidValue: calculateDehumidCfm(),
      removedWater: calculateRemovedWater(),
      resultantCfm: calculateResultantCfm(),
      roomACValue: calculateRoomACValue(),
      roomTermSupplyValue: calculateRoomTerminalSupply(),
      cfmACLoadTR: calculateCfmACLoad(),
      resultCoolLoadTR: calculateResultCoolLoadTR(),
      addWaterValue: calculateaddWaterVapour(),
      humidValue: calculatehumidValue(),
      resultantheatCfm: calculateResultantHeatCfm(),
      roomTermSupplyHeatValue: calculateRoomTerminalSupplyHeat(),
      cfmHeatLoadTRValue: calculateCfmHeatLoadTR(),
      roomHeatLoadTR: calculateRoomHeatLoadTR(),
      resultHeatLoadTR: calculateResultantHeatLoadTR(),
    };
  }