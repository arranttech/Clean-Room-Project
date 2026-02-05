import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCalculator, FaRegListAlt, FaArrowLeft, FaSave, FaPlus, FaTrash } from "react-icons/fa";

import s from "./roomDesign";
import T from "../../json/room.json";

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

type StandardsPayload = {
  standard?: number | string;
  classification?: number | string;
  acph?: number | string;
  acphMin?: number | null;
  acphMax?: number | null;
  reqInsideTempC?: number | string;
  reqInsideHum?: number | string;
  maxTempC?: number | string;
  rhMax?: number | string;
  system?: string;
  systemType?: string;
  coolingMethod?: string;
  heatingMethod?: string;
};

const emptyForm: RoomForm = {
  roomName: "",
  length: "",
  width: "",
  height: "",
  occupancy: "",
  equipmentLoad: "",
  lightingLoad: "",
  infiltrationsPerHour: "",
  freshAirPercent: "",
  exhaustAir: "",
};

// allow digits and one decimal point
const isDecimalLike = (v: string) => /^\d*\.?\d*$/.test(v);

export default function Room() {
  const location = useLocation();
  const navigate = useNavigate();
  const standards = (location.state || {}) as StandardsPayload;

  const [form, setForm] = useState<RoomForm>(emptyForm);
  const [savedRooms, setSavedRooms] = useState<RoomForm[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);


  const isVentilationOnly = standards.system === "Ventilation System" ||
    standards.systemType === "Ventilation System";


  const ventilationAllowedFields: (keyof RoomForm)[] = [
    "roomName",
    "length",
    "width",
    "height",
    "exhaustAir",
  ];

  // update one field with basic input validation
  const updateFieldValue = (key: keyof RoomForm, value: string) => {
    if (isVentilationOnly && !ventilationAllowedFields.includes(key)) return;
    if (key === "roomName") {
      if (value && !/^[a-zA-Z\s]+$/.test(value)) return;
    } else {
      if (value && !isDecimalLike(value)) return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };


  // check if all fields are filled so we can save the room
  // const isRoomReadyToSave = useMemo(() => {
  //   if (!form.roomName.trim()) return false;
  //   return Object.entries(form).every(([k, v]) =>
  //     k === "roomName" ? v.trim() !== "" : v !== ""
  //   );
  // }, [form]);

  const acphOptions = useMemo(() => {
    if (
      standards.acphMin == null ||
      standards.acphMax == null
    ) {
      return [];
    }

    const opts: number[] = [];
    for (let v = standards.acphMin; v <= standards.acphMax; v++) {
      opts.push(v);
    }
    return opts;
  }, [standards.acphMin, standards.acphMax]);


  const isRoomReadyToSave = useMemo(() => {
    const fieldsToCheck = isVentilationOnly
      ? ventilationAllowedFields
      : (Object.keys(form) as (keyof RoomForm)[]);

    return fieldsToCheck.every((key) =>
      key === "roomName" ? form[key].trim() !== "" : form[key] !== ""
    );
  }, [form, isVentilationOnly]);

  // open the form for a new room
  const openNewRoomForm = () => {
    setForm(emptyForm);
    setIsFormVisible(true);
  };

  // clear all current input fields
  const resetRoomForm = () => {
    setForm(emptyForm);
  };

  // save current form into savedRooms list
  const saveCurrentRoom = () => {
    if (!isRoomReadyToSave) {
      alert("Please fill all fields.");
      return;
    }

    // const roomToSave = isVentilationOnly
    //   ? (Object.fromEntries(
    //     ventilationAllowedFields.map((k) => [k, form[k]])
    //   ) as RoomForm)
    //   : form;

    setSavedRooms((prev) => [...prev, form]);
    setForm(emptyForm);
    setIsFormVisible(false);
  };

  // remove one saved room by index
  const removeSavedRoom = (index: number) => {
    setSavedRooms((prev) => prev.filter((_, i) => i !== index));
  };

  // go to results page with previous payload + saved rooms
  const goToResultsPage = () => {
    if (!savedRooms.length) {
      alert("Please add at least one room.");
      return;
    }

    navigate("/results", {
      state: {
        ...standards,
        rooms: savedRooms,
      },
    });
  };

  // render one input field based on key
  // const renderInput = (key: keyof RoomForm) => (
  //   <div className={s.field} key={key}>
  //     <div className={s.labelRow}>
  //       <label className={s.label}>{(T.fields as any)[key].label}</label>
  //       {(T.fields as any)[key].required && <span className={s.required}>*</span>}
  //     </div>

  //     <input
  //       className={s.input}
  //       inputMode={key === "roomName" ? "text" : "decimal"}
  //       value={form[key]}
  //       placeholder={(T.fields as any)[key].placeholder}
  //       onChange={(e) => updateFieldValue(key, e.target.value)}
  //     />
  //   </div>
  // );

  const renderInput = (key: keyof RoomForm) => {
    const disabled =
      isVentilationOnly && !ventilationAllowedFields.includes(key);

    return (
      <div className={s.field} key={key}>

        <label className={s.label}>{(T.fields as any)[key].label} <span className={s.required1}>*</span></label>

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
      {/* page header */}
      <div className={s.headerWrap}>
        <div className={s.headerIconWrap}>
          <FaCalculator className="text-white text-2xl" />
        </div>

        <h1 className={s.headerTitle}>{T.header.title}</h1>
        <p className={s.headerSubtitle}>{T.header.subtitle}</p>
      </div>

      <div className={s.cardWrap}>
        {/* empty state (form hidden) */}
        {!isFormVisible && (
          <div className={s.card}>
            <div className={s.cardInner}>
              <div className={s.emptyWrap}>
                <div className={s.emptyIconBox}>
                  <FaRegListAlt className={s.emptyIcon} />
                </div>

                <div className={s.emptyTitle}>
                  {savedRooms.length ? "Room Details Saved" : "No Rooms Added Yet"}
                </div>

                <div className={s.emptySubtitle}>
                  Click "Add Room" to start adding room specifications
                </div>

                <div className="mt-8">
                  <button type="button" onClick={openNewRoomForm} className={s.saveBtn}>
                    <FaPlus /> {T.buttons.addRoom}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* input form (form visible) */}
        {isFormVisible && (
          <div className={s.card}>
            <div className={s.cardInner}>
              {/* clear inputs */}
              <div className={s.topActions}>
                <button type="button" onClick={resetRoomForm} className={s.clrBtn}>
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

                {/* <div className={s.acphWrap}>
                <label className={s.label1}>ACPH Value</label>
                <input
                  className={s.acphInput}
                  value={`${standards.acph ?? "-"}`}
                  
                /></div> */}

                <div>
                  <label className={s.label}>
                    ACPH Value <span className={s.required1}>*</span>
                  </label>
                  <div>
                    <select
                      className={acphOptions.length ? s.select : s.selectDisabled }
                      value={standards.acph ?? ""}
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

                  </div>

                  {acphOptions.length > 0 && (
                    <div>
                      Range: <span className={s.range}> {standards.acphMin}–{standards.acphMax} </span>
                    </div>
                  )}
                </div>




              </div>
               <div className={s.acphBanner}>
                <div className={s.acphBannerStyle}>
                    <p className={s.bannerTitle}> Default ACPH from Classification: <span className={s.bannerValue}> {standards.acphMin} – {standards.acphMax}</span> </p>
                  <p className={s.bannerText}> Pre-filled with Maximum</p>
                </div>
                   <span className={s.bannerValue}> ({standards.standard} – {standards.classification})</span>


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
                {savedRooms.length ? `${savedRooms.length} saved` : "No rooms saved"}
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
                  <div key={i} className={s.roomCard}>
                    <div className="flex items-start justify-between gap-4">
                      <div className={s.roomCardTitle}>
                        Room {i + 1}: {r.roomName}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeSavedRoom(i)}
                        className={s.deleteBtn}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className={s.roomCardLine}>
                      Length:{r.length} | Width:{r.width} | Height:{r.height}
                    </div>

                    <div className={s.roomCardLine}>
                      Occupancy:{r.occupancy} | Equipment:{r.equipmentLoad} | Lighting:{r.lightingLoad}
                    </div>

                    <div className={s.roomCardLine}>
                      Infil/hr:{r.infiltrationsPerHour} | Fresh Air:{r.freshAirPercent}% | Exhaust:{r.exhaustAir}
                    </div>
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

          <div className="flex gap-4">
            <button type="button" onClick={saveCurrentRoom} className={s.backBtn}>
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
