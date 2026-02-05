import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import standardDesign from "./standardDesign";
import standardDataJson from "../../json/standardData.json";

type StandardItem = {
  id: number;
  title: string;
  classifications: {
    name: string;
    minAir: number | null;
    maxAir: number | null;
  }[];
};

type StandardJson = {
  standards: StandardItem[];
  text: any;
};

const data = standardDataJson as unknown as StandardJson;
const standardsData = data.standards;
const t = data.text;

type SystemName =
  | ""
  | "Air-Heating System"
  | "Air-Cooling System"
  | "Ventilation System"
  | "Air Cooling and Ventilation System"
  | "Air Heating and Ventilation System"
  | "Air Cooling and Air Heating System";

type CustomerInfoState = {
  minimumTemp?: string;
  maximumTemp?: string;
  minRelativeHumidity?: string;
  maxRelativeHumidity?: string;
};

type TempUnit = "C" | "F";
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

/* ---------- Flow velocity helpers ---------- */
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
function isSteamMedium(m: string) {
  return String(m || "")
    .toLowerCase()
    .includes("steam");
}
function getFlowVelocityRange(medium: string) {
  return isSteamMedium(medium) ? { min: 3, max: 25 } : { min: 0.5, max: 2.5 };
}
function formatMediumLabel(medium: string) {
  return medium ? medium : "Select Method";
}

