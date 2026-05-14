import resultsText from "../../json/resultsText.json";

export type RoomPayload = {
  roomName: string;
  length: string;
  width: string;
  height: string;
  acph: number;
  freshAirPercent: string;
  exhaustAir: string;
  exhaustAirCfm: string;
  occupancy: string;
  equipmentLoad: string;
  lightingLoad: string;
  infiltrationsPerHour: string;
  zoneId?: string | number;
  zoneSystem?: string;
  zoneSystemType?: string;
  zoneCoolingMethod?: string;
  zoneHeatingMethod?: string;
  zoneClassification?: string;
  zoneReqInsideTempC?: string | number | null;
  zoneReqInsideHum?: number | string;
  minTempC?: number | string;
  maxTempC?: number | string;
  rhMin?: number | string;
  rhMax?: number | string;

  flowVelocity?: number;
  heatingFlowVelocity?: number;
  coolingFlowVelocity?: number;
};

const t = resultsText;

export function getSystemFlags(
  zoneSystem: string,
  zoneSystemType: string,
  room: RoomPayload
) {
  const zoneSystemName = String(zoneSystem || "")
    .toUpperCase()
    .trim();
  const zoneSystemTypeName = String(zoneSystemType || "")
    .toUpperCase()
    .trim();

  const reqInsideTempLocal = Number(room.zoneReqInsideTempC || 0);
  const isTempValid =
    !isNaN(reqInsideTempLocal) && room.zoneReqInsideTempC !== "";

  const coolingList = t.fields.SystemCond.cooling || [];
  const heatingList = t.fields.SystemCond.heating || [];
  const heatAndColdList = t.fields.SystemCond.heatandcold || [];
  const coolAndVentList = t.fields.SystemCond.coolandvent || [];
  const heatAndVentList = t.fields.SystemCond.heatandvent || [];
  const ventilationList = t.fields.SystemCond.ventilation || [];

  const isCoolingOnly = coolingList.some(
    (name: string) => String(name).toUpperCase().trim() === zoneSystemName
  );

  const isHeatingOnly = heatingList.some(
    (name: string) => String(name).toUpperCase().trim() === zoneSystemName
  );

  const isCoolingAndVentilation = coolAndVentList.some(
    (name: string) => String(name).toUpperCase().trim() === zoneSystemName
  );

  const isHeatingAndVentilation = heatAndVentList.some(
    (name: string) => String(name).toUpperCase().trim() === zoneSystemName
  );

  const isVentilationOnly =
    ventilationList.some(
      (name: string) => String(name).toUpperCase().trim() === zoneSystemName
    ) ||
    ventilationList.some(
      (name: string) => String(name).toUpperCase().trim() === zoneSystemTypeName
    );

  const isHeatingandCoolingSystem = heatAndColdList.some(
    (name: string) => String(name).toUpperCase().trim() === zoneSystemName
  );

  const exhaustflag =
    Number(room.exhaustAir || 0) > 0 || Number(room.exhaustAirCfm || 0) > 0;

  const showCooling =
    isCoolingOnly || isCoolingAndVentilation || isHeatingandCoolingSystem;

  const showHeating =
    isHeatingOnly || isHeatingAndVentilation || isHeatingandCoolingSystem;

  const showVentilation =
    isVentilationOnly || isCoolingAndVentilation || isHeatingAndVentilation;

  return {
    isCoolingSystem: showCooling,
    isHeatingSystem: showHeating,
    isHeatingandCoolingSystem,
    isTempValid,
    isVentilationSystem: showVentilation,
    showCooling,
    showHeating,
    showVentilation,
    exhaustflag,
    isCoolingAndVentilation,
    isHeatingAndVentilation,
  };
}

