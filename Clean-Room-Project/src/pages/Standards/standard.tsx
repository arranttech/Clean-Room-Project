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

function allowNumericInput(setter: (v: string) => void, value: string) {
  if (value === "" || isNumericLike(value)) setter(value);
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

  const selectedStandard = standardsData.find((x) => x.title === standard);
  const classList = selectedStandard ? selectedStandard.classifications : [];
  const selectedClass = classList.find((c) => c.name === classification);

  const acphOptions = useMemo(() => {
    const out: number[] = [];
    if (selectedClass?.minAir != null && selectedClass?.maxAir != null) {
      for (let v = selectedClass.minAir; v <= selectedClass.maxAir; v++) out.push(v);
    }
    return out;
  }, [selectedClass]);

  const acphDisabled =
    !selectedClass || selectedClass.minAir == null || selectedClass.maxAir == null;

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

  const showHeatingMethod = isHeating;
  const showCoolingMethod = isCooling;

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
    if (isHeatingVent) return t.options.systemTypes.heating || [];
    if (isCoolingVent) return t.options.systemTypes.cooling || [];

    if (system === t.options.systems.heating) return t.options.systemTypes.heating || [];
    if (system === t.options.systems.cooling) return t.options.systemTypes.cooling || [];
    if (system === t.options.systems.ventilation) return t.options.systemTypes.ventilation || [];

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
  const ventilationOnly = isVentilation && !isHeating && !isCooling;

  useEffect(() => {
    setMinTempC(typeof prev.minimumTemp === "string" ? prev.minimumTemp : "");
    setMaxTempC(typeof prev.maximumTemp === "string" ? prev.maximumTemp : "");
    setRhMin(typeof prev.minRelativeHumidity === "string" ? prev.minRelativeHumidity : "");
    setRhMax(typeof prev.maxRelativeHumidity === "string" ? prev.maxRelativeHumidity : "");
  }, [prev.minimumTemp, prev.maximumTemp, prev.minRelativeHumidity, prev.maxRelativeHumidity]);

  useEffect(() => {
    setSystemType("");
    setHeatingMethod("");
    setCoolingMethod("");

    if (ventilationOnly) {
      setReqInsideTempC(t.misc.ambient);
      setReqInsideTempDisplay(t.misc.ambient);
      setReqInsideHum(t.misc.ambient);
    } else {
      if (reqInsideTempC === t.misc.ambient) setReqInsideTempC("");
      if (reqInsideTempDisplay === t.misc.ambient) setReqInsideTempDisplay("");
      if (reqInsideHum === t.misc.ambient) setReqInsideHum("");
    }
  }, [system, ventilationOnly]);

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
    else setReqInsideTempC(String(roundTo(fahrenheitToCelsius(n), 2)));
  };

  const tempPlaceholder = tempUnit === "C" ? t.placeholders.reqTempC : t.placeholders.reqTempF;

  const roomPayload = useMemo(() => {
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
            {/* Standard / Classification / ACPH */}
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
                >
                  <option value="">{t.placeholders.standard}</option>
                  {standardsData.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>
                  {t.labels.classification} <span className={s.required}>*</span>
                </label>
                <select
                  className={selectedStandard ? s.select : s.selectDisabled}
                  disabled={!selectedStandard}
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
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

                {selectedClass?.minAir != null && selectedClass?.maxAir != null && (
                  <div className={s.range}>
                    {t.misc.rangeLabel}{" "}
                    <span className={s.rangeValue}>
                      {selectedClass.minAir} - {selectedClass.maxAir}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* System */}
            <div className={s.sectionSpacer}>
              <div className={s.grid2}>
                <div className={s.field}>
                  <label className={s.label}>
                    {t.labels.system} <span className={s.required}>*</span>
                  </label>
                  <select
                    className={s.select}
                    value={system}
                    onChange={(e) => setSystem(e.target.value as SystemName)}
                  >
                    <option value="">{t.placeholders.system}</option>

                    <option value={t.options.systems.heating}>{t.options.systems.heating}</option>
                    <option value={t.options.systems.cooling}>{t.options.systems.cooling}</option>
                    <option value={t.options.systems.ventilation}>{t.options.systems.ventilation}</option>

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
                      onChange={(e) => setSystemType(e.target.value)}
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
                        {t.labels.heatingMethod} <span className={s.required}>*</span>
                      </label>
                      <select
                        className={s.select}
                        value={heatingMethod}
                        onChange={(e) => setHeatingMethod(e.target.value)}
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
                        {t.labels.coolingMethod} <span className={s.required}>*</span>
                      </label>
                      <select
                        className={s.select}
                        value={coolingMethod}
                        onChange={(e) => setCoolingMethod(e.target.value)}
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
            </div>

            {/* Temperature & Humidity */}
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

                {ventilationOnly && <div className={s.unitHint}>{t.misc.ventilationUnitHint}</div>}
              </div>

              <div className={"mt-6 " + s.grid2}>
                <div className={s.field}>
                  <label className={s.label}>
                    {t.labels.reqInsideTemp} ({tempUnit === "C" ? "°C" : "°F"})
                  </label>
                  <input
                    className={ventilationOnly ? s.inputDisabled : s.input}
                    inputMode="decimal" 
                    placeholder={tempPlaceholder}
                    value={reqInsideTempDisplay}
                    onChange={(e) => onReqInsideTempChange(e.target.value)}
                    disabled={ventilationOnly}
                  />
                </div>

                <div className={s.field}>
                  <label className={s.label}>{t.labels.reqInsideHum}</label>
                  <input
                    className={ventilationOnly ? s.inputDisabled : s.input}
                    inputMode="decimal" 
                    placeholder={t.placeholders.reqHumidity}
                    value={reqInsideHum}
                    onChange={(e) => allowNumericInput(setReqInsideHum, e.target.value)} 
                    disabled={ventilationOnly}
                  />
                </div>
              </div>

              <div className={"mt-6 " + s.grid4}>
                <div className={s.field}>
                  <label className={s.label}>
                    {t.labels.minTemp} ({tempUnit === "C" ? "°C" : "°F"})
                  </label>
                  <input className={s.inputDisabled} value={tempToDisplay(minTempC) || "-"} disabled />
                </div>

                <div className={s.field}>
                  <label className={s.label}>
                    {t.labels.maxTemp} ({tempUnit === "C" ? "°C" : "°F"})
                  </label>
                  <input className={s.inputDisabled} value={tempToDisplay(maxTempC) || "-"} disabled />
                </div>

                <div className={s.field}>
                  <label className={s.label}>{t.labels.rhMin}</label>
                  <input className={s.inputDisabled} value={rhMin || "-"} disabled />
                </div>

                <div className={s.field}>
                  <label className={s.label}>{t.labels.rhMax}</label>
                  <input className={s.inputDisabled} value={rhMax || "-"} disabled />
                </div>
              </div>

              {!ventilationOnly && reqInsideTempC && reqInsideTempC !== t.misc.ambient && (
                <div className={s.tempHelper}>
                  {t.misc.storedInternally} <b>{reqInsideTempC} °C</b>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={s.quickView}>
          Standard: <b>{standard || "-"}</b> | Classification: <b>{classification || "-"}</b> | ACPH:{" "}
          <b>{acph || "-"}</b>
        </div>
      </div>

      <div className={s.footer}>
        <Link to="/customer-info" className={s.backLink}>
          <FaArrowLeft /> {t.buttons.back}
        </Link>

        <Link
          to="/room"
          className={s.nextLink}
          state={roomPayload}
        >
          {t.buttons.next} <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}
