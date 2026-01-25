// src/components/standard/standard.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import standardDesign from "./standardDesign";
import standardsDataJson from "../../json/standardData.json";

type StandardItem = {
  id: number;
  title: string;
  classifications: {
    name: string;
    minAir: number | null;
    maxAir: number | null;
  }[];
};

const standardsData = standardsDataJson as StandardItem[];

type SystemName = "" | "Air-Heating System" | "Air-Cooling System" | "Ventilation System";

export default function Standard() {
  const s = standardDesign;

  // standards
  const [standard, setStandard] = useState("");
  const [classification, setClassification] = useState("");
  const [acph, setAcph] = useState("");

  // system section
  const [system, setSystem] = useState<SystemName>("");
  const [systemType, setSystemType] = useState("");
  const [method, setMethod] = useState("");

  // temperature & humidity (user inputs)
  const [reqInsideTemp, setReqInsideTemp] = useState("");
  const [reqInsideHum, setReqInsideHum] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [rhMin, setRhMin] = useState("");
  const [rhMax, setRhMax] = useState("");

  // derived from standard selection
  const selectedStandard = standardsData.find((x) => x.title === standard);
  const classifications = selectedStandard ? selectedStandard.classifications : [];
  const selectedClass = classifications.find((c) => c.name === classification);

  // acph options (min..max)
  const acphOptions: number[] = useMemo(() => {
    const out: number[] = [];
    if (selectedClass?.minAir != null && selectedClass?.maxAir != null) {
      for (let v = selectedClass.minAir; v <= selectedClass.maxAir; v++) out.push(v);
    }
    return out;
  }, [selectedClass]);

  const acphDisabled =
    !selectedClass || selectedClass.minAir == null || selectedClass.maxAir == null;

  // default acph to max when classification changes
  useEffect(() => {
    if (selectedClass?.maxAir != null) setAcph(String(selectedClass.maxAir));
    else setAcph("");
  }, [classification, selectedClass?.maxAir]);

  // system options
  const systemOptions: SystemName[] = [
    "",
    "Air-Heating System",
    "Air-Cooling System",
    "Ventilation System",
  ];

  const isHeating = system === "Air-Heating System";
  const isCooling = system === "Air-Cooling System";
  const isVentilation = system === "Ventilation System";

  const systemTypeLabel = isHeating
    ? "Air-Heating System Type"
    : isCooling
    ? "Air-Cooling System Type"
    : "Ventilation System Type";

  const systemTypePlaceholder = isHeating
    ? "Select Air-Heating System Type..."
    : isCooling
    ? "Select Air-Cooling System Type..."
    : "Select Ventilation System Type...";

  const methodLabel = isHeating ? "Heating Method" : "Cooling Method";
  const methodPlaceholder = isHeating ? "Select Heating Method..." : "Select Cooling Method...";

  const systemTypes = isHeating
    ? ["Cleanroom Air-Heating System", "Comfort Air-Heating System", "Non-Classified Air-Heating System"]
    : isCooling
    ? ["Cleanroom Air-Cooling System", "Comfort Air-Cooling System", "Non-Classified Air-Cooling System"]
    : isVentilation
    ? ["Cleanroom Ventilation System", "Non-Classified Ventilation System"]
    : [];

  const methods = isHeating ? ["Hot Water", "Steam"] : isCooling ? ["Chilled Water", "Brine", "DX"] : [];

  // when system changes, reset dependent fields and apply ventilation rules
  useEffect(() => {
    setSystemType("");
    setMethod("");

    if (system === "Ventilation System") {
      // lock these as Ambient (user cannot edit)
      setReqInsideTemp("Ambient");
      setReqInsideHum("Ambient");
      setMinTemp("Ambient");
      setMaxTemp("Ambient");
      setRhMin("Ambient");
      setRhMax("Ambient");
    } else {
      // clear so user can type
      setReqInsideTemp("");
      setReqInsideHum("");
      setMinTemp("");
      setMaxTemp("");
      setRhMin("");
      setRhMax("");
    }
  }, [system]);

  // console log everything
  useEffect(() => {
    console.log("Selected:", {
      standard,
      classification,
      acph,
      system,
      systemType,
      method,
      reqInsideTemp,
      reqInsideHum,
      minTemp,
      maxTemp,
      rhMin,
      rhMax,
    });
  }, [
    standard,
    classification,
    acph,
    system,
    systemType,
    method,
    reqInsideTemp,
    reqInsideHum,
    minTemp,
    maxTemp,
    rhMin,
    rhMax,
  ]);

  return (
    <div className={s.page}>
      <div className={s.top}>
        <h1 className={s.title}>Standards and Classification</h1>
        <p className={s.subtitle}>Select cleanroom classification and air change requirements</p>
      </div>

      <div className={s.cardWrap}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.cardHeaderTitle}>Standards and Classification</div>
          </div>

          <div className={s.divider} />

          <div className={s.body}>
            {/* Standards + Classification + ACPH */}
            <div className={s.grid3}>
              {/* Standard */}
              <div className={s.field}>
                <label className={s.label}>
                  Standard <span className={s.required}>*</span>
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
                  <option value="">Select Standard...</option>
                  {standardsData.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Classification */}
              <div className={s.field}>
                <label className={s.label}>
                  Classification <span className={s.required}>*</span>
                </label>
                <select
                  className={selectedStandard ? s.select : s.selectDisabled}
                  disabled={!selectedStandard}
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                >
                  <option value="">
                    {selectedStandard ? "Select Classification..." : "Select a standard first"}
                  </option>
                  {classifications.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ACPH */}
              <div className={s.field}>
                <label className={s.label}>
                  ACPH (Air Changes Per Hour) <span className={s.required}>*</span>
                </label>

                <select
                  className={!acphDisabled ? s.select : s.selectDisabled}
                  disabled={acphDisabled}
                  value={acph}
                  onChange={(e) => setAcph(e.target.value)}
                >
                  {acphDisabled ? (
                    <option value="">Select class first</option>
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
                    Range: <span className={s.rangeValue}>{selectedClass.minAir} - {selectedClass.maxAir}</span>
                  </div>
                )}
              </div>
            </div>

            {/* System dropdown row */}


            <div className={s.sectionSpacer}>
              <div className={s.grid2}>
                <div className={s.field}>
                  <label className={s.label}>
                    System <span className={s.required}>*</span>
                  </label>
                  <select
                    className={s.select}
                    value={system}
                    onChange={(e) => setSystem(e.target.value as SystemName)}
                  >
                    <option value="">Select System...</option>
                    {systemOptions
                      .filter((x) => x !== "")
                      .map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                  </select>
                </div>

                {/* When ventilation selected: show ONLY these two fields (System + Ventilation System Type) */}
                {system !== "" && (
                  <div className={s.field}>
                    <label className={s.label}>
                      {systemTypeLabel} <span className={s.required}>*</span>
                    </label>

                    <select
                      className={system ? s.select : s.selectDisabled}
                      disabled={!system}
                      value={systemType}
                      onChange={(e) => setSystemType(e.target.value)}
                    >
                      <option value="">{systemTypePlaceholder}</option>
                      {systemTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Heating/Cooling only: show method below, full width */}
              {(isHeating || isCooling) && (
                <div className={"mt-6 " + s.grid2}>
                  <div className={s.field}>
                    <label className={s.label}>
                      {methodLabel} <span className={s.required}>*</span>
                    </label>

                    <select
                      className={system ? s.select : s.selectDisabled}
                      disabled={!system}
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                    >
                      <option value="">{methodPlaceholder}</option>
                      {methods.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
               {/* quick view */}
            <div className={s.quickView}>
              Standard: <b>{standard || "-"}</b> | Classification: <b>{classification || "-"}</b> | ACPH: <b>{acph || "-"}</b>
            </div>
            </div>

            {/* Temperature and Humidity */}
            <div className={s.sectionLine} />

            <div className={s.sectionSpacer}>
              <div className={s.sectionTitle}>Temperature and Humidity</div>

              <div className={"mt-6 " + s.grid2}>
                <div className={s.field}>
                  <label className={s.label}>Required Inside Temperature (C)</label>
                  <input
                    className={isVentilation ? s.inputDisabled : s.input}
                    placeholder="eg: 22"
                    value={reqInsideTemp}
                    onChange={(e) => setReqInsideTemp(e.target.value)}
                    disabled={isVentilation}
                  />
                </div>

                <div className={s.field}>
                  <label className={s.label}>Required Inside Humidity (RH)</label>
                  <input
                    className={isVentilation ? s.inputDisabled : s.input}
                    placeholder="eg: 55"
                    value={reqInsideHum}
                    onChange={(e) => setReqInsideHum(e.target.value)}
                    disabled={isVentilation}
                  />
                </div>
              </div>
              <div className={"mt-6 " + s.grid4}>
                <div className={s.field}>
                  <label className={s.label}>Minimum Temperature (C)</label>
                  <input
                    className={isVentilation ? s.inputDisabled : s.input}
                    placeholder="eg: 18"
                    value={minTemp}
                    onChange={(e) => setMinTemp(e.target.value)}
                    disabled={isVentilation}
                  />
                </div>

                <div className={s.field}>
                  <label className={s.label}>Maximum Temperature (C)</label>
                  <input
                    className={isVentilation ? s.inputDisabled : s.input}
                    placeholder="eg: 24"
                    value={maxTemp}
                    onChange={(e) => setMaxTemp(e.target.value)}
                    disabled={isVentilation}
                  />
                </div>

                <div className={s.field}>
                  <label className={s.label}>Relative Humidity Min</label>
                  <input
                    className={isVentilation ? s.inputDisabled : s.input}
                    placeholder="eg: 40"
                    value={rhMin}
                    onChange={(e) => setRhMin(e.target.value)}
                    disabled={isVentilation}
                  />
                </div>

                <div className={s.field}>
                  <label className={s.label}>Relative Humidity Max</label>
                  <input
                    className={isVentilation ? s.inputDisabled : s.input}
                    placeholder="eg: 60"
                    value={rhMax}
                    onChange={(e) => setRhMax(e.target.value)}
                    disabled={isVentilation}
                  />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className={s.footer}>
        <Link to="/customer-info" className={s.backLink}>
          <FaArrowLeft /> Back to Customer-Info
        </Link>

        <Link to="/next-step" className={s.nextLink}>
          Next Step <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}