export default function Standard() {
  const s = standardDesign;

  const location = useLocation();
  const prev = (location.state || {}) as CustomerInfoState;

  const [standard, setStandard] = useState("");
  const [classification, setClassification] = useState("");
  const [acph, setAcph] = useState("");

  const [system, setSystem] = useState<SystemName>("");
  const [systemType, setSystemType] = useState("");
  const [heatingMethod, setHeatingMethod] = useState("");
  const [coolingMethod, setCoolingMethod] = useState("");

  const [tempUnit, setTempUnit] = useState<TempUnit>("C");
  const [reqInsideTempC, setReqInsideTempC] = useState("");
  const [reqInsideTempDisplay, setReqInsideTempDisplay] = useState("");
  const [reqInsideHum, setReqInsideHum] = useState("");

  const [minTempC, setMinTempC] = useState("");
  const [maxTempC, setMaxTempC] = useState("");
  const [rhMin, setRhMin] = useState("");
  const [rhMax, setRhMax] = useState("");

  /* ---------- Flow Velocity state ---------- */
  const [flowVelocity, setFlowVelocity] = useState<number>(1.5);
  const [heatingFlowVelocity, setHeatingFlowVelocity] = useState<number>(1.5);
  const [coolingFlowVelocity, setCoolingFlowVelocity] = useState<number>(1.5);

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

  const isFormValid = (() => {
    if (!standard || errors.standard) return false;
    if (!classification || errors.classification) return false;
    if (!acph || errors.acph) return false;
    if (!system || errors.system) return false;
    if (!systemType || errors.systemType) return false;
    if (!heatingMethod || errors.heatingMethod) return false;
    if (!coolingMethod || errors.coolingMethod) return false;
    if (reqInsideHum && errors.humidity) return false;
    if (reqInsideTempC && errors.temperature) return false;
    if (!reqInsideHum || errors.humidity) return false;
    if (!reqInsideTempC || errors.temperature) return false;
    // if(!systemType) return false;
    // if(!heatingMethod) return false;
    // if(!coolingMethod) return false;
    return true;
  })();

  const selectedStandard = standardsData.find((x) => x.title === standard);

  // 1. Define the standards that should bypass filtering
  const SPECIAL_STANDARDS = ["NC-Non Classified", "ISO 14698", "SCHEDULE M"];

  const isNonClassifiedSystem = useMemo(() => {
    return systemType.toLowerCase().includes("non-classified");
  }, [systemType]);

  // 2. Filter standards (Keeping your existing logic here)
  const filteredStandardsData = useMemo(() => {
    if (systemType !== "" && !isNonClassifiedSystem) {
      return standardsData.filter(
        (item) => !SPECIAL_STANDARDS.includes(item.title)
      );
    }
    return standardsData;
  }, [systemType, isNonClassifiedSystem, standardsData]);

  // 3. Filter Classifications
  const classList = useMemo(() => {
    if (!selectedStandard) return [];

    // FIX: If the selected standard is one of the special ones, show all classes
    if (SPECIAL_STANDARDS.includes(selectedStandard.title)) {
      return selectedStandard.classifications;
    }

    // Otherwise, apply the existing Non-Classified filtering logic
    return selectedStandard.classifications.filter((c) => {
      const isNCClass =
        c.name.toLowerCase().includes("non classified") ||
        c.name.toLowerCase().includes("non-classified");

      return isNonClassifiedSystem ? isNCClass : !isNCClass;
    });
  }, [selectedStandard, isNonClassifiedSystem]);

  // 4. ACPH Calculation (Remains largely the same, ensuring it maps to the UI)
  const selectedClass = classList.find((c) => c.name === classification);

  const acphOptions = useMemo(() => {
    const out = [];
    if (selectedClass?.minAir != null && selectedClass?.maxAir != null) {
      // Generates a range from min to max (e.g., 20 to 30)
      for (let v = selectedClass.minAir; v <= selectedClass.maxAir; v++) {
        out.push(v);
      }
    }
    return out;
  }, [selectedClass]);

  const acphDisabled =
    !selectedClass ||
    selectedClass.minAir == null ||
    selectedClass.maxAir == null;

  useEffect(() => {
    if (!selectedClass) {
      setAcph("");
      return;
    }
    if (selectedClass.maxAir != null) setAcph(String(selectedClass.maxAir));
    else setAcph("");
  }, [classification, selectedClass?.maxAir, selectedClass]);

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

  // Logic to treat specific sub-types as Ventilation only
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
    setMinTempC(typeof prev.minimumTemp === "string" ? prev.minimumTemp : "");
    setMaxTempC(typeof prev.maximumTemp === "string" ? prev.maximumTemp : "");
    setRhMin(
      typeof prev.minRelativeHumidity === "string"
        ? prev.minRelativeHumidity
        : ""
    );
    setRhMax(
      typeof prev.maxRelativeHumidity === "string"
        ? prev.maxRelativeHumidity
        : ""
    );
  }, [
    prev.minimumTemp,
    prev.maximumTemp,
    prev.minRelativeHumidity,
    prev.maxRelativeHumidity,
  ]);

  useEffect(() => {
    // If we aren't changing the system itself, we don't necessarily want to wipe systemType,
    // but the original logic clears them on system change.
    // However, if ventilationOnly becomes true via systemType, we must clear methods and set Ambient.
    if (ventilationOnly) {
      setHeatingMethod("");
      setCoolingMethod("");
      setReqInsideTempC(t.misc.ambient);
      setReqInsideTempDisplay(t.misc.ambient);
      setReqInsideHum(t.misc.ambient);
    } else {
      if (reqInsideTempC === t.misc.ambient) setReqInsideTempC("");
      if (reqInsideTempDisplay === t.misc.ambient) setReqInsideTempDisplay("");
      if (reqInsideHum === t.misc.ambient) setReqInsideHum("");
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
      setReqInsideTempDisplay("");
      return;
    }
    if (reqInsideTempC === t.misc.ambient) {
      setReqInsideTempDisplay(t.misc.ambient);
      return;
    }
    if (!isRealNumberString(reqInsideTempC)) {
      setReqInsideTempDisplay(reqInsideTempC);
      return;
    }

    const c = parseFloat(reqInsideTempC);
    const display =
      tempUnit === "C"
        ? String(roundTo(c, 2))
        : String(roundTo(celsiusToFahrenheit(c), 2));
    setReqInsideTempDisplay(display);
  }, [tempUnit, reqInsideTempC, ventilationOnly]);

  const onReqInsideTempChange = (val: string) => {
    if (ventilationOnly) return;

    if (val === "") {
      setReqInsideTempDisplay("");
      setReqInsideTempC("");
      return;
    }
    if (!isNumericLike(val)) return;

    setReqInsideTempDisplay(val);
    if (!isRealNumberString(val)) return;

    const n = parseFloat(val);
    if (Number.isNaN(n)) return;

    if (tempUnit === "C") setReqInsideTempC(String(roundTo(n, 2)));
    else setReqInsideTempC(String(roundTo(fahrenheitToCelsius(n), 4)));
  };

  const tempPlaceholder =
    tempUnit === "C" ? t.placeholders.reqTempC : t.placeholders.reqTempF;

  const flowMedium = useMemo(() => {
    // Prefer cooling if visible
    if (showCoolingMethod && coolingMethod) return coolingMethod;
    if (showHeatingMethod && heatingMethod) return heatingMethod;
    // fallback
    if (showCoolingMethod) return coolingMethod;
    if (showHeatingMethod) return heatingMethod;
    return "";
  }, [showCoolingMethod, showHeatingMethod, coolingMethod, heatingMethod]);

  const flowRange = useMemo(
    () => getFlowVelocityRange(flowMedium),
    [flowMedium]
  );
  const heatingFlowRange = useMemo(
    () => getFlowVelocityRange(heatingMethod),
    [heatingMethod]
  );

  const coolingFlowRange = useMemo(
    () => getFlowVelocityRange(coolingMethod),
    [coolingMethod]
  );

  useEffect(() => {
    // keep current value within new range when method changes
    setFlowVelocity((v) => clamp(v, flowRange.min, flowRange.max));
  }, [flowRange.min, flowRange.max]);

  const roomPayload = useMemo(() => {
    const isVentilationOnly = system === t.options.systems.ventilation;

    return {
      fromCustomerInfo: prev,
      standard,
      classification,
      acph,
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
      flowVelocity,
      flowVelocityUnit: "m/s",
      flowMedium,
      heatingFlowVelocity,
      coolingFlowVelocity,
    };
  }, [
    prev,
    standard,
    classification,
    acph,
    system,
    systemType,
    heatingMethod,
    coolingMethod,
    tempUnit,
    reqInsideTempDisplay,
    reqInsideTempC,
    reqInsideHum,
    minTempC,
    maxTempC,
    rhMin,
    rhMax,
    flowVelocity,
    flowMedium,
    heatingFlowVelocity,
    coolingFlowVelocity,
  ]);

  useEffect(() => {
    console.group("STANDARD SCREEN - CURRENT STATE");
    console.log(roomPayload);
    console.groupEnd();
  }, [roomPayload]);

  return (
    <div className={s.page}>
      <div className={s.top}>
        <h1 className={s.title}>{t.page.title}</h1>
        <p className={s.subtitle}>{t.page.subtitle}</p>
      </div>

      <div className={s.cardWrap}>
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
                </label>
                <select
                  className={s.select}
                  value={system}
                  onChange={(e) => {
                    setSystem(e.target.value as SystemName);
                    setSystemType("");
                  }}
                  required={true}
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
                  </label>
                  <select
                    className={s.select}
                    value={systemType}
                    onChange={(e) => {
                      setSystemType(e.target.value);
                      setClassification("");
                      setAcph("");
                    }}
                    required={true}
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
                    </label>
                    <select
                      className={s.select}
                      value={heatingMethod}
                      onChange={(e) => setHeatingMethod(e.target.value)}
                      required={true}
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
                    </label>
                    <select
                      className={s.select}
                      value={coolingMethod}
                      onChange={(e) => setCoolingMethod(e.target.value)}
                      required={true}
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
                  </label>
                  <select
                    className={s.select}
                    value={standard}
                    onChange={(e) => {
                      setStandard(e.target.value);
                      setClassification("");
                      setAcph("");
                    }}
                    required={true}
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
                  </label>
                  <select
                    className={selectedStandard ? s.select : s.selectDisabled}
                    disabled={!selectedStandard}
                    value={classification}
                    onChange={(e) => setClassification(e.target.value)}
                    required={true}
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
                  </label>
                  <select
                    className={!acphDisabled ? s.select : s.selectDisabled}
                    disabled={acphDisabled}
                    value={acph}
                    onChange={(e) => setAcph(e.target.value)}
                    required={true}
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

            <div className={s.sectionLine} />

            <div className={s.sectionSpacer}>
              <div className={s.sectionTitle}>{t.sections.tempHumTitle}</div>

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
                      onChange={() => setTempUnit("C")}
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
                      onChange={() => setTempUnit("F")}
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
                  </label>
                  <input
                    className={ventilationOnly ? s.inputDisabled : s.input}
                    inputMode="decimal"
                    placeholder={tempPlaceholder}
                    value={reqInsideTempDisplay}
                    maxLength={3}
                    required={true}
                    onChange={(e) => {
                      const value = e.target.value;
                      onReqInsideTempChange(value);
                      setErrors((prevErr) => ({
                        ...prevErr,
                        temperature: validateTemperature(value),
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
                  </label>
                  <input
                    className={ventilationOnly ? s.inputDisabled : s.input}
                    inputMode="decimal"
                    placeholder={t.placeholders.reqHumidity}
                    maxLength={3}
                    value={reqInsideHum}
                    required={true}
                    onChange={(e) => {
                      allowNumericInput(setReqInsideHum, e.target.value);
                      setErrors((prevErr) => ({
                        ...prevErr,
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
              {/* ---------- Dual Flow Velocity for Heating + Cooling ---------- */}

              {!ventilationOnly &&
                system === t.options.systems.heatingCooling &&
                showHeatingMethod &&
                showCoolingMethod && (
                  <div className={s.dualFlowBlock}>
                    <div className={s.dualFlowGrid}>
                      {/* Heating Flow */}
                      <div className={s.dualFlowCard}>
                        <div className={s.dualFlowTitle}>
                          Heating Flow Velocity –{" "}
                          {formatMediumLabel(heatingMethod)}
                          <span className={s.required}>*</span>
                        </div>
                       
                        <div className={s.dualFlowRow}>
                          <div className={s.dualFlowMin}>
                            {heatingFlowRange.min}
                          </div>

                          <input
                            type="range"
                            className={s.dualFlowSlider}
                            min={heatingFlowRange.min}
                            max={heatingFlowRange.max}
                            step={0.1}
                            value={heatingFlowVelocity}
                            onChange={(e) =>
                              setHeatingFlowVelocity(
                                clamp(
                                  Number(e.target.value),
                                  heatingFlowRange.min,
                                  heatingFlowRange.max
                                )
                              )
                            }
                          />

                          <div className={s.dualFlowMax}>
                            {heatingFlowRange.max}
                          </div>
                          <input
                            className={s.dualFlowValueBox}
                           
                            value={heatingFlowVelocity}
                            required={true}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              if (!Number.isNaN(v)) {
                                setHeatingFlowVelocity(
                                  clamp(
                                    v,
                                    heatingFlowRange.min,
                                    heatingFlowRange.max
                                  )
                                );
                              }
                            }}
                           
                          />
                          

                          <div className={s.dualFlowUnit}>m/s</div>
                        </div>
                      </div>

                      {/* Cooling Flow */}
                      <div className={s.dualFlowCard}>
                        <div className={s.dualFlowTitle}>
                          Cooling Flow Velocity -{" "}
                          {formatMediumLabel(coolingMethod)}
                          <span className={s.required}>*</span>
                        </div>

                        <div className={s.dualFlowRow}>
                          <div className={s.dualFlowMin}>
                            {coolingFlowRange.min}
                          </div>

                          <input
                            type="range"
                            className={s.dualFlowSlider}
                            min={coolingFlowRange.min}
                            max={coolingFlowRange.max}
                            step={0.1}
                            value={coolingFlowVelocity}
                            onChange={(e) =>
                              setCoolingFlowVelocity(
                                clamp(
                                  Number(e.target.value),
                                  coolingFlowRange.min,
                                  coolingFlowRange.max
                                )
                              )
                            }
                          />

                          <div className={s.dualFlowMax}>
                            {coolingFlowRange.max}
                          </div>

                          {/* <input
                            className={s.dualFlowValueBox}
                            value={coolingFlowVelocity}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              if (!Number.isNaN(v)) {
                                setCoolingFlowVelocity(
                                  clamp(
                                    v,
                                    coolingFlowRange.min,
                                    coolingFlowRange.max
                                  )
                                );
                              }
                            }}
                          /> */}
                          <input
                            className={s.dualFlowValueBox}
                            inputMode="decimal"
                            value={String(coolingFlowVelocity)}
                            required={true}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (v === "" || isNumericLike(v)) {
                                const n = Number(v);
                                if (Number.isNaN(n)) return;
                                setCoolingFlowVelocity(
                                  clamp(
                                    n,
                                    coolingFlowRange.min,
                                    coolingFlowRange.max
                                  )
                                );
                              }
                            }}
                          />

                          <div className={s.dualFlowUnit}>m/s</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* ----------  Single Flow Velocity block ---------- */}
              {!ventilationOnly &&
                system !== t.options.systems.heatingCooling &&
                (showCoolingMethod || showHeatingMethod) && (
                  <div className={s.flowBlock}>
                    <div className={s.flowLabelRow}>
                      <div className={s.flowTitle}>
                        Flow Velocity - {formatMediumLabel(flowMedium)}
                        <span className={s.required}> *</span>
                      </div>
                      <div className={s.flowUnit}></div>
                    </div>

                    <div className={s.flowRow}>
                      <div className={s.flowMin}>{flowRange.min} m/s</div>

                      <input
                        className={s.flowSlider}
                        type="range"
                        min={flowRange.min}
                        max={flowRange.max}
                        step={0.1}
                        value={flowVelocity}
                        onChange={(e) =>
                          setFlowVelocity(Number(e.target.value))
                        }
                      />

                      <div className={s.flowMax}>{flowRange.max} m/s</div>

                      <div className={s.flowValueBoxWrap}>
                        <input
                          className={s.flowValueBox}
                          inputMode="decimal"
                          value={String(flowVelocity)}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === "" || isNumericLike(v)) {
                              const n = Number(v);
                              if (Number.isNaN(n)) return;
                              setFlowVelocity(
                                clamp(n, flowRange.min, flowRange.max)
                              );
                            }
                          }}
                        />
                      </div>

                      <div className={s.flowUnitSmall}>m/s</div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className={s.quickView}>
          Standard: <b>{standard || "-"}</b> | Classification:{" "}
          <b>{classification || "-"}</b> | ACPH: <b>{acph || "-"}</b>
        </div>
      </div>

      <div className={s.footer}>
        <Link to="/customer-info" className={s.backLink}>
          <FaArrowLeft /> {t.buttons.back}
        </Link>

        <Link
          to={isFormValid ? "/room" : "#"}
          className={`${s.nextLink} ${!isFormValid ? s.disabled : ""}`}
          state={roomPayload}
          onClick={(e) => {
            if (!isFormValid) {
              e.preventDefault();
              alert(
                "Please fill all required fields correctly before proceeding."
              );
            }
          }}
        >
          {t.buttons.next} <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}
