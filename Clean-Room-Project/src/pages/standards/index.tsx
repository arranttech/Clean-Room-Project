import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  updateStandardsField,
  updateMultipleStandardsFields,
  resetStandards,
} from "../../redux/slices/standardSlice";
import { updateInProgressProject } from "../../redux/slices/dashboardSlice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import standardDesign from "./styles";
import standardDataJson from "../../json/standardData.json";
import {
  roomStandards,
  getRoomStandards,
  updateRoomStandards,
} from "../../backend/controller/roomController";
import { createProjectZone } from "../../backend/controller/zoneController";
import { Tooltip } from "../../components/Tooltip/index";
import constants from "../../json/constants.json";
import Header from "../../components/header";
import store from "../../redux/store";
import AHUFiltration, {
  ahupayload,
  validateAhuConstruction,
} from "./ahuFiltration";

type StandardItem = {
  id: number;
  title: string;
  classifications: {
    name: string;
    minAir: number | null;
    maxAir: number | null;
  }[];
};
type StandardJson = { standards: StandardItem[]; text: any };

export type CalculatedZoneResults = {
  flowVelocity?: number;
  heatingFlowVelocity?: number;
  coolingFlowVelocity?: number;
  totalFiltrationStages?: number;
  staticPressure?: number;
  pipeConfiguration?: string;
};

const data = standardDataJson as unknown as StandardJson;
const standardsData = data.standards;
const t = data.text;

function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}
function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}
function roundTo(n: number, decimals: number): number {
  const p = Math.pow(10, decimals);
  return Math.round(n * p) / p;
}
function isNumericLike(s: string): boolean {
  return /^-?\d*\.?\d*$/.test(s);
}
function isRealNumberString(s: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(s);
}
const temperature_range = { min: -30, max: 60 };
function validateTemperature(value: string): string {
  if (!value) return "";
  const num = Number(value);
  if (Number.isNaN(num)) return "Temperature must be a number";
  if (num < temperature_range.min || num > temperature_range.max)
    return "Temperature must be between -30°C and 60°C";
  return "";
}
const humidity_range = { min: 0, max: 100 };
function allowNumericInput(
  setter: (v: string) => void,
  value: string,
  range = humidity_range
) {
  if (value === "" || isNumericLike(value)) setter(value);
  if (!/^[\d*\.?\d*]{0,3}$/.test(value)) return;
  const num = Number(value);
  if (Number.isNaN(num)) return;
  if (num < range.min || num > range.max) return;
  setter(value);
}
function validateHumidity(value: string): string {
  if (!value) return "";
  const num = Number(value);
  if (Number.isNaN(num)) return "Humidity must be a number";
  if (num < 0 || num > 100) return "Humidity must be between 0 and 100";
  return "";
}

