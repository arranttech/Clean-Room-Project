import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "../../redux/slices/standardSlice"; // Redux actions
import { useAppDispatch, useAppSelector } from "../../redux/hooks"; // Redux hooks

import {
  updateRoomFormField,
  resetRoomForm,
  saveRoom,
  removeRoom,
  openNewRoomForm,
} from "../../redux/slices/roomSlice"; // Redux actions

import s from "./roomDesign";
import T from "../../json/room.json";
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

const standardsDb = (standardDataJson as unknown as StandardJson).standards; // Standards data

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

// Unique id generator
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// allow digits and one decimal point
const isDecimalLike = (v: string) => /^\d*\.?\d*$/.test(v);

export default function Room() {
  const dispatch = useAppDispatch(); // Redux dispatch
  const navigate = useNavigate(); // Router nav

  // ─── Room slice (Redux — replaces useState) ───
  const form = useAppSelector((state: any) => state.room.form) as RoomForm; // Redux form
  const savedRooms = useAppSelector(
    (state: any) => state.room.savedRooms,
  ) as any[]; // Redux list
  const isFormVisible = useAppSelector(
    (state: any) => state.room.isFormVisible,
  ) as boolean; // Redux UI

  // ─── Standards slice (Redux) ───
  const zoneId = useAppSelector((state: any) => state.standards.zoneId ?? "1"); // Zone id
  const standard = useAppSelector((state: any) => state.standards.standard); // Redux value
  const classification = useAppSelector(
    (state: any) => state.standards.classification,
  ); // Redux value

  // Default ACPH chosen on Standards page (usually max value)
  const standardsAcph = useAppSelector((state: any) => state.standards.acph); // Redux ACPH

  const system = useAppSelector((state: any) => state.standards.system); // Redux value
  const systemType = useAppSelector((state: any) => state.standards.systemType); // Redux value
  const coolingMethod = useAppSelector(
    (state: any) => state.standards.coolingMethod,
  ); // Redux value
  const heatingMethod = useAppSelector(
    (state: any) => state.standards.heatingMethod,
  ); // Redux value
  const reqInsideTempC = useAppSelector(
    (state: any) => state.standards.reqInsideTempC,
  ); // Redux value
  const reqInsideHum = useAppSelector(
    (state: any) => state.standards.reqInsideHum,
  ); // Redux value

  // ─── CustomerInfo slice (Redux) ───
  const minTempC = useAppSelector((state: any) => state.customerInfo.minTemp); // Redux value
  const maxTempC = useAppSelector((state: any) => state.customerInfo.maxTemp); // Redux value
  const rhMin = useAppSelector(
    (state: any) => state.customerInfo.relativeHumidityMin,
  ); // Redux value
  const rhMax = useAppSelector(
    (state: any) => state.customerInfo.relativeHumidityMax,
  ); // Redux value

  const [selectedAcph, setSelectedAcph] = useState<number | string>(
    standardsAcph ?? "",
  ); // Local state

  useEffect(() => {
    setSelectedAcph(standardsAcph ?? "");
  }, [standardsAcph]); // Sync default

  // Rooms for zone
  const zoneRooms = useMemo(() => {
    return savedRooms.filter(
      (r: any) => String(r.zoneId ?? "1") === String(zoneId),
    );
  }, [savedRooms, zoneId]); // Zone rooms

  const isVentilationOnly =
    system === "Ventilation System" || systemType === "Ventilation System"; // Mode check

  const ventilationAllowedFields: (keyof RoomForm)[] = [
    "roomName",
    "length",
    "width",
    "height",
    "exhaustAir",
  ]; // Allowed fields

  // update one field with basic input validation
  const updateFieldValue = (key: keyof RoomForm, value: string) => {
    if (isVentilationOnly && !ventilationAllowedFields.includes(key)) return; // Block edits
    if (key === "roomName") {
      if (value && !/^[a-zA-Z\s]+$/.test(value)) return; // Name validate
    } else {
      if (value && !isDecimalLike(value)) return; // Number validate
    }
    dispatch(updateRoomFormField({ field: key, value })); // Redux update
  };

  const selectedStandardObj = useMemo(() => {
    return standardsDb.find((s) => s.title === standard) || null;
  }, [standard]); // Pick standard

  const selectedClassObj = useMemo(() => {
    if (!selectedStandardObj) return null;
    return (
      selectedStandardObj.classifications.find((c) => c.name === classification) ||
      null
    );
  }, [selectedStandardObj, classification]); // Pick class

  const acphMin = useMemo(() => {
    return selectedClassObj?.minAir ?? null;
  }, [selectedClassObj]); // ACPH min

  const acphMax = useMemo(() => {
    return selectedClassObj?.maxAir ?? null;
  }, [selectedClassObj]); // ACPH max

  const acphOptions = useMemo(() => {
    if (acphMin == null || acphMax == null) return [];
    const opts: number[] = [];
    const start = Math.min(acphMin, acphMax);
    const end = Math.max(acphMin, acphMax);
    for (let v = start; v <= end; v++) opts.push(v);
    return opts;
  }, [acphMin, acphMax]); // Build options

  useEffect(() => {
    if (!acphOptions.length) return;

    const standardsVal =
      standardsAcph !== "" && standardsAcph != null ? Number(standardsAcph) : null;

    const current =
      selectedAcph === "" || selectedAcph == null ? null : Number(selectedAcph);

    const isCurrentValid = current != null && acphOptions.includes(current);

    if (!isCurrentValid) {
      if (standardsVal != null && acphOptions.includes(standardsVal)) {
        setSelectedAcph(standardsVal); // Use default
      } else {
        setSelectedAcph(acphOptions[acphOptions.length - 1]); // Use max
      }
    }
  }, [acphOptions, standardsAcph]); // Clamp value

  const isRoomReadyToSave = useMemo(() => {
    const fieldsToCheck = isVentilationOnly
      ? ventilationAllowedFields
      : (Object.keys(form) as (keyof RoomForm)[]);

    return fieldsToCheck.every((key) =>
      key === "roomName" ? form[key].trim() !== "" : form[key] !== "",
    );
  }, [form, isVentilationOnly]); // Validate form

  // open the form for a new room
  const handleOpenNewRoomForm = () => {
    dispatch(openNewRoomForm()); // Redux open
  };

  // clear all current input fields
  const handleResetRoomForm = () => {
    dispatch(resetRoomForm()); // Redux reset
  };

  // Next zone
  const getNextZoneId = () => {
    const ids = savedRooms
      .map((r: any) => Number(r.zoneId))
      .filter((n: number) => Number.isFinite(n));

    const current = Number(zoneId);
    const maxId = Math.max(current || 1, ...(ids.length ? ids : [1]));
    return String(maxId + 1);
  }; // Next zone

  // ─── Save room WITH its own ACPH value and unique ID ───
  const saveCurrentRoom = () => {
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
      zoneId: String(zoneId), // Zone link
    }; // Build payload

    dispatch(saveRoom(roomToSave)); // Redux save

    // Reset ACPH dropdown back to standards default for next room (local only)
    setSelectedAcph(standardsAcph ?? ""); // Local reset
  };

  // remove one saved room by unique id
  const removeSavedRoomById = (id: string) => {
    dispatch(removeRoom(id)); // Redux delete
  };

  //results page with all Redux values via location.state
  const goToResultsPage = () => {
    if (!zoneRooms.length) {
      alert("Please add at least one room.");
      return;
    }

    const resultsPayload = {
      // Standards values (from Redux)
      standard,
      classification,
      system,
      systemType,
      coolingMethod,
      heatingMethod,
      reqInsideTempC,
      reqInsideHum,

      // CustomerInfo values (from Redux)
      minTempC,
      maxTempC,
      rhMin,
      rhMax,
      rooms: zoneRooms, // Zone rooms
    }; // Build results

    navigate("/results", { state: resultsPayload }); // Route push
  };

  const addAnotherZone = () => {
    const nextZoneId = getNextZoneId(); // New zone

    dispatch(resetStandards()); // Redux reset
    dispatch(updateStandardsField({ field: "zoneId", value: nextZoneId })); // Set zone

    navigate("/standards"); // Route push
  };

  const renderInput = (key: keyof RoomForm) => {
    const disabled = isVentilationOnly && !ventilationAllowedFields.includes(key); // Disable rule

    return (
      <div className={s.field} key={key}>
        <label className={s.label}>
          {(T.fields as any)[key].label} <span className={s.required1}>*</span>
        </label>

        <input
          className={disabled ? s.inputDisabled : s.input}
          inputMode={key === "roomName" ? "text" : "decimal"}
          value={form[key]} // Redux value
          disabled={disabled}
          placeholder={
            disabled
              ? "Not required for ventilation"
              : (T.fields as any)[key].placeholder
          }
          onChange={(e) => updateFieldValue(key, e.target.value)} // Redux change
        />
      </div>
    );
  };

  return (
    <div className={s.page}>
      {/* page header */}
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
                  {savedRooms.length ? "Room Details Saved" : "No Rooms Added Yet"}{" "}
                  {/* All rooms */}
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
              {/* clear inputs */}
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

              <div className={s.sectionTitle}>{T.sections.roomDimensions}</div>
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

              <div className={s.sectionTitle}>{T.sections.airflowParameters}</div>
              <div className={s.grid3}>
                {renderInput("infiltrationsPerHour")}
                {renderInput("freshAirPercent")}
                {renderInput("exhaustAir")}
                <div>
                  <label className={s.label}>
                    ACPH Value <span className={s.required1}>*</span>
                  </label>

                  <select
                    className={acphOptions.length ? s.select : s.selectDisabled}
                    value={selectedAcph ?? ""} // Local value
                    onChange={(e) => setSelectedAcph(e.target.value)} // Local change
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
          </div>
        )}

        {/* saved rooms list */}
        <div className={s.card}>
          <div className={s.cardInner}>
            <div className={s.savedHeaderRow}>
              <div className={s.savedHeaderTitle}>Saved Room Details</div>
              <div className={s.savedHeaderCount}>
                {savedRooms.length ? `${savedRooms.length} saved` : "No rooms saved"}{" "}
                {/* All rooms */}
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
                      Zone: {r.zoneId ?? "1"} {/* Zone label */}
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

        {/* footer actions */}
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

            <button type="button" onClick={goToResultsPage} className={s.saveBtn}>
              {T.buttons.generate} <FaSave />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
