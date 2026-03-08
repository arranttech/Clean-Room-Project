import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaCalculator,
  FaRegListAlt,
  FaArrowLeft,
  FaSave,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { resetStandards } from "../../redux/slices/standardSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  updateRoomFormField,
  resetRoomForm,
  openNewRoomForm,
} from "../../redux/slices/roomSlice";
import s from "./styles";
import T from "../../json/room.json";
import standardDataJson from "../../json/standardData.json";
import { Tooltip } from "../../components/Tooltip/index";
import constants from "../../json/constants.json";
import { addRooms } from "../../backend/controller/roomController";
import { storeresults } from "../../backend/controller/resultsController";
import { airflowService } from "../../backend/services/service";

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
const standardsDb = (standardDataJson as unknown as StandardJson).standards;

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

// Full saved room — all zone context captured at save time, backendRoomId from DB
type SavedRoom = RoomForm & {
  id: string;
  acph: number;
  backendRoomId: number | null;
  zoneId: number | string;
  projectStandardId: number | string | null;
  zoneStandard: string;
  zoneClassification: string;
  zoneSystem: string;
  zoneSystemType: string;
  zoneCoolingMethod: string;
  zoneHeatingMethod: string;
  zoneReqInsideTempC: string | number | null;
  zoneReqInsideHum: string | number;
};

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

const isDecimalLike = (v: string) => /^\d*\.?\d*$/.test(v);

const toNullableNumber = (value: any): number | null => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