export type AirflowResults = {
  zoneReqInsideTempC: number | string;
  roomName: string;
  areaFt2: number;
  volumeFt3: number;
  roomCfm: number;
  freshAir: number;
  ResultantSupplyAir: number;
  exhaustAir: number;
  dehumidValue: number | string;
  removedWater: number | string;
  resultantCfm: number | string;
  roomACValue: number | string;
  roomTermSupplyValue: number | string;
  cfmACLoadTR: number | string;
  resultCoolLoadTR: number | string;
  addWaterValue: number | string;
  humidValue: number | string;
  resultantheatCfm: number | string;
  roomTermSupplyHeatValue: number | string;
  cfmHeatLoadTRValue: number | string;
  roomHeatLoadTR: number | string;
  resultHeatLoadTR: number | string;
  zoneSystem: string;
  zoneClassification?: string;
  flowVelocity?: number;
  heatingFlowVelocity?: number;
  coolingFlowVelocity?: number;
};

export function airflowService(
  room: RoomPayload
): AirflowResults | AirflowResults[] {
  const reqInsideTemp = Number(room.zoneReqInsideTempC || 0);
  const reqInsideHum = Number(room.zoneReqInsideHum || 0);

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

  const zoneCoolingMethod = room.zoneCoolingMethod || "";
  const zoneHeatingMethod = room.zoneHeatingMethod || "";
  const roomClassi = String(room.zoneClassification ?? "").trim();

  const {
    showCooling,
    showHeating,
    isTempValid,
    isCoolingAndVentilation,
    isHeatingAndVentilation,
    isVentilationSystem,
  } = getSystemFlags(room.zoneSystem || "", room.zoneSystemType || "", room);

  const frAirCal = t.fields.remWaterVapour.FrAirCal.value;
  const c1 = t.fields.remWaterVapour.delTempConst;
  const c2 = t.fields.remWaterVapour.watConst;
  const roomACconst = t.fields.roomACloadTR;
  const roomHeatConst = t.fields.roomHeatLoadTR;
  const V1 = t.fields.ClassifiCondition;
  const V2 = t.fields.roomTerminalSupply.VelocityConst;
  const Classifi = roomClassi.toUpperCase().trim();

  const areaFt2 = L * W * 10.76;
  const volumeFt3 = Math.ceil(areaFt2 * H * 3.28 * 100) / 100;
  const roomCfm = (volumeFt3 * ACPH) / 60;

  const faPercent = Number(room.freshAirPercent || 0);
  const faFactor = faPercent / 100;

  const eaRaw = Number(room.exhaustAir || 0);
  const eaFactor = eaRaw > 1 ? eaRaw / 100 : eaRaw;
  const baseFreshAir = roomCfm * faFactor;
  const exhaustCfm = Number(room.exhaustAirCfm || 0);

  const freshAir = isVentilationSystem
    ? (faFactor + 1) * roomCfm
    : (eaFactor === 0 && exhaustCfm === 0)
      ? baseFreshAir
      : (eaFactor + faFactor) * roomCfm;

  const exhaustAir = isVentilationSystem
    ? (eaFactor === 0 && exhaustCfm === 0)
      ? (eaFactor * roomCfm) + exhaustCfm
      : (eaFactor * roomCfm) + exhaustCfm
    : (eaFactor * roomCfm) + exhaustCfm;


  let dehumidValue: number | string = 0;
  let removedWater: number | string = 0;
  let resultantCfm: number | string = 0;
  let roomACValue: number | string = 0;
  let roomTermSupplyValue: number | string = 0;
  let cfmACLoadTR: number | string = "-";
  let resultCoolLoadTR: number | string = 0;
  let addWaterValue: number | string = 0;
  let humidValue: number | string = 0;
  let resultantheatCfm: number | string = 0;
  let roomTermSupplyHeatValue: number | string = 0;
  let roomHeatLoad: number | string = 0;
  let resultHeatLoadTR: number | string = 0;
  let cfmHeatLoadTRValue: number | string = 0;
  let delWater1 = 0;
  let delAHUVal = 0;
  let delWaterVal = 0;
  let baseLoad = 0;
  let correction = 0;
  let ERLH = 0;

  ///// Cooling Calculations //////

  function calculateDehumidCfm() {
    if (!showCooling) return 0;

    if (showCooling && isTempValid) {
      dehumidValue =
        Math.ceil(
          (
            occupancy * 200 +
            infiltrationsPerHour * 375 +
            (exhaustAir + roomCfm)
          ) / 25
        ) * 25;
    } else {
      dehumidValue = room.zoneReqInsideTempC || "Invalid";
    }
    return dehumidValue;
  }

  function calculateRemovedWater() {
    if (!showCooling) return 0;

    if (showCooling && isTempValid) {
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
      removedWater = Number(
        (freshAir * frAirCal * (delWater / c2.value3)).toFixed(3)
      );
    } else {
      removedWater = room.zoneReqInsideTempC || "Invalid";
    }
    return removedWater;
  }

  function calculateResultantCfm() {
    if (!showCooling) return 0;

    if (showCooling && isTempValid) {
      const baseAirflow = roomCfm + freshAir + exhaustAir;
      resultantCfm =
        Math.ceil(Math.max(baseAirflow, Number(dehumidValue || 0)) / 25) * 25;
    }
    return resultantCfm;
  }

  function calculateRoomACValue() {
    if (!showCooling) return 0;

    if (showCooling && isTempValid) {
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
      roomACValue = room.zoneReqInsideTempC || "Invalid";
    }
    return roomACValue;
  }

  function calculateRoomTerminalSupply() {
    if (!showCooling) return 0;

    if (showCooling && isTempValid) {
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
      else result = Number(resultantCfm) / V2.NCVV;

      if (result > 0) result = Number(result.toFixed(2));
      roomTermSupplyValue = Math.ceil(result / 2) * 2;
    }
    return roomTermSupplyValue;
  }

  function calculateCfmACLoad() {
    if (!showCooling) return 0;

    if (showCooling && isTempValid) {
      let rawValue = 0;
      if (typeof resultantCfm === "number") {
        let divisor = 0;
        if (zoneCoolingMethod === "Chilled Water") divisor = 400;
        else if (zoneCoolingMethod === "DX") divisor = 300;
        else if (zoneCoolingMethod === "Brine") divisor = 600;
        if (divisor > 0) rawValue = Number(resultantCfm) / divisor;
      }
      cfmACLoadTR = Math.ceil(rawValue / 0.5) * 0.5;
    } else {
      cfmACLoadTR = room.zoneReqInsideTempC || "Invalid";
    }
    return cfmACLoadTR;
  }

  function calculateResultCoolLoadTR() {
    if (!showCooling) return 0;

    if (showCooling && isTempValid) {
      resultCoolLoadTR =
        Math.ceil(Math.max(Number(roomACValue), Number(cfmACLoadTR)) / 0.5) * 0.5;
    } else {
      resultCoolLoadTR = room.zoneReqInsideTempC || "Invalid";
    }
    return resultCoolLoadTR;
  }
  //// Heating Calculations /////
  function calculateaddWaterVapour() {
    if (!showHeating) return 0;

    if (showHeating && isTempValid) {
      const peakTempMin =
        c1.value1 * Math.pow(10, (c1.value2 * minTemp) / (c1.value3 + minTemp));
      const roomAWVTemp =
        c1.value1 *
        Math.pow(10, (c1.value2 * reqInsideTemp) / (c1.value3 + reqInsideTemp));
      const humidOut1 = (rhMin / 100) * peakTempMin;
      const humidIn1 = (reqInsideHum / 100) * roomAWVTemp;
      const waterOut1 = humidOut1 / (c2.value2 - humidOut1);
      const waterIn1 = humidIn1 / (c2.value2 - humidIn1);
      delWater1 = Number((c2.value1 * (waterOut1 - waterIn1)).toFixed(3));
      addWaterValue = Math.abs(
        Number((freshAir * frAirCal * (delWater1 / c2.value3)).toFixed(3))
      );
    } else {
      addWaterValue = room.zoneReqInsideTempC || "Invalid";
    }
    return addWaterValue;
  }

  function calculatehumidValue() {
    if (!showHeating) return 0;

    if (showHeating && isTempValid) {
      const peakTempAHU =
        c1.value1 *
        Math.pow(
          10,
          (c1.value2 * (reqInsideTemp - 8)) / (c1.value3 + (reqInsideTemp - 8))
        );
      const roomTempAHU =
        c1.value1 *
        Math.pow(10, (c1.value2 * reqInsideTemp) / (c1.value3 + reqInsideTemp));
      const humidAHUOut = ((reqInsideHum + 40) / 100) * peakTempAHU;
      const humidAHUIn = (reqInsideHum / 100) * roomTempAHU;
      const waterAHUOut = humidAHUOut / (c2.value2 - humidAHUOut);
      const waterAHUIn = humidAHUIn / (c2.value2 - humidAHUIn);
      const delWatAHU = Number((c2.value1 * (waterAHUOut - waterAHUIn)).toFixed(3));
      delAHUVal = 0.68 * delWatAHU;
      delWaterVal = 0.68 * delWater1;
      const waterRatio = delWater1 !== 0 ? delAHUVal / delWaterVal : 0;
      const freshroomCal = freshAir + exhaustAir;
      baseLoad =
        occupancy * 200 +
        infiltrationsPerHour * 375 +
        Number(freshroomCal.toFixed(3));
      correction = (roomCfm - freshAir) * waterRatio;
      humidValue = Math.ceil((baseLoad + correction) / 25) * 25;
      ERLH = delWaterVal * baseLoad + (roomCfm - (freshAir)) * delAHUVal;
    } else {
      humidValue = room.zoneReqInsideTempC || "Invalid";
    }
    return humidValue;
  }

  function calculateResultantHeatCfm() {
    if (!showHeating) return 0;

    if (showHeating && isTempValid) {
      const humidValNum = typeof humidValue === "number" ? humidValue : 0;
      resultantheatCfm =
        Math.ceil(
          Math.max(roomCfm + freshAir + exhaustAir, humidValNum) / 25
        ) * 25;
    }
    return resultantheatCfm;
  }

  function calculateRoomTerminalSupplyHeat() {
    if (!showHeating) return 0;

    if (showHeating && isTempValid) {
      const heatValue = parseFloat(String(resultantheatCfm));
      let heatresult = 0;
      if (V1.ISO8Cd.includes(Classifi) || V1.ISO7Cd.includes(Classifi)) {
        heatresult = heatValue / V2.ISO8VV;
      } else if (V1.ISOCd6.includes(Classifi)) {
        heatresult = heatValue / V2.ISO5VV;
      } else if (V1.ISOCd5.includes(Classifi)) {
        heatresult = heatValue / V2.ISO5VV;
      } else if (V1.ISOCd4.includes(Classifi)) {
        heatresult = heatValue / V2.ISO4VV;
      } else if (V1.ISOCd3.includes(Classifi)) {
        heatresult = heatValue / V2.ISO3VV;
      } else if (V1.ISOCd2.includes(Classifi)) {
        heatresult = heatValue / V2.ISO2VV;
      } else if (V1.ISOCd1.includes(Classifi)) {
        heatresult = heatValue / V2.ISO1VV;
      } else {
        heatresult = heatValue / V2.NCVV;
      }

      if (heatresult > 0) heatresult = Number(heatresult.toFixed(2));
      roomTermSupplyHeatValue = Math.ceil(heatresult / 2) * 2;
    }
    return roomTermSupplyHeatValue;
  }

  function calculateCfmHeatLoadTR() {
    if (!showHeating) return 0;

    if (showHeating && isTempValid) {
      let rawValue = 0;
      if (typeof resultantheatCfm === "number" && resultantheatCfm > 0) {
        let divisor = 0;
        const method = zoneHeatingMethod?.trim();
        if (method === "Hot Water" || method === "Steam") divisor = 400;
        if (divisor > 0) rawValue = resultantheatCfm / divisor;
      }
      cfmHeatLoadTRValue = Math.ceil(rawValue / 0.5) * 0.5;
    } else {
      cfmHeatLoadTRValue = room.zoneReqInsideTempC || "Invalid";
    }
    return cfmHeatLoadTRValue;
  }

  function calculateRoomHeatLoadTR() {
    if (!showHeating) return 0;

    if (showHeating && isTempValid) {
      const pc = roomACconst.PeopleConst;
      const hc = roomHeatConst;
      const tempdiffer = roomACconst.TempdiffConst.value * (minTemp - reqInsideTemp);
      const dimenCal =
        Number((hc.value1 * tempdiffer).toFixed(5)) * (H * 2 * (L + W) + L * W);
      const FilterCal = Number(
        (hc.value2 * (L * W + infiltrationsPerHour * hc.value3)).toFixed(5)
      );
      const equpNlightn = Number(
        (
          roomACconst.EqupConst.value *
          (equipment * hc.value4 + lighting * areaFt2)
        ).toFixed(5)
      );
      const peopCal = Number(
        (
          pc.value1 *
          tempdiffer *
          (occupancy * pc.value2 + Number((freshAir + exhaustAir).toFixed(2)))
        ).toFixed(5)
      );
      const HeatERSH = dimenCal + FilterCal + equpNlightn + peopCal;
      const ERTH = HeatERSH + ERLH;
      const roomheatloadConst = ERTH / roomACconst.TonsConst.value;
      roomHeatLoad = Number(Math.ceil(Math.abs(roomheatloadConst) * 2) / 2);
    } else {
      roomHeatLoad = room.zoneReqInsideTempC || "Invalid";
    }
    return roomHeatLoad;
  }

  function calculateResultantHeatLoadTR() {
    if (!showHeating) return 0;

    if (showHeating && isTempValid) {
      resultHeatLoadTR =
        Math.ceil(
          Math.max(Number(roomHeatLoad || 0), Number(cfmHeatLoadTRValue || 0)) / 0.5
        ) * 0.5;
    } else {
      resultHeatLoadTR = room.zoneReqInsideTempC || "Invalid";
    }
    return resultHeatLoadTR;
  }

  const isCombinedVentilationSystem =
    isCoolingAndVentilation || isHeatingAndVentilation;
  const result: AirflowResults = {
    roomName: room.roomName,
    zoneSystem: String(room.zoneSystem),
    zoneReqInsideTempC: room.zoneReqInsideTempC ?? 0,
    areaFt2: Number(areaFt2.toFixed(2)),
    volumeFt3: Number(volumeFt3.toFixed(2)),
    roomCfm: Number(roomCfm.toFixed(3)),
    freshAir: Number(freshAir.toFixed(3)),
    ResultantSupplyAir:
      isVentilationSystem && !isCombinedVentilationSystem
        ? Number((freshAir + roomCfm).toFixed(3))
        : 0,
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

  if (isCoolingAndVentilation || isHeatingAndVentilation) {
    const freshAirPrimary =
      (eaFactor === 0 && exhaustCfm === 0)
        ? baseFreshAir
        : (eaFactor + faFactor) * roomCfm;

    const exhaustAirPrimary = exhaustAir;

    const primaryResult: AirflowResults = {
      ...result,
      freshAir: Number(freshAirPrimary.toFixed(3)),
      exhaustAir: Number(exhaustAirPrimary.toFixed(3)),
    };

    const ventilationFreshAir = (faFactor + 1) * roomCfm;
    const ventilationExhaustAir = (eaFactor === 0 && exhaustCfm === 0)
      ? (eaFactor * roomCfm) + exhaustCfm
      : (eaFactor * roomCfm) + exhaustCfm;


    const ventilationOnlyResult: AirflowResults = {
      ...result,
      roomName: room.roomName,
      freshAir: Number(ventilationFreshAir.toFixed(3)),
      ResultantSupplyAir: Number((ventilationFreshAir + roomCfm).toFixed(3)),
      exhaustAir: Number(ventilationExhaustAir.toFixed(3)),
      dehumidValue: 0,
      removedWater: 0,
      resultantCfm: 0,
      roomACValue: 0,
      roomTermSupplyValue: 0,
      cfmACLoadTR: 0,
      resultCoolLoadTR: 0,
      addWaterValue: 0,
      humidValue: 0,
      resultantheatCfm: 0,
      roomTermSupplyHeatValue: 0,
      cfmHeatLoadTRValue: 0,
      roomHeatLoadTR: 0,
      resultHeatLoadTR: 0,
    };

    return [primaryResult, ventilationOnlyResult];
  }

  return result;
}