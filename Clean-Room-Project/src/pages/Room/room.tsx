import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaCalculator,
  FaRegListAlt,
  FaArrowLeft,
  FaSave,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import {
  resetStandards,
  updateStandardsField,
} from "../../redux/slices/standardSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  updateRoomFormField,
  resetRoomForm,
  saveRoom,
  removeRoom,
  openNewRoomForm,
} from "../../redux/slices/roomSlice";

import s from "./roomDesign";
import T from "../../json/room.json";
import standardDataJson from "../../json/standardData.json";
import { Tooltip } from "../../components/Tooltip";
import constants from "../../json/constants.json";
import {
  addRooms,
  getAllDetailsforCalculations,
  storeresults,
  getZoneRooms,
} from "../../backend/controller/controller";
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

type StandardJson = {
  standards: StandardItem[];
  text: any;
};

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

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const isDecimalLike = (v: string) => /^\d*\.?\d*$/.test(v);

export default function Room() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ─── Room slice ───
  const form = useAppSelector((state: any) => state.room.form) as RoomForm;
  const savedRooms = useAppSelector(
    (state: any) => state.room.savedRooms
  ) as any[];
  const isFormVisible = useAppSelector(
    (state: any) => state.room.isFormVisible
  ) as boolean;

  const [acphDeviation, setAcphDeviation] = useState<number>(0);

  // ─── Standards slice ───
  const zoneIdFromRedux = useAppSelector(
    (state: any) => state.standards.zoneId
  );
  const projectStandardIdFromRedux = useAppSelector(
    (state: any) => state.standards.projectStandardId
  );

  // router state first (freshest after navigation from StandardPage), Redux as fallback
  const zoneId = location.state?.zoneId ?? zoneIdFromRedux;
  const projectStandardId =
    location.state?.projectStandardId ?? projectStandardIdFromRedux;

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

  // ─── ProjectInfo slice ───
  const minTempC = useAppSelector((state: any) => state.projectInfo.minTemp);
  const maxTempC = useAppSelector((state: any) => state.projectInfo.maxTemp);
  const rhMin = useAppSelector(
    (state: any) => state.projectInfo.relativeHumidityMin
  );
  const rhMax = useAppSelector(
    (state: any) => state.projectInfo.relativeHumidityMax
  );

  // real projectId from Redux
  const projectId = useAppSelector((state: any) => state.projectInfo.projectId);

  // ─── Local ACPH ───
  const [selectedAcph, setSelectedAcph] = useState<number | string>(
    standardsAcph ?? ""
  );

  useEffect(() => {
    setSelectedAcph(standardsAcph ?? "");
  }, [standardsAcph]);

  // ─── Zone rooms — only filter when zoneId is actually set ───
  const zoneRooms = useMemo(() => {
    if (!zoneId) return [];
    return savedRooms.filter((r: any) => String(r.zoneId) === String(zoneId));
  }, [savedRooms, zoneId]);

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

  // ─── ACPH from standardData.json ───
  const selectedStandardObj = useMemo(() => {
    return standardsDb.find((s) => s.title === standard) || null;
  }, [standard]);

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
    const start = Math.min(acphMin, acphMax);
    const end = Math.max(acphMin, acphMax);
    for (let v = start; v <= end; v++) opts.push(v);
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
      if (standardsVal != null && acphOptions.includes(standardsVal)) {
        setSelectedAcph(standardsVal);
      } else {
        setSelectedAcph(acphOptions[acphOptions.length - 1]);
      }
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

  const handleOpenNewRoomForm = () => dispatch(openNewRoomForm());
  const handleResetRoomForm = () => dispatch(resetRoomForm());

  // GET zone rooms from DB on mount to verify saves
  useEffect(() => {
    if (!zoneId) return;
    const fetchRooms = async () => {
      try {
        const data = await getZoneRooms(zoneId);
        console.log("Fetched zone rooms from DB:", data.rooms);
      } catch (error) {
        console.error("Failed to fetch zone rooms:", error);
      }
    };
    fetchRooms();
  }, [zoneId]);

  // ─── Save room WITH zone standards snapshot ───
  const saveCurrentRoom = async () => {
    if (!isRoomReadyToSave) {
      alert("Please fill all fields.");
      return;
    }

    if (selectedAcph === "" || selectedAcph == null) {
      alert("Please select an ACPH value.");
      return;
    }

    const roomToSave = {
      ...form,
      id: generateId(),
      acph: Number(selectedAcph),
      zoneId: zoneId,
      zoneStandard: standard,
      zoneClassification: classification,
      zoneSystem: system,
      zoneSystemType: systemType,
      zoneCoolingMethod: coolingMethod,
      zoneHeatingMethod: heatingMethod,
      zoneReqInsideTempC: reqInsideTempC,
      zoneReqInsideHum: reqInsideHum,
    };

    console.log("=== SAVING ROOM ===");
    console.log("Room:", roomToSave);
    console.log("====================");

    try {
      dispatch(saveRoom(roomToSave));
      await saveZoneRooms(roomToSave);
      setSelectedAcph(standardsAcph ?? "");
    } catch (error) {
      console.error("Failed to save room:", error);
      alert("Failed to save room.");
    }
  };

  // clear zoneId to null when all rooms deleted
  const removeSavedRoomById = (id: string) => {
    dispatch(removeRoom(id));
    const remainingRooms = savedRooms.filter((r: any) => r.id !== id);
    if (remainingRooms.length === 0) {
      dispatch(updateStandardsField({ field: "zoneId", value: null }));
    }
  };

  const goToResultsPage = async () => {
    if (!savedRooms.length) {
      alert("Please add at least one room.");
      return;
    }

    const resultsPayload = {
      minTempC,
      maxTempC,
      rhMin,
      rhMax,
      rooms: savedRooms,
    };

    console.log("=== NAVIGATING TO RESULTS ===");
    console.log("Total rooms:", savedRooms.length);

    const zoneIds = [...new Set(savedRooms.map((r: any) => r.zoneId))];
    zoneIds.forEach((zid) => {
      const zRooms = savedRooms.filter(
        (r: any) => String(r.zoneId) === String(zid)
      );
      console.log(
        `Zone ${zid}: ${zRooms.length} rooms | System: ${zRooms[0]?.zoneSystem}`
      );
    });

    try {
      const allAirflowResults = await Promise.all(
        savedRooms.map(async (room) => {
          const room_id = Number(room.backendRoomId || 8);
          const calculationDetails = await getAllDetailsforCalculations(
            room_id
          );
          const roomData = calculationDetails.roomdetails?.[0] || {};
          return airflowService({
            roomName: room.roomName,
            length: Number(roomData.length || room.length),
            width: Number(roomData.width || room.width),
            height: Number(roomData.height || room.height),
            acph: Number(roomData.acph || room.acph),
            freshAirPercent: Number(
              roomData.freshAirPercent || room.freshAirPercent
            ),
            exhaustAir: Number(roomData.exhaustAir || room.exhaustAir),
            zoneSystem: room.zoneSystem,
            zoneSystemType: room.zoneSystemType,
          });
        })
      );

      console.log("All airflow results calculated:", allAirflowResults);

      await Promise.all(
        allAirflowResults.map(async (result) => {
          await storeresults({
            project_id: projectId,
            roomName: result.roomName,
            project_Area: result.areaFt2,
            project_Volume: result.volumeFt3,
            project_RoomCfm: result.roomCfm,
            project_FreshAir: result.freshAir,
            project_ExhaustAir: result.exhaustAir,
          });
        })
      );

      console.log("All airflow results saved successfully");

      navigate("/results", {
        state: {
          ...resultsPayload,
          airflowResults: allAirflowResults,
        },
      });
    } catch (error) {
      console.error("Failed to process airflow results:", error);
      alert("Failed to process airflow results.");
    }
  };
  const addAnotherZone = () => {
    if (!savedRooms.length) {
      alert("Please add at least one room before adding another zone.");
      return;
    }
    console.log("=== ADD ANOTHER ZONE === clearing zone, going to standards");
    dispatch(resetStandards());
    navigate("/standards");
  };

  const increaseDeviation = () => {
    setAcphDeviation((prev) => (prev < 20 ? prev + 5 : prev));
  };

  const decreaseDeviation = () => {
    setAcphDeviation((prev) => (prev > -20 ? prev - 5 : prev));
  };

  const saveZoneRooms = async (roomData: any) => {
    const payload = {
      zone_id: zoneId,
      projectStandardId: projectStandardId,
      roomName: roomData.roomName,
      length: roomData.length,
      width: roomData.width,
      height: roomData.height,
      occupancy: roomData.occupancy,
      equipmentLoad: roomData.equipmentLoad,
      lightingLoad: roomData.lightingLoad,
      infiltrationsPerHour: roomData.infiltrationsPerHour,
      freshAirPercent: roomData.freshAirPercent,
      exhaustAir: roomData.exhaustAir,
      selectedAcph: roomData.acph,
    };

    try {
      console.log("Saving zone room with payload:", payload);
      const data = await addRooms(payload);
      console.log("Zone room saved:", data);
    } catch (error) {
      console.error("Failed to save zone room:", error);
    }
  };

  // ─── Console Debug ───
  useEffect(() => {
    console.log("=== ROOM PAGE DEBUG ===");
    console.log(
      "zoneId:",
      zoneId ?? "NOT SET (waiting for backend)",
      "| projectStandardId:",
      projectStandardId ?? "NOT SET",
      "| projectId:",
      projectId ?? "NOT SET"
    );
    console.log("System:", system, "| Classification:", classification);
    console.log(
      "Zone Rooms:",
      zoneRooms.length,
      "| All Rooms:",
      savedRooms.length
    );
    console.log("========================");
  }, [zoneId, system, classification, zoneRooms.length, savedRooms.length]);

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
                    onClick={handleOpenNewRoomForm}
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
                  onClick={handleResetRoomForm}
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
                    required={true}
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

                {/* ACPH Deviation Field */}
                <div>
                  <label className={s.label}>ACPH Deviation</label>
                  <div className={s.deviationBox}>
                    <button
                      type="button"
                      onClick={decreaseDeviation}
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
                      onClick={increaseDeviation}
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
                <p className={s.bannerText}> Pre-filled with Maximum</p>
              </div>
              <span className={s.bannerValue}>
                ({standard} - {classification})
              </span>
            </div>
          </div>
        )}

        {/* saved rooms list — ALL zones */}
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
                savedRooms.map((r: any, i: number) => (
                  <div key={r.id || i} className={s.roomCard}>
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
                      Length:{r.length} | Width:{r.width} | Height:{r.height}
                    </div>
                    <div className={s.roomCardLine}>
                      Occupancy:{r.occupancy} | Equipment:{r.equipmentLoad} |
                      Lighting:{r.lightingLoad}
                    </div>
                    <div className={s.roomCardLine}>
                      Infil/hr:{r.infiltrationsPerHour} | Fresh Air:
                      {r.freshAirPercent}% | Exhaust:{r.exhaustAir}
                    </div>
                    <div className={s.roomCardLine}>ACPH: {r.acph ?? "-"}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* footer */}
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
              className={s.backBtn}
            >
              {T.buttons.saveRoom}
            </button>
            <button
              type="button"
              onClick={goToResultsPage}
              className={s.saveBtn}
            >
              {T.buttons.generate} <FaSave />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