export default function Standard() {
  const s = standardDesign;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const projectIdFromRedux = useAppSelector(
    (state: any) => state.projectInfo.projectId
  );
  const projectId = location.state?.projectId ?? projectIdFromRedux;
  const user_id = useAppSelector((state: any) =>
    String(state.user?.user_id || state.user?.user_login_id)
  );

  const standards = useAppSelector((state: any) => state.standards);
  const {
    zoneId: zoneIdFromRedux,
    projectStandardId: projectStandardIdFromRedux,
    standard,
    classification,
    acph,
    system,
    systemType,
    heatingMethod,
    coolingMethod,
    tempUnit,
    reqInsideTempC,
    reqInsideTempDisplay,
    reqInsideHum,
    flowVelocity,
    heatingFlowVelocity,
    coolingFlowVelocity,
    additionalDpValue,
    filterTypeSelection,
    selectedFilters,
    totalFiltrationStages,
    staticPressure,
  } = standards;


const ahuPayload = ahupayload(standards);

  const minTempC = useAppSelector((state: any) => state.projectInfo.minTemp);
  const maxTempC = useAppSelector((state: any) => state.projectInfo.maxTemp);
  const rhMin = useAppSelector(
    (state: any) => state.projectInfo.relativeHumidityMin
  );
  const rhMax = useAppSelector(
    (state: any) => state.projectInfo.relativeHumidityMax
  );

  const [errors, setErrors] = useState({
    standard: "",
    classification: "",
    acph: "",
    system: "",
    systemType: "",
    heatingMethod: "",
    coolingMethod: "",
    humidity: "",
    temperature: "",
  });

  const [modalMessage, setModalMessage] = useState("");

  // ──when room.tsx passes resetKey via navigate state (addAnotherZone),
  useEffect(() => {
    if (!location.state?.resetKey) return;
    dispatch(resetStandards());
    // Wipe the nav state so a manual page refresh doesn't re-trigger this.
    window.history.replaceState({}, "");
  }, [location.state?.resetKey]);

  // ── DB pre-fill: only runs for the FIRST zone visit (when standard is empty
  useEffect(() => {
    if (!projectId) return;
    // Skip DB pre-fill if this is a fresh "add another zone" navigation
    if (location.state?.resetKey) return;
    // Skip if already populated from a previous visit
    if (standard) return;
    // Skip if zoneId is set (means we already created a zone for this session)
    if (zoneIdFromRedux) return;

    const fetchStandards = async () => {
      try {
        const data = await getRoomStandards(projectId);
        const std = data.standards?.[0];
        if (std) {
          dispatch(
            updateMultipleStandardsFields({
              system: std.project_system || "",
              systemType: std.project_system_type || "",
              heatingMethod: std.project_heating_method || "",
              coolingMethod: std.project_cooling_method || "",
              standard: std.project_standard || "",
              classification: std.project_classification_name || "",
              acph: std.project_ACPH ? String(std.project_ACPH) : "",
              tempUnit: std.project_temp_unit || "C",
              reqInsideTempC: std.project_required_inside_temp
                ? String(std.project_required_inside_temp)
                : "",
              reqInsideTempDisplay: std.project_required_inside_temp
                ? String(std.project_required_inside_temp)
                : "",
              reqInsideHum: std.project_required_inside_humid
                ? String(std.project_required_inside_humid)
                : "",
              flowVelocity: std.flow_velocity || 1.5,
              pipeConfiguration: std.pipe_configuration || "",
              totalFiltrationStages: std.total_filtration_stages || 0,
              staticPressure: std.static_pressure || 0,
              heatingFlowVelocity: std.heating_flow_velocity || 1.5,
              coolingFlowVelocity: std.cooling_flow_velocity || 1.5,
            })
          );
        }
      } catch (error) {
        console.error("Failed to fetch room standards:", error);
      }
    };
    fetchStandards();
  }, [projectId, zoneIdFromRedux, location.state?.resetKey]);

  const selectedStandard = standardsData.find((x) => x.title === standard);
  const SPECIAL_STANDARDS = ["NC-Non Classified", "ISO 14698", "SCHEDULE M"];

  const isNonClassifiedSystem = useMemo(() => {
    if (!systemType) return false;
    return systemType.toLowerCase().includes("non-classified");
  }, [systemType]);

  const filteredStandardsData = useMemo(() => {
    if (systemType !== "" && !isNonClassifiedSystem)
      return standardsData.filter(
        (item) => !SPECIAL_STANDARDS.includes(item.title)
      );
    return standardsData;
  }, [systemType, isNonClassifiedSystem]);

  const classList = useMemo(() => {
    if (!selectedStandard) return [];
    if (SPECIAL_STANDARDS.includes(selectedStandard.title)) {
      return selectedStandard.classifications || [];
    }
    return (selectedStandard.classifications || []).filter((c) => {
      const name = c.name || "";
      const isNCClass =
        name.toLowerCase().includes("non classified") ||
        name.toLowerCase().includes("non-classified");
      return isNonClassifiedSystem ? isNCClass : !isNCClass;
    });
  }, [selectedStandard, isNonClassifiedSystem]);

  const selectedClass = classList.find((c) => c.name === classification);

  const acphOptions = useMemo(() => {
    const out: number[] = [];
    if (selectedClass?.minAir != null && selectedClass?.maxAir != null) {
      for (let v = selectedClass.minAir; v <= selectedClass.maxAir; v++)
        out.push(v);
    }
    return out;
  }, [selectedClass]);

  const acphDisabled =
    !selectedClass ||
    selectedClass.minAir == null ||
    selectedClass.maxAir == null;

  useEffect(() => {
    if (!selectedClass) {
      dispatch(updateStandardsField({ field: "acph", value: "" }));
      return;
    }
    if (selectedClass.minAir == null || selectedClass.maxAir == null) {
      dispatch(updateStandardsField({ field: "acph", value: "" }));
      return;
    }
    const min = selectedClass.minAir;
    const max = selectedClass.maxAir;
    const current = Number(acph);
    const isCurrentValid =
      acph !== "" && !Number.isNaN(current) && current >= min && current <= max;
    if (!isCurrentValid)
      dispatch(updateStandardsField({ field: "acph", value: String(max) }));
  }, [classification, selectedClass, acph, dispatch]);

  const isHeating =
    system === t.options.systems.heating ||
    system === t.options.systems.heatingVentilation ||
    system === t.options.systems.heatingCooling;
  const isCooling =
    system === t.options.systems.cooling ||
    system === t.options.systems.coolingVentilation ||
    system === t.options.systems.heatingCooling;
  const isVentilation =
    system === t.options.systems.ventilation ||
    system === t.options.systems.coolingVentilation ||
    system === t.options.systems.heatingVentilation;
  const ventilationOnly =
    (isVentilation && !isHeating && !isCooling) ||
    systemType === t.options.systems.ventilation;
  const showHeatingMethod = isHeating && !ventilationOnly;
  const showCoolingMethod = isCooling && !ventilationOnly;
  const isHeatingCooling = system === t.options.systems.heatingCooling;
  const isCoolingVent = system === t.options.systems.coolingVentilation;
  const isHeatingVent = system === t.options.systems.heatingVentilation;

  const systemTypeLabel = isHeatingCooling
    ? t.labels.systemTypeGeneric
    : isHeatingVent
    ? t.labels.systemTypeHeating
    : isCoolingVent
    ? t.labels.systemTypeCooling
    : isHeating
    ? t.labels.systemTypeHeating
    : isCooling
    ? t.labels.systemTypeCooling
    : t.labels.systemTypeVentilation;

  const systemTypePlaceholder = isHeatingCooling
    ? t.placeholders.systemTypeGeneric
    : isHeatingVent
    ? t.placeholders.systemTypeHeating
    : isCoolingVent
    ? t.placeholders.systemTypeCooling
    : isHeating
    ? t.placeholders.systemTypeHeating
    : isCooling
    ? t.placeholders.systemTypeCooling
    : t.placeholders.systemTypeVentilation;

  const systemTypes = useMemo(() => {
    if (!system) return [];
    if (isHeatingCooling) return t.options.systemTypes.combined || [];
    if (isHeatingVent) return t.options.systemTypes.heatingVent || [];
    if (isCoolingVent) return t.options.systemTypes.coolingVent || [];
    if (system === t.options.systems.heating)
      return t.options.systemTypes.heating || [];
    if (system === t.options.systems.cooling)
      return t.options.systemTypes.cooling || [];
    if (system === t.options.systems.ventilation)
      return t.options.systemTypes.ventilation || [];
    if (isHeating) return t.options.systemTypes.heating || [];
    if (isCooling) return t.options.systemTypes.cooling || [];
    if (isVentilation) return t.options.systemTypes.ventilation || [];
    return [];
  }, [
    system,
    isHeatingCooling,
    isHeatingVent,
    isCoolingVent,
    isHeating,
    isCooling,
    isVentilation,
  ]);

  const heatingMethods: string[] = t.options.methods.heating || [];
  const coolingMethods: string[] = t.options.methods.cooling || [];

  useEffect(() => {
    if (ventilationOnly) {
      dispatch(
        updateMultipleStandardsFields({
          heatingMethod: "",
          coolingMethod: "",
          reqInsideTempC: t.misc.ambient,
          reqInsideTempDisplay: t.misc.ambient,
          reqInsideHum: t.misc.ambient,
        })
      );
    } else {
      if (reqInsideTempC === t.misc.ambient)
        dispatch(updateStandardsField({ field: "reqInsideTempC", value: "" }));
      if (reqInsideTempDisplay === t.misc.ambient)
        dispatch(
          updateStandardsField({ field: "reqInsideTempDisplay", value: "" })
        );
      if (reqInsideHum === t.misc.ambient)
        dispatch(updateStandardsField({ field: "reqInsideHum", value: "" }));
    }
  }, [system, systemType, ventilationOnly]);

  const tempToDisplay = (cStr: string): string => {
    if (!cStr) return "";
    if (!isRealNumberString(cStr)) return cStr;
    const c = parseFloat(cStr);
    if (Number.isNaN(c)) return cStr;
    return tempUnit === "C"
      ? String(roundTo(c, 2))
      : String(roundTo(celsiusToFahrenheit(c), 2));
  };

  useEffect(() => {
    if (ventilationOnly) return;
    if (!reqInsideTempC) {
      dispatch(
        updateStandardsField({ field: "reqInsideTempDisplay", value: "" })
      );
      return;
    }
    if (reqInsideTempC === t.misc.ambient) {
      dispatch(
        updateStandardsField({
          field: "reqInsideTempDisplay",
          value: t.misc.ambient,
        })
      );
      return;
    }
    if (!isRealNumberString(reqInsideTempC)) {
      dispatch(
        updateStandardsField({
          field: "reqInsideTempDisplay",
          value: reqInsideTempC,
        })
      );
      return;
    }
    const c = parseFloat(reqInsideTempC);
    const display =
      tempUnit === "C"
        ? String(roundTo(c, 2))
        : String(roundTo(celsiusToFahrenheit(c), 2));
    dispatch(
      updateStandardsField({ field: "reqInsideTempDisplay", value: display })
    );
  }, [tempUnit, reqInsideTempC, ventilationOnly]);

  const onReqInsideTempChange = (val: string) => {
    if (ventilationOnly) return;
    if (val === "") {
      dispatch(
        updateMultipleStandardsFields({
          reqInsideTempDisplay: "",
          reqInsideTempC: "",
        })
      );
      return;
    }
    if (!isNumericLike(val)) return;
    dispatch(
      updateStandardsField({ field: "reqInsideTempDisplay", value: val })
    );
    if (!isRealNumberString(val)) return;
    const n = parseFloat(val);
    if (Number.isNaN(n)) return;
    if (tempUnit === "C")
      dispatch(
        updateStandardsField({
          field: "reqInsideTempC",
          value: String(roundTo(n, 2)),
        })
      );
    else
      dispatch(
        updateStandardsField({
          field: "reqInsideTempC",
          value: String(roundTo(fahrenheitToCelsius(n), 4)),
        })
      );
  };

  const tempPlaceholder =
    tempUnit === "C" ? t.placeholders.reqTempC : t.placeholders.reqTempF;

  const roomPayload = useMemo(() => {
    const isVentilationOnly = system === t.options.systems.ventilation;
    return {
      fromCustomerInfo: {
        minimumTemp: minTempC,
        maximumTemp: maxTempC,
        minRelativeHumidity: rhMin,
        maxRelativeHumidity: rhMax,
      },
      standard,
      classification,
      acph,
      acphMin: selectedClass?.minAir ?? null,
      acphMax: selectedClass?.maxAir ?? null,
      system,
      systemType,
      heatingMethod,
      coolingMethod,
      tempUnit,
      reqInsideTemp: reqInsideTempDisplay,
      reqInsideHum,
      reqInsideTempC,
      maxTempC,
      minTemp: tempToDisplay(minTempC),
      maxTemp: tempToDisplay(maxTempC),
      minTempC,
      rhMin,
      rhMax,
      ventilationOnly: isVentilationOnly,
      ...ahuPayload,
    };
  }, [
    system,
    minTempC,
    maxTempC,
    rhMin,
    rhMax,
    standard,
    classification,
    acph,
    selectedClass,
    systemType,
    heatingMethod,
    coolingMethod,
    tempUnit,
    reqInsideTempDisplay,
    reqInsideHum,
    reqInsideTempC,
    ahuPayload,
  ]);

  const isFormValid = (() => {
    if (!standard || (errors as any).standard) return false;
    if (!classification || (errors as any).classification) return false;
    if (!acph || (errors as any).acph) return false;
    if (!system || (errors as any).system) return false;
    if (!systemType || (errors as any).systemType) return false;
    if (!ventilationOnly) {
      if (!heatingMethod && showHeatingMethod) return false;
      if (!coolingMethod && showCoolingMethod) return false;
      if (!reqInsideHum || (errors as any).humidity) return false;
      if (!reqInsideTempC || (errors as any).temperature) return false;
    }
    if (additionalDpValue === "") return false;
    return true;
  })();

  const getFreshProjectId = () =>
    location.state?.projectId ??
    projectIdFromRedux ??
    (store.getState() as any).projectInfo?.projectId;

  const createProjectZones = async () => {
    const freshProjectId = getFreshProjectId();
    if (!freshProjectId) {
      alert(
        "Project ID is missing. Please go back to Project Info and try again."
      );
      throw new Error("Missing project_id for zone creation");
    }
    const data = await createProjectZone({
      project_id: freshProjectId,
      user_id,
    });
    console.log("Zone created:", data);
    return data;
  };

  const handleNext = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!isFormValid) {
      setModalMessage(
        "Please fill all required fields correctly before proceeding."
      );
      return;
    }
    const ahuError = validateAhuConstruction(standards);
    if (ahuError) {
      setModalMessage(ahuError);
      return;
    }
    const types = Array.isArray(filterTypeSelection)
      ? filterTypeSelection
      : [filterTypeSelection].filter(Boolean);
    if (types.length === 0) {
      setModalMessage(
        "Please select a Filter Type (Supply or Exhaust) before proceeding."
      );
      return;
    }
    if (!selectedFilters || totalFiltrationStages === 0) {
      setModalMessage("Please select at least one filter before proceeding.");
      return;
    }

    try {
      let finalZoneId = zoneIdFromRedux;
      let finalProjectStandardId = projectStandardIdFromRedux;

      if (!finalZoneId) {
        const zoneData = await createProjectZones();
        finalZoneId = zoneData?.zoneId;
        if (!finalZoneId) {
          setModalMessage("Failed to create zone. Please try again.");
          return;
        }
        dispatch(updateStandardsField({ field: "zoneId", value: finalZoneId }));
        console.log("Zone created, ID:", finalZoneId);
      }

      const freshProjectId = getFreshProjectId();
      const payload = {
        project_id: freshProjectId,
        user_id,
        system,
        systemType,
        heatingMethod,
        coolingMethod,
        standard,
        classification,
        acph,
        tempUnit,
        reqInsideTempC,
        reqInsideHum,
        maxTempC,
        minTempC,
        rhMin,
        rhMax,
        ...ahuPayload,
        totalFiltrationStages,
        staticPressure,
        flowVelocity,
        heatingFlowVelocity,
        coolingFlowVelocity,
      };

      if (finalProjectStandardId) {
        await updateRoomStandards(finalProjectStandardId, payload);
        console.log("Room standards updated:", finalProjectStandardId);
        dispatch(
          updateInProgressProject({
            project_id: freshProjectId,
            has_standard: true,
            last_modified: new Date().toISOString(),
          })
        );
        toast.success("Details updated successfully!", {
          onClose: () =>
            navigate("/room", {
              state: {
                ...roomPayload,
                zoneId: finalZoneId,
                projectStandardId: finalProjectStandardId,
                totalFiltrationStages,
                staticPressure,
              },
            }),
          autoClose: 1500,
        });
      } else {
        const standardData = await roomStandards(payload);
        finalProjectStandardId = standardData?.roomStandardsId;
        if (!finalProjectStandardId) {
          setModalMessage("Failed to save project standard. Please try again.");
          return;
        }
        dispatch(
          updateStandardsField({
            field: "projectStandardId",
            value: finalProjectStandardId,
          })
        );
        dispatch(
          updateInProgressProject({
            project_id: freshProjectId,
            has_standard: true,
            last_modified: new Date().toISOString(),
          })
        );
        console.log("Standard created, ID:", finalProjectStandardId);
        toast.success("Details saved successfully!", {
          onClose: () =>
            navigate("/room", {
              state: {
                ...roomPayload,
                zoneId: finalZoneId,
                projectStandardId: finalProjectStandardId,
                totalFiltrationStages,
                staticPressure,
              },
            }),
          autoClose: 1500,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error in handleNext:", error);
    }
  };

  return (
    <>
      <Header />
      <div className={s.page}>
        <div className={s.top}>
          <h1 className={s.title}>{t.page.title}</h1>
          <p className={s.subtitle}>{t.page.subtitle}</p>
        </div>

        <div className={s.cardWrap + " space-y-8"}>
          {/* Card 1: Standards and Classification */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <div className={s.cardHeaderTitle}>{t.page.cardTitle}</div>
            </div>
            <div className={s.divider} />
            <div className={s.body}>
              <div className={s.grid2}>
                <div className={s.field}>
                  <label className={s.label}>
                    {t.labels.system} <span className={s.required}>*</span>
                    <Tooltip
                      id="system"
                      content={constants.Tooltip.systemTooltip}
                    />
                  </label>
                  <select
                    className={s.select}
                    value={system}
                    onChange={(e) => {
                      dispatch(
                        updateStandardsField({
                          field: "system",
                          value: e.target.value,
                        })
                      );
                      dispatch(
                        updateStandardsField({ field: "systemType", value: "" })
                      );
                    }}
                    required
                  >
                    <option value="">{t.placeholders.system}</option>
                    <option value={t.options.systems.heating}>
                      {t.options.systems.heating}
                    </option>
                    <option value={t.options.systems.cooling}>
                      {t.options.systems.cooling}
                    </option>
                    <option value={t.options.systems.ventilation}>
                      {t.options.systems.ventilation}
                    </option>
                    <option value={t.options.systems.coolingVentilation}>
                      {t.options.systems.coolingVentilation}
                    </option>
                    <option value={t.options.systems.heatingVentilation}>
                      {t.options.systems.heatingVentilation}
                    </option>
                    <option value={t.options.systems.heatingCooling}>
                      {t.options.systems.heatingCooling}
                    </option>
                  </select>
                </div>
                {system !== "" && (
                  <div className={s.field}>
                    <label className={s.label}>
                      {systemTypeLabel} <span className={s.required}>*</span>
                      <Tooltip
                        id="systemType"
                        content={
                          systemTypeLabel === t.labels.systemTypeGeneric
                            ? constants.Tooltip.heatingSystemTypeTooltip
                            : systemTypeLabel === t.labels.systemTypeHeating
                            ? constants.Tooltip.heatingSystemTypeTooltip
                            : systemTypeLabel === t.labels.systemTypeCooling
                            ? constants.Tooltip.coolingSystemTypeTooltip
                            : constants.Tooltip.ventilationSystemTypeTooltip
                        }
                      />
                    </label>
                    <select
                      className={s.select}
                      value={systemType}
                      onChange={(e) => {
                        dispatch(
                          updateStandardsField({
                            field: "systemType",
                            value: e.target.value,
                          })
                        );
                        dispatch(
                          updateStandardsField({
                            field: "classification",
                            value: "",
                          })
                        );
                        dispatch(
                          updateStandardsField({ field: "acph", value: "" })
                        );
                      }}
                      required
                    >
                      <option value="">{systemTypePlaceholder}</option>
                      {systemTypes.map((v: string) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {(showHeatingMethod || showCoolingMethod) && (
                <div className={"mt-6 " + s.grid2}>
                  {showHeatingMethod && (
                    <div className={s.field}>
                      <label className={s.label}>
                        {t.labels.heatingMethod}{" "}
                        <span className={s.required}>*</span>
                        <Tooltip
                          id="heatingMethod"
                          content={constants.Tooltip.heatingMethodTooltip}
                        />
                      </label>
                      <select
                        className={s.select}
                        value={heatingMethod}
                        onChange={(e) =>
                          dispatch(
                            updateStandardsField({
                              field: "heatingMethod",
                              value: e.target.value,
                            })
                          )
                        }
                        required
                      >
                        <option value="">{t.placeholders.heatingMethod}</option>
                        {heatingMethods.map((m: string) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {showCoolingMethod && (
                    <div className={s.field}>
                      <label className={s.label}>
                        {t.labels.coolingMethod}{" "}
                        <span className={s.required}>*</span>
                        <Tooltip
                          id="coolingMethod"
                          content={constants.Tooltip.coolingMethodTooltip}
                        />
                      </label>
                      <select
                        className={s.select}
                        value={coolingMethod}
                        onChange={(e) =>
                          dispatch(
                            updateStandardsField({
                              field: "coolingMethod",
                              value: e.target.value,
                            })
                          )
                        }
                        required
                      >
                        <option value="">{t.placeholders.coolingMethod}</option>
                        {coolingMethods.map((m: string) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className={s.sectionSpacer}>
                <div className={s.grid3}>
                  <div className={s.field}>
                    <label className={s.label}>
                      {t.labels.standard} <span className={s.required}>*</span>
                      <Tooltip
                        id="standard"
                        content={constants.Tooltip.standardTooltip}
                      />
                    </label>
                    <select
                      className={s.select}
                      value={standard}
                      onChange={(e) => {
                        dispatch(
                          updateStandardsField({
                            field: "standard",
                            value: e.target.value,
                          })
                        );
                        dispatch(
                          updateStandardsField({
                            field: "classification",
                            value: "",
                          })
                        );
                        dispatch(
                          updateStandardsField({ field: "acph", value: "" })
                        );
                      }}
                      required
                    >
                      <option value="">{t.placeholders.standard}</option>
                      {filteredStandardsData.map((item) => (
                        <option key={item.id} value={item.title}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>
                      {t.labels.classification}{" "}
                      <span className={s.required}>*</span>
                      <Tooltip
                        id="classification"
                        content={constants.Tooltip.classificationTooltip}
                      />
                    </label>
                    <select
                      className={selectedStandard ? s.select : s.selectDisabled}
                      disabled={!selectedStandard}
                      value={classification}
                      onChange={(e) =>
                        dispatch(
                          updateStandardsField({
                            field: "classification",
                            value: e.target.value,
                          })
                        )
                      }
                      required
                    >
                      <option value="">
                        {selectedStandard
                          ? t.placeholders.classification
                          : t.placeholders.classificationDisabled}
                      </option>
                      {classList.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>
                      {t.labels.acph} <span className={s.required}>*</span>
                      <Tooltip
                        id="acph"
                        content={constants.Tooltip.acphTooltip}
                      />
                    </label>
                    <select
                      className={!acphDisabled ? s.select : s.selectDisabled}
                      disabled={acphDisabled}
                      value={acph}
                      onChange={(e) =>
                        dispatch(
                          updateStandardsField({
                            field: "acph",
                            value: e.target.value,
                          })
                        )
                      }
                      required
                    >
                      {acphDisabled ? (
                        <option value="">{t.placeholders.acphDisabled}</option>
                      ) : (
                        acphOptions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))
                      )}
                    </select>
                    {selectedClass?.minAir != null &&
                      selectedClass?.maxAir != null && (
                        <div className={s.range}>
                          {t.misc.rangeLabel}{" "}
                          <span className={s.rangeValue}>
                            {selectedClass.minAir} - {selectedClass.maxAir}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Temperature and Humidity */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <div className={s.cardHeaderTitle}>{t.sections.tempHumTitle}</div>
            </div>
            <div className={s.divider} />
            <div className={s.body}>
              <div className={s.unitRow}>
                <div className={s.unitLabel}>{t.labels.tempUnit}</div>
                <div className={s.unitGroup}>
                  <label className={s.unitOption}>
                    <input
                      className={s.unitRadio}
                      type="radio"
                      name="tempUnit"
                      value="C"
                      checked={tempUnit === "C"}
                      onChange={() =>
                        dispatch(
                          updateStandardsField({
                            field: "tempUnit",
                            value: "C",
                          })
                        )
                      }
                      disabled={ventilationOnly}
                    />
                    <span>{t.options.units.c}</span>
                  </label>
                  <label className={s.unitOption}>
                    <input
                      className={s.unitRadio}
                      type="radio"
                      name="tempUnit"
                      value="F"
                      checked={tempUnit === "F"}
                      onChange={() =>
                        dispatch(
                          updateStandardsField({
                            field: "tempUnit",
                            value: "F",
                          })
                        )
                      }
                      disabled={ventilationOnly}
                    />
                    <span>{t.options.units.f}</span>
                  </label>
                </div>
                {ventilationOnly && (
                  <div className={s.unitHint}>{t.misc.ventilationUnitHint}</div>
                )}
              </div>

              <div className={"mt-6 " + s.grid2}>
                <div className={s.field}>
                  <label className={s.label}>
                    {t.labels.reqInsideTemp} ({tempUnit === "C" ? "°C" : "°F"}){" "}
                    <span className={s.required}>*</span>
                    <Tooltip
                      id="requiredTemperature"
                      content={constants.Tooltip.requiredTemperatureTooltip}
                    />
                  </label>
                  <input
                    className={ventilationOnly ? s.inputDisabled : s.input}
                    inputMode="decimal"
                    placeholder={tempPlaceholder}
                    value={reqInsideTempDisplay || ""}
                    maxLength={3}
                    required
                    onChange={(e) => {
                      onReqInsideTempChange(e.target.value);
                      setErrors((p) => ({
                        ...p,
                        temperature: validateTemperature(e.target.value),
                      }));
                    }}
                    disabled={ventilationOnly}
                  />
                  {errors.temperature && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.temperature}
                    </div>
                  )}
                  {!ventilationOnly &&
                    reqInsideTempC &&
                    reqInsideTempC !== t.misc.ambient && (
                      <div className={s.tempHelper}>
                        {t.misc.storedInternally} <b>{reqInsideTempC} °C</b>
                      </div>
                    )}
                </div>
                <div className={s.field}>
                  <label className={s.label}>
                    {t.labels.reqInsideHum}{" "}
                    <span className={s.required}>*</span>
                    <Tooltip
                      id="requiredHumidity"
                      content={constants.Tooltip.requiredHumidityTooltip}
                    />
                  </label>
                  <input
                    className={ventilationOnly ? s.inputDisabled : s.input}
                    inputMode="decimal"
                    placeholder={t.placeholders.reqHumidity}
                    maxLength={3}
                    value={reqInsideHum || ""}
                    required
                    onChange={(e) => {
                      allowNumericInput(
                        (v) =>
                          dispatch(
                            updateStandardsField({
                              field: "reqInsideHum",
                              value: v,
                            })
                          ),
                        e.target.value
                      );
                      setErrors((p) => ({
                        ...p,
                        humidity: validateHumidity(e.target.value),
                      }));
                    }}
                    disabled={ventilationOnly}
                  />
                  {errors.humidity && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.humidity}
                    </div>
                  )}
                </div>
              </div>

              <div className={"mt-6 " + s.grid4}>
                <div className={s.field}>
                  <label className={s.label}>
                    {t.labels.minTemp} ({tempUnit === "C" ? "°C" : "°F"})
                  </label>
                  <input
                    className={s.inputDisabled}
                    value={tempToDisplay(minTempC) || "-"}
                    disabled
                  />
                </div>
                <div className={s.field}>
                  <label className={s.label}>
                    {t.labels.maxTemp} ({tempUnit === "C" ? "°C" : "°F"})
                  </label>
                  <input
                    className={s.inputDisabled}
                    value={tempToDisplay(maxTempC) || "-"}
                    disabled
                  />
                </div>
                <div className={s.field}>
                  <label className={s.label}>{t.labels.rhMin}</label>
                  <input
                    className={s.inputDisabled}
                    value={rhMin || "-"}
                    disabled
                  />
                </div>
                <div className={s.field}>
                  <label className={s.label}>{t.labels.rhMax}</label>
                  <input
                    className={s.inputDisabled}
                    value={rhMax || "-"}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <AHUFiltration />
        </div>

        <div className={s.quickView}>
          Standard: <b>{standard || "-"}</b> | Classification:{" "}
          <b>{classification || "-"}</b> | ACPH: <b>{acph || "-"}</b>
        </div>

        <div className={s.footer}>
          <Link to="/project-info" className={s.backLink}>
            <FaArrowLeft /> {t.buttons.back}
          </Link>
          <button
            type="button"
            className={`${s.nextLink} ${!isFormValid ? s.disabled : ""}`}
            onClick={handleNext}
          >
            {t.buttons.next} <FaArrowRight />
          </button>
        </div>
      </div>

      {modalMessage && (
        <div className={s.modalOverlay}>
          <div className={s.modalContent}>
            <div className={s.modalBody}>{modalMessage}</div>
            <div className={s.flexEnd}>
              <button
                className={s.modalButton}
                onClick={() => setModalMessage("")}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}