export default function Room() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ── Redux: form UI state only ──
  const form = useAppSelector((state: any) => state.room.form) as RoomForm;
  const isFormVisible = useAppSelector(
    (state: any) => state.room.isFormVisible
  ) as boolean;

  // ── Redux: zone/standard display values (read-only in this component) ──
  const standard = useAppSelector((state: any) => state.standards.standard);
  const classification = useAppSelector(
    (state: any) => state.standards.classification
  );
  const standardsAcph = useAppSelector((state: any) => state.standards.acph);
  const system = useAppSelector((state: any) => state.standards.system);
  const systemType = useAppSelector((state: any) => state.standards.systemType);
  const coolingMethod = useAppSelector(
    (state: any) => state.standards.coolingMethod
  );
  const heatingMethod = useAppSelector(
    (state: any) => state.standards.heatingMethod
  );
  const reqInsideTempC = useAppSelector(
    (state: any) => state.standards.reqInsideTempC
  );
  const reqInsideHum = useAppSelector(
    (state: any) => state.standards.reqInsideHum
  );

  // ── Redux: project-level climate data ──
  const minTempC = useAppSelector((state: any) => state.projectInfo.minTemp);
  const maxTempC = useAppSelector((state: any) => state.projectInfo.maxTemp);
  const rhMin = useAppSelector(
    (state: any) => state.projectInfo.relativeHumidityMin
  );
  const rhMax = useAppSelector(
    (state: any) => state.projectInfo.relativeHumidityMax
  );
  const projectId = useAppSelector((state: any) => state.projectInfo.projectId);

  // ── DB IDs: sourced ONLY from location.state set by Standards page handleNext ──
  // Never from Redux — this guarantees correct IDs after addAnotherZone too
  const zoneIdFromNav = location.state?.zoneId ?? null;
  const projectStandardIdFromNav = location.state?.projectStandardId ?? null;

  // useRef holds current zone's DB IDs between renders without re-render side effects
  // Updated whenever Standards navigates here with fresh IDs
  const currentZoneIdRef = useRef<number | string | null>(zoneIdFromNav);
  const currentProjectStandardIdRef = useRef<number | string | null>(
    projectStandardIdFromNav
  );

  useEffect(() => {
    if (zoneIdFromNav != null) {
      currentZoneIdRef.current = zoneIdFromNav;
    }
    if (projectStandardIdFromNav != null) {
      currentProjectStandardIdRef.current = projectStandardIdFromNav;
    }
  }, [zoneIdFromNav, projectStandardIdFromNav]);

  // ── Local state: saved rooms — single source of truth, never Redux ──
  const [savedRooms, setSavedRooms] = useState<SavedRoom[]>([]);
  const [acphDeviation, setAcphDeviation] = useState<number>(0);
  const [selectedAcph, setSelectedAcph] = useState<number | string>(
    standardsAcph ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setSelectedAcph(standardsAcph ?? "");
  }, [standardsAcph]);

  const isVentilationOnly =
    system === "Ventilation System" || systemType === "Ventilation System";

  const ventilationAllowedFields: (keyof RoomForm)[] = [
    "roomName",
    "length",
    "width",
    "height",
    "exhaustAir",
  ];

  const updateFieldValue = (key: keyof RoomForm, value: string) => {
    if (isVentilationOnly && !ventilationAllowedFields.includes(key)) return;
    if (key === "roomName") {
      if (value && !/^[a-zA-Z\s]+$/.test(value)) return;
    } else {
      if (value && !isDecimalLike(value)) return;
    }
    dispatch(updateRoomFormField({ field: key, value }));
  };

  const selectedStandardObj = useMemo(
    () => standardsDb.find((s) => s.title === standard) || null,
    [standard]
  );
  const selectedClassObj = useMemo(() => {
    if (!selectedStandardObj) return null;
    return (
      selectedStandardObj.classifications.find(
        (c) => c.name === classification
      ) || null
    );
  }, [selectedStandardObj, classification]);

  const acphMin = useMemo(
    () => selectedClassObj?.minAir ?? null,
    [selectedClassObj]
  );
  const acphMax = useMemo(
    () => selectedClassObj?.maxAir ?? null,
    [selectedClassObj]
  );

  const acphOptions = useMemo(() => {
    if (acphMin == null || acphMax == null) return [];
    const opts: number[] = [];
    for (
      let v = Math.min(acphMin, acphMax);
      v <= Math.max(acphMin, acphMax);
      v++
    )
      opts.push(v);
    return opts;
  }, [acphMin, acphMax]);

  useEffect(() => {
    if (!acphOptions.length) return;
    const standardsVal =
      standardsAcph !== "" && standardsAcph != null
        ? Number(standardsAcph)
        : null;
    const current =
      selectedAcph === "" || selectedAcph == null ? null : Number(selectedAcph);
    const isCurrentValid = current != null && acphOptions.includes(current);
    if (!isCurrentValid) {
      if (standardsVal != null && acphOptions.includes(standardsVal))
        setSelectedAcph(standardsVal);
      else setSelectedAcph(acphOptions[acphOptions.length - 1]);
    }
  }, [acphOptions, standardsAcph]);

  const isRoomReadyToSave = useMemo(() => {
    const fieldsToCheck = isVentilationOnly
      ? ventilationAllowedFields
      : (Object.keys(form) as (keyof RoomForm)[]);
    return fieldsToCheck.every((key) =>
      key === "roomName" ? form[key].trim() !== "" : form[key] !== ""
    );
  }, [form, isVentilationOnly]);

  // ── saveCurrentRoom ──
  // Reads zoneId/projectStandardId from ref (set from location.state, never Redux)
  // Posts room to DB → gets backendRoomId → stores in local savedRooms state
  const saveCurrentRoom = async () => {
    if (!isRoomReadyToSave) {
      alert("Please fill all fields.");
      return;
    }
    if (selectedAcph === "" || selectedAcph == null) {
      alert("Please select an ACPH value.");
      return;
    }

    const zoneId = currentZoneIdRef.current;
    const projectStandardId = currentProjectStandardIdRef.current;

    if (!zoneId) {
      alert("Zone ID is missing. Please go back to Standards and try again.");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Post room to DB — get integer PK back
      const dbPayload = {
        zone_id: zoneId,
        projectStandardId,
        roomName: form.roomName,
        length: form.length,
        width: form.width,
        height: form.height,
        occupancy: form.occupancy,
        equipmentLoad: form.equipmentLoad,
        lightingLoad: form.lightingLoad,
        infiltrationsPerHour: form.infiltrationsPerHour,
        freshAirPercent: form.freshAirPercent,
        exhaustAir: form.exhaustAir,
        selectedAcph: Number(selectedAcph),
      };

      const data = await addRooms(dbPayload);
      const backendRoomId: number | null = data?.zoneRoomsId ?? null;

      console.log(
        `Room posted to DB | zoneId: ${zoneId} | backendRoomId: ${backendRoomId}`
      );

      // 2. Freeze all zone context at the moment of save — stored in local state
      const savedRoom: SavedRoom = {
        ...form,
        id: generateId(),
        acph: Number(selectedAcph),
        backendRoomId,
        zoneId,
        projectStandardId,
        zoneStandard: standard,
        zoneClassification: classification,
        zoneSystem: system,
        zoneSystemType: systemType,
        zoneCoolingMethod: coolingMethod,
        zoneHeatingMethod: heatingMethod,
        zoneReqInsideTempC: reqInsideTempC,
        zoneReqInsideHum: reqInsideHum,
      };

      // 3. Append to local state — no Redux involved
      setSavedRooms((prev) => [...prev, savedRoom]);

      // 4. Reset form UI for next room
      dispatch(resetRoomForm());
      dispatch({ type: "room/setFormVisible", payload: false });
      setSelectedAcph(standardsAcph ?? "");
    } catch (error) {
      console.error("Failed to save room:", error);
      alert("Failed to save room. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const removeSavedRoomById = (id: string) => {
    setSavedRooms((prev) => prev.filter((r) => r.id !== id));
  };

  // ── goToResultsPage ──
  // All rooms already in DB. Compute airflow → post results sequentially → navigate.
  const goToResultsPage = async () => {
    if (!savedRooms.length) {
      alert("Please add at least one room.");
      return;
    }

    setIsGenerating(true);
    try {
      const roomsSnapshot = [...savedRooms];
      const zoneCount = new Set(roomsSnapshot.map((r) => r.zoneId)).size;
      console.log(
        `Generating results: ${roomsSnapshot.length} rooms across ${zoneCount} zone(s)`
      );

      // Compute all airflow synchronously before any async work
      const allAirflowResults = roomsSnapshot.map((room) =>
        airflowService({
          roomName: room.roomName,
          length: room.length,
          width: room.width,
          height: room.height,
          acph: Number(room.acph),
          freshAirPercent: room.freshAirPercent,
          exhaustAir: room.exhaustAir,
          occupancy: room.occupancy,
          equipmentLoad: room.equipmentLoad,
          lightingLoad: room.lightingLoad,
          infiltrationsPerHour: room.infiltrationsPerHour,
          zoneId: room.zoneId,
          zoneSystem: room.zoneSystem,
          zoneSystemType: room.zoneSystemType,
          zoneCoolingMethod: room.zoneCoolingMethod,
          zoneHeatingMethod: room.zoneHeatingMethod,
          zoneClassification: room.zoneClassification,
          zoneReqInsideTempC: room.zoneReqInsideTempC,
          zoneReqInsideHum: room.zoneReqInsideHum,
          minTempC,
          maxTempC,
          rhMin,
          rhMax,
        })
      );

      // Sequential DB saves to avoid race conditions
      for (let idx = 0; idx < roomsSnapshot.length; idx++) {
        const room = roomsSnapshot[idx];
        const result = allAirflowResults[idx];

        console.log(
          `Saving result ${idx + 1}/${roomsSnapshot.length} | ` +
            `room: "${room.roomName}" | zoneId: ${room.zoneId} | backendRoomId: ${room.backendRoomId}`
        );

        await storeresults({
          project_RoomId: toNullableNumber(room.backendRoomId),
          project_id: projectId,
          roomName: room.roomName,
          project_Area: toNullableNumber(result.areaFt2),
          project_Volume: toNullableNumber(result.volumeFt3),
          project_RoomCfm: toNullableNumber(result.roomCfm),
          project_FreshAir: toNullableNumber(result.freshAir),
          project_ExhaustAir: toNullableNumber(result.exhaustAir),
          project_DehumidCfm: toNullableNumber(result.dehumidValue),
          project_Rem_Water_Vapour: toNullableNumber(result.removedWater),
          project_ResultCfm: toNullableNumber(result.resultantCfm),
          project_Room_Termi_Supply_Mod: toNullableNumber(
            result.roomTermSupplyValue
          ),
          project_Room_AC_Load_TR: toNullableNumber(result.roomACValue),
          project_Cfm_AC_Load_TR: toNullableNumber(result.cfmACLoadTR),
          project_Res_Cooling_Load_TR: toNullableNumber(result.resultCoolLoadTR),
          project_add_Water_Vapour: toNullableNumber(result.addWaterValue),
          project_HumidCfm: toNullableNumber(result.humidValue),
          project_ResultCfm_Hot: toNullableNumber(result.resultantheatCfm),
          project_Room_Term_Supply_Mod: toNullableNumber(
            result.roomTermSupplyHeatValue
          ),
          project_Room_Heating_Load_TR: toNullableNumber(result.roomHeatLoadTR),
          project_Cfm_Heating_Load_TR: toNullableNumber(
            result.cfmHeatLoadTRValue
          ),
          project_Result_Heating_Load_TR: toNullableNumber(
            result.resultHeatLoadTR
          ),
        });
      }

      console.log("All results saved to DB.");

      // Results page recomputes display from rooms — no airflow data needed in state
      navigate("/results", {
        state: {
          minTempC,
          maxTempC,
          rhMin,
          rhMax,
          rooms: roomsSnapshot,
        },
      });
    } catch (error) {
      console.error("Failed to generate results:", error);
      alert("Failed to generate results. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ── addAnotherZone ──
  // Clears refs so new zone IDs from Standards page take effect cleanly
  // Does NOT clear savedRooms — previous zone's rooms are preserved
  const addAnotherZone = () => {
    if (!savedRooms.length) {
      alert("Please add at least one room before adding another zone.");
      return;
    }
    currentZoneIdRef.current = null;
    currentProjectStandardIdRef.current = null;
    dispatch(resetStandards());
    dispatch(resetRoomForm());
    navigate("/standards");
  };

  const renderInput = (key: keyof RoomForm) => {
    const disabled =
      isVentilationOnly && !ventilationAllowedFields.includes(key);
    return (
      <div className={s.field} key={key}>
        <label className={s.label}>
          {(T.fields as any)[key].label} <span className={s.required1}>*</span>
          <Tooltip
            id={key}
            content={
              key === "roomName"
                ? constants.Tooltip.roomNameTooltip
                : key === "length"
                ? constants.Tooltip.lengthTooltip
                : key === "width"
                ? constants.Tooltip.widthTooltip
                : key === "height"
                ? constants.Tooltip.heightTooltip
                : key === "occupancy"
                ? constants.Tooltip.occupancyTooltip
                : key === "equipmentLoad"
                ? constants.Tooltip.equipmentLoadTooltip
                : key === "lightingLoad"
                ? constants.Tooltip.lightingLoadTooltip
                : key === "infiltrationsPerHour"
                ? constants.Tooltip.infiltrationsTooltip
                : key === "freshAirPercent"
                ? constants.Tooltip.freshAirTooltip
                : key === "exhaustAir"
                ? constants.Tooltip.exhaustAirTooltip
                : ""
            }
          />
        </label>
        <input
          className={disabled ? s.inputDisabled : s.input}
          inputMode={key === "roomName" ? "text" : "decimal"}
          value={form[key]}
          disabled={disabled}
          placeholder={
            disabled
              ? "Not required for ventilation"
              : (T.fields as any)[key].placeholder
          }
          onChange={(e) => updateFieldValue(key, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className={s.page}>
      <div className={s.headerWrap}>
        <div className={s.headerIconWrap}>
          <FaCalculator className="text-white text-2xl" />
        </div>
        <h1 className={s.headerTitle}>{T.header.title}</h1>
        <p className={s.headerSubtitle}>{T.header.subtitle}</p>
      </div>

      <div className={s.cardWrap}>
        {!isFormVisible && (
          <div className={s.card}>
            <div className={s.cardInner}>
              <div className={s.emptyWrap}>
                <div className={s.emptyIconBox}>
                  <FaRegListAlt className={s.emptyIcon} />
                </div>
                <div className={s.emptyTitle}>
                  {savedRooms.length
                    ? "Room Details Saved"
                    : "No Rooms Added Yet"}
                </div>
                <div className={s.emptySubtitle}>
                  Click "Add Room" to start adding room specifications
                </div>
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => dispatch(openNewRoomForm())}
                    className={s.saveBtn}
                  >
                    <FaPlus /> {T.buttons.addRoom}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isFormVisible && (
          <div className={s.card}>
            <div className={s.cardInner}>
              <div className={s.topActions}>
                <button
                  type="button"
                  onClick={() => dispatch(resetRoomForm())}
                  className={s.clrBtn}
                >
                  Clear
                </button>
              </div>
              <div className={s.sectionTitle}>{T.sections.roomDetails}</div>
              <div className={s.grid2}>{renderInput("roomName")}</div>
              <div className={s.sectionDivider} />
              <div className={s.sectionTitle}>
                {T.sections.roomDimensions}
                <Tooltip
                  id="roomDimensions"
                  content={constants.Tooltip.roomDimensionsTooltip}
                />
              </div>
              <div className={s.grid3}>
                {renderInput("length")}
                {renderInput("width")}
                {renderInput("height")}
              </div>
              <div className={s.sectionTitle}>{T.sections.occupancyLoad}</div>
              <div className={s.grid3}>
                {renderInput("occupancy")}
                {renderInput("equipmentLoad")}
                {renderInput("lightingLoad")}
              </div>
              <div className={s.sectionTitle}>
                {T.sections.airflowParameters}
              </div>
              <div className={s.grid3}>
                {renderInput("infiltrationsPerHour")}
                {renderInput("freshAirPercent")}
                {renderInput("exhaustAir")}
                <div>
                  <label className={s.label}>
                    ACPH Value <span className={s.required1}>*</span>
                    <Tooltip
                      id="acphValue"
                      content={constants.Tooltip.acphValueTooltip}
                    />
                  </label>
                  <select
                    className={acphOptions.length ? s.select : s.selectDisabled}
                    value={selectedAcph ?? ""}
                    onChange={(e) => setSelectedAcph(e.target.value)}
                    disabled={!acphOptions.length}
                  >
                    {!acphOptions.length && (
                      <option value="">ACPH not available</option>
                    )}
                    {acphOptions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  {acphOptions.length > 0 && (
                    <div>
                      Range:{" "}
                      <span className={s.range}>
                        {acphMin}-{acphMax}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className={s.label}>ACPH Deviation</label>
                  <div className={s.deviationBox}>
                    <button
                      type="button"
                      onClick={() =>
                        setAcphDeviation((p) => (p > -20 ? p - 5 : p))
                      }
                      disabled={acphDeviation <= -20}
                      className={s.deviationBtn}
                    >
                      −
                    </button>
                    <input
                      type="text"
                      value={`${acphDeviation}%`}
                      readOnly
                      className={s.deviationInput}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setAcphDeviation((p) => (p < 20 ? p + 5 : p))
                      }
                      disabled={acphDeviation >= 20}
                      className={s.deviationBtn}
                    >
                      +
                    </button>
                  </div>
                  <div className={s.rangeText}>Range: -20% to +20%</div>
                </div>
              </div>
            </div>
            <div className={s.acphBanner}>
              <div className={s.acphBannerStyle}>
                <p className={s.bannerTitle}>
                  Default ACPH from Classification:{" "}
                  <span className={s.bannerValue}>
                    {acphMin} - {acphMax}
                  </span>
                </p>
                <p className={s.bannerText}>Pre-filled with Maximum</p>
              </div>
              <span className={s.bannerValue}>
                ({standard} - {classification})
              </span>
            </div>
          </div>
        )}

        <div className={s.card}>
          <div className={s.cardInner}>
            <div className={s.savedHeaderRow}>
              <div className={s.savedHeaderTitle}>Saved Room Details</div>
              <div className={s.savedHeaderCount}>
                {savedRooms.length
                  ? `${savedRooms.length} saved`
                  : "No rooms saved"}
              </div>
            </div>
            <div className={s.divider} />
            <div className={s.roomsList}>
              {savedRooms.length === 0 ? (
                <div className={s.emptyState}>
                  No rooms added yet. Click <b>Add Room</b> to begin.
                </div>
              ) : (
                savedRooms.map((r, i) => (
                  <div key={r.id} className={s.roomCard}>
                    <div className="flex items-start justify-between gap-4">
                      <div className={s.roomCardTitle}>
                        Room {i + 1}: {r.roomName}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSavedRoomById(r.id)}
                        className={s.deleteBtn}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className={s.roomCardLine}>
                      Zone: {r.zoneId ?? "-"} | System: {r.zoneSystem || "-"}
                    </div>
                    <div className={s.roomCardLine}>
                      Length: {r.length} | Width: {r.width} | Height: {r.height}
                    </div>
                    <div className={s.roomCardLine}>
                      Occupancy: {r.occupancy} | Equipment: {r.equipmentLoad} |
                      Lighting: {r.lightingLoad}
                    </div>
                    <div className={s.roomCardLine}>
                      Infil/hr: {r.infiltrationsPerHour} | Fresh Air:{" "}
                      {r.freshAirPercent}% | Exhaust: {r.exhaustAir}
                    </div>
                    <div className={s.roomCardLine}>ACPH: {r.acph ?? "-"}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className={s.footer}>
          <Link to="/standards" className={s.backBtn}>
            <FaArrowLeft /> {T.buttons.back}
          </Link>
          <button type="button" onClick={addAnotherZone} className={s.zoneBtn}>
            <FaPlus /> Add Another Zone
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={saveCurrentRoom}
              disabled={isSaving}
              className={s.backBtn}
            >
              {isSaving ? "Saving..." : T.buttons.saveRoom}
            </button>
            <button
              type="button"
              onClick={goToResultsPage}
              disabled={isGenerating}
              className={s.saveBtn}
            >
              {isGenerating ? "Generating..." : T.buttons.generate} <FaSave />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}