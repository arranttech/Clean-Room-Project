// import { useMemo, useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaCalculator,
//   FaRegListAlt,
//   FaArrowLeft,
//   FaSave,
//   FaPlus,
//   FaTrash,
// } from "react-icons/fa";
// import {
//   resetStandards,
//   updateStandardsField,
// } from "../../redux/slices/standardSlice";
// import { useAppDispatch, useAppSelector } from "../../redux/hooks";

// import {
//   updateRoomFormField,
//   resetRoomForm,
//   saveRoom,
//   removeRoom,
//   openNewRoomForm,
// } from "../../redux/slices/roomSlice";

// import s from "./roomDesign";
// import T from "../../json/room.json";
// import standardDataJson from "../../json/standardData.json";
// import { Tooltip } from "../../components/Tooltip";
// import constants from "../../json/constants.json";

// type StandardItem = {
//   id: number;
//   title: string;
//   classifications: {
//     name: string;
//     minAir: number | null;
//     maxAir: number | null;
//   }[];
// };

// type StandardJson = {
//   standards: StandardItem[];
//   text: any;
// };

// const standardsDb = (standardDataJson as unknown as StandardJson).standards;

// type RoomForm = {
//   roomName: string;
//   length: string;
//   width: string;
//   height: string;
//   occupancy: string;
//   equipmentLoad: string;
//   lightingLoad: string;
//   infiltrationsPerHour: string;
//   freshAirPercent: string;
//   exhaustAir: string;
// };

// const generateId = () => {
//   return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
// };

// const isDecimalLike = (v: string) => /^\d*\.?\d*$/.test(v);

// export default function Room() {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();



//   // ─── Room slice ───
//   const form = useAppSelector((state: any) => state.room.form) as RoomForm;
//   const savedRooms = useAppSelector((state: any) => state.room.savedRooms) as any[];
//   const isFormVisible = useAppSelector((state: any) => state.room.isFormVisible) as boolean;


//   const [acphDeviation, setAcphDeviation] = useState<number>(0);

//   // ─── Standards slice ───
//   const rawZoneId = useAppSelector((state: any) => state.standards.zoneId ?? "1");
//   const zoneId = savedRooms.length === 0 ? "1" : rawZoneId;
//   const standard = useAppSelector((state: any) => state.standards.standard);
//   const classification = useAppSelector((state: any) => state.standards.classification);
//   const standardsAcph = useAppSelector((state: any) => state.standards.acph);
//   const system = useAppSelector((state: any) => state.standards.system);
//   const systemType = useAppSelector((state: any) => state.standards.systemType);
//   const coolingMethod = useAppSelector((state: any) => state.standards.coolingMethod);
//   const heatingMethod = useAppSelector((state: any) => state.standards.heatingMethod);
//   const reqInsideTempC = useAppSelector((state: any) => state.standards.reqInsideTempC);
//   const reqInsideHum = useAppSelector((state: any) => state.standards.reqInsideHum);

//   // ─── CustomerInfo slice ───
//   const minTempC = useAppSelector((state: any) => state.customerInfo.minTemp);
//   const maxTempC = useAppSelector((state: any) => state.customerInfo.maxTemp);
//   const rhMin = useAppSelector((state: any) => state.customerInfo.relativeHumidityMin);
//   const rhMax = useAppSelector((state: any) => state.customerInfo.relativeHumidityMax);

//   // ─── Local ACPH ───
//   const [selectedAcph, setSelectedAcph] = useState<number | string>(standardsAcph ?? "");

//   useEffect(() => {
//     setSelectedAcph(standardsAcph ?? "");
//   }, [standardsAcph]);

//   // ─── Zone rooms ───
//   const zoneRooms = useMemo(() => {
//     return savedRooms.filter((r: any) => String(r.zoneId ?? "1") === String(zoneId));
//   }, [savedRooms, zoneId]);

//   const isVentilationOnly =
//     system === "Ventilation System" || systemType === "Ventilation System";

//   const ventilationAllowedFields: (keyof RoomForm)[] = [
//     "roomName", "length", "width", "height", "exhaustAir",
//   ];

//   const updateFieldValue = (key: keyof RoomForm, value: string) => {
//     if (isVentilationOnly && !ventilationAllowedFields.includes(key)) return;
//     if (key === "roomName") {
//       if (value && !/^[a-zA-Z\s]+$/.test(value)) return;
//     } else {
//       if (value && !isDecimalLike(value)) return;
//     }
//     dispatch(updateRoomFormField({ field: key, value }));
//   };

//   // ─── ACPH from standardData.json ───
//   const selectedStandardObj = useMemo(() => {
//     return standardsDb.find((s) => s.title === standard) || null;
//   }, [standard]);

//   const selectedClassObj = useMemo(() => {
//     if (!selectedStandardObj) return null;
//     return selectedStandardObj.classifications.find((c) => c.name === classification) || null;
//   }, [selectedStandardObj, classification]);

//   const acphMin = useMemo(() => selectedClassObj?.minAir ?? null, [selectedClassObj]);
//   const acphMax = useMemo(() => selectedClassObj?.maxAir ?? null, [selectedClassObj]);

//   const acphOptions = useMemo(() => {
//     if (acphMin == null || acphMax == null) return [];
//     const opts: number[] = [];
//     const start = Math.min(acphMin, acphMax);
//     const end = Math.max(acphMin, acphMax);
//     for (let v = start; v <= end; v++) opts.push(v);
//     return opts;
//   }, [acphMin, acphMax]);

//   useEffect(() => {
//     if (!acphOptions.length) return;
//     const standardsVal = standardsAcph !== "" && standardsAcph != null ? Number(standardsAcph) : null;
//     const current = selectedAcph === "" || selectedAcph == null ? null : Number(selectedAcph);
//     const isCurrentValid = current != null && acphOptions.includes(current);
//     if (!isCurrentValid) {
//       if (standardsVal != null && acphOptions.includes(standardsVal)) {
//         setSelectedAcph(standardsVal);
//       } else {
//         setSelectedAcph(acphOptions[acphOptions.length - 1]);
//       }
//     }
//   }, [acphOptions, standardsAcph]);

//   const isRoomReadyToSave = useMemo(() => {
//     const fieldsToCheck = isVentilationOnly
//       ? ventilationAllowedFields
//       : (Object.keys(form) as (keyof RoomForm)[]);
//     return fieldsToCheck.every((key) =>
//       key === "roomName" ? form[key].trim() !== "" : form[key] !== "",
//     );
//   }, [form, isVentilationOnly]);

//   const handleOpenNewRoomForm = () => dispatch(openNewRoomForm());
//   const handleResetRoomForm = () => dispatch(resetRoomForm());

//   const getNextZoneId = () => {
//     const ids = savedRooms
//       .map((r: any) => Number(r.zoneId))
//       .filter((n: number) => Number.isFinite(n));
//     const current = Number(zoneId);
//     const maxId = Math.max(current || 1, ...(ids.length ? ids : [1]));
//     return String(maxId + 1);
//   };

//   // ─── Save room WITH zone standards snapshot ───
//   const saveCurrentRoom = () => {
//     if (!isRoomReadyToSave) {
//       alert("Please fill all fields.");
//       return;
//     }
//     if (selectedAcph === "" || selectedAcph == null) {
//       alert("Please select an ACPH value.");
//       return;
//     }

//     //  Each room carries its zone's standards 
//     const roomToSave = {
//       ...form,
//       id: generateId(),
//       acph: Number(selectedAcph),
//       zoneId: String(zoneId),
//       // Zone standards snapshot — saved with each room
//       zoneStandard: standard,
//       zoneClassification: classification,
//       zoneSystem: system,
//       zoneSystemType: systemType,
//       zoneCoolingMethod: coolingMethod,
//       zoneHeatingMethod: heatingMethod,
//       zoneReqInsideTempC: reqInsideTempC,
//       zoneReqInsideHum: reqInsideHum,
//     };

//     console.log("=== SAVING ROOM ===");
//     console.log("Room:", roomToSave);
//     console.log("====================");

//     dispatch(saveRoom(roomToSave));
//     setSelectedAcph(standardsAcph ?? "");
//   };

//   // Reset zoneId to "1" when all rooms are deleted ───
//   const removeSavedRoomById = (id: string) => {
//     dispatch(removeRoom(id));
//     const remainingRooms = savedRooms.filter((r: any) => r.id !== id);
//     if (remainingRooms.length === 0) {
//       dispatch(updateStandardsField({ field: "zoneId", value: "1" }));
//     }
//   };

//   // ─── Navigate to Results — ALL rooms, ALL zones ───
//   const goToResultsPage = () => {
//     if (!savedRooms.length) {
//       alert("Please add at least one room.");
//       return;
//     }

//     // CustomerInfo is shared across all zones
//     const resultsPayload = {
//       minTempC,
//       maxTempC,
//       rhMin,
//       rhMax,
//       rooms: savedRooms,
//     };

//     console.log("=== NAVIGATING TO RESULTS ===");
//     console.log("Total rooms:", savedRooms.length);
//     const zoneIds = [...new Set(savedRooms.map((r: any) => r.zoneId || "1"))];
//     zoneIds.forEach((zid) => {
//       const zRooms = savedRooms.filter((r: any) => String(r.zoneId || "1") === String(zid));
//       console.log(`Zone ${zid}: ${zRooms.length} rooms | System: ${zRooms[0]?.zoneSystem}`);
//     });
//     console.log("==============================");

//     navigate("/results", { state: resultsPayload });
//   };

//   const addAnotherZone = () => {
//     if (!zoneRooms.length) {
//       alert("Please add at least one room to the current zone before adding another.");
//       return;
//     }
//     const nextZoneId = getNextZoneId();
//     console.log("=== ADD ANOTHER ZONE ===", zoneId, "→", nextZoneId);
//     dispatch(resetStandards());
//     dispatch(updateStandardsField({ field: "zoneId", value: nextZoneId }));
//     navigate("/standards");
//   };

//   const increaseDeviation = () => {
//     setAcphDeviation((prev) => (prev < 20 ? prev + 5 : prev));
//   };

//   const decreaseDeviation = () => {
//     setAcphDeviation((prev) => (prev > -20 ? prev - 5 : prev));
//   };


//   // ─── Console Debug ───
//   useEffect(() => {
//     console.log("=== ROOM PAGE DEBUG ===");
//     console.log("Zone:", zoneId, "| System:", system, "| Classification:", classification);
//     console.log("Zone Rooms:", zoneRooms.length, "| All Rooms:", savedRooms.length);
//     console.log("========================");
//   }, [zoneId, system, classification, zoneRooms.length, savedRooms.length]);

//   const renderInput = (key: keyof RoomForm) => {
//     const disabled = isVentilationOnly && !ventilationAllowedFields.includes(key);
//     return (
//       <div className={s.field} key={key}>
//         <label className={s.label}>
//           {(T.fields as any)[key].label} <span className={s.required1}>*</span>
//           <Tooltip
//             id={key}
//             content={
//               key === "roomName" ? constants.Tooltip.roomNameTooltip :
//                 key === "length" ? constants.Tooltip.lengthTooltip :
//                   key === "width" ? constants.Tooltip.widthTooltip :
//                     key === "height" ? constants.Tooltip.heightTooltip :
//                       key === "occupancy" ? constants.Tooltip.occupancyTooltip :
//                         key === "equipmentLoad" ? constants.Tooltip.equipmentLoadTooltip :
//                           key === "lightingLoad" ? constants.Tooltip.lightingLoadTooltip :
//                             key === "infiltrationsPerHour" ? constants.Tooltip.infiltrationsTooltip :
//                               key === "freshAirPercent" ? constants.Tooltip.freshAirTooltip :
//                                 key === "exhaustAir" ? constants.Tooltip.exhaustAirTooltip :
//                                   ""
//             }
//           />
//         </label>
//         <input
//           className={disabled ? s.inputDisabled : s.input}
//           inputMode={key === "roomName" ? "text" : "decimal"}
//           value={form[key]}
//           disabled={disabled}
//           placeholder={disabled ? "Not required for ventilation" : (T.fields as any)[key].placeholder}
//           onChange={(e) => updateFieldValue(key, e.target.value)}
//         />
//       </div>
//     );
//   };

//   return (
//     <div className={s.page}>
//       <div className={s.headerWrap}>
//         <div className={s.headerIconWrap}>
//           <FaCalculator className="text-white text-2xl" />
//         </div>
//         <h1 className={s.headerTitle}>{T.header.title}</h1>
//         <p className={s.headerSubtitle}>{T.header.subtitle}</p>
//       </div>

//       <div className={s.cardWrap}>
//         {!isFormVisible && (
//           <div className={s.card}>
//             <div className={s.cardInner}>
//               <div className={s.emptyWrap}>
//                 <div className={s.emptyIconBox}>
//                   <FaRegListAlt className={s.emptyIcon} />
//                 </div>
//                 <div className={s.emptyTitle}>
//                   {savedRooms.length ? "Room Details Saved" : "No Rooms Added Yet"}
//                 </div>
//                 <div className={s.emptySubtitle}>
//                   Click "Add Room" to start adding room specifications
//                 </div>
//                 <div className="mt-8">
//                   <button type="button" onClick={handleOpenNewRoomForm} className={s.saveBtn}>
//                     <FaPlus /> {T.buttons.addRoom}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {isFormVisible && (
//           <div className={s.card}>
//             <div className={s.cardInner}>
//               <div className={s.topActions}>
//                 <button type="button" onClick={handleResetRoomForm} className={s.clrBtn}>
//                   Clear
//                 </button>
//               </div>

//               <div className={s.sectionTitle}>{T.sections.roomDetails}</div>
//               <div className={s.grid2}>{renderInput("roomName")}</div>
//               <div className={s.sectionDivider} />

//               <div className={s.sectionTitle}>
//                 {T.sections.roomDimensions}
//                 <Tooltip id="roomDimensions" content={constants.Tooltip.roomDimensionsTooltip} />
//               </div>
//               <div className={s.grid3}>
//                 {renderInput("length")}
//                 {renderInput("width")}
//                 {renderInput("height")}
//               </div>

//               <div className={s.sectionTitle}>{T.sections.occupancyLoad}</div>
//               <div className={s.grid3}>
//                 {renderInput("occupancy")}
//                 {renderInput("equipmentLoad")}
//                 {renderInput("lightingLoad")}
//               </div>

//               <div className={s.sectionTitle}>{T.sections.airflowParameters}</div>
//               <div className={s.grid3}>
//                 {renderInput("infiltrationsPerHour")}
//                 {renderInput("freshAirPercent")}
//                 {renderInput("exhaustAir")}
//                 <div>
//                   <label className={s.label}>
//                     ACPH Value <span className={s.required1}>*</span>
//                     <Tooltip id="acphValue" content={constants.Tooltip.acphValueTooltip} />
//                   </label>
//                   <select
//                     className={acphOptions.length ? s.select : s.selectDisabled}
//                     value={selectedAcph ?? ""}
//                     onChange={(e) => setSelectedAcph(e.target.value)}
//                     disabled={!acphOptions.length}
//                     required={true}
//                   >
//                     {!acphOptions.length && <option value="">ACPH not available</option>}
//                     {acphOptions.map((v) => (
//                       <option key={v} value={v}>{v}</option>
//                     ))}
//                   </select>
//                   {acphOptions.length > 0 && (
//                     <div>
//                       Range: <span className={s.range}>{acphMin}-{acphMax}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* ACPH Deviation Field */}
//                 <div>
//                   <label className={s.label}>
//                     ACPH Deviation
//                   </label>

//                   <div className={s.deviationBox}>
//                     <button
//                       type="button"
//                       onClick={decreaseDeviation}
//                       disabled={acphDeviation <= -20}
//                       className={s.deviationBtn}
//                     >
//                       −
//                     </button>

//                     <input
//                       type="text"
//                       value={`${acphDeviation}%`}
//                       readOnly
//                       className={s.deviationInput}
//                     />

//                     <button
//                       type="button"
//                       onClick={increaseDeviation}
//                       disabled={acphDeviation >= 20}
//                       className={s.deviationBtn}
//                     >
//                       +
//                     </button>
//                   </div>
//                   <div className={s.rangeText}>
//                     Range: -20% to +20%
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className={s.acphBanner}>
//               <div className={s.acphBannerStyle}>
//                 <p className={s.bannerTitle}>
//                   Default ACPH from Classification:{" "}
//                   <span className={s.bannerValue}>{acphMin} - {acphMax}</span>
//                 </p>
//                 <p className={s.bannerText}> Pre-filled with Maximum</p>
//               </div>
//               <span className={s.bannerValue}>({standard} - {classification})</span>
//             </div>
//           </div>

//         )}

//         {/* saved rooms list — ALL zones */}
//         <div className={s.card}>
//           <div className={s.cardInner}>
//             <div className={s.savedHeaderRow}>
//               <div className={s.savedHeaderTitle}>Saved Room Details</div>
//               <div className={s.savedHeaderCount}>
//                 {savedRooms.length ? `${savedRooms.length} saved` : "No rooms saved"}
//               </div>
//             </div>
//             <div className={s.divider} />
//             <div className={s.roomsList}>
//               {savedRooms.length === 0 ? (
//                 <div className={s.emptyState}>
//                   No rooms added yet. Click <b>Add Room</b> to begin.
//                 </div>
//               ) : (
//                 savedRooms.map((r: any, i: number) => (
//                   <div key={r.id || i} className={s.roomCard}>
//                     <div className="flex items-start justify-between gap-4">
//                       <div className={s.roomCardTitle}>Room {i + 1}: {r.roomName}</div>
//                       <button type="button" onClick={() => removeSavedRoomById(r.id)} className={s.deleteBtn}>
//                         <FaTrash />
//                       </button>
//                     </div>
//                     <div className={s.roomCardLine}>Zone: {r.zoneId ?? "1"} | System: {r.zoneSystem || "-"}</div>
//                     <div className={s.roomCardLine}>Length:{r.length} | Width:{r.width} | Height:{r.height}</div>
//                     <div className={s.roomCardLine}>Occupancy:{r.occupancy} | Equipment:{r.equipmentLoad} | Lighting:{r.lightingLoad}</div>
//                     <div className={s.roomCardLine}>Infil/hr:{r.infiltrationsPerHour} | Fresh Air:{r.freshAirPercent}% | Exhaust:{r.exhaustAir}</div>
//                     <div className={s.roomCardLine}>ACPH: {r.acph ?? "-"}</div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* footer */}
//         <div className={s.footer}>
//           <Link to="/standards" className={s.backBtn}>
//             <FaArrowLeft /> {T.buttons.back}
//           </Link>
//           <button type="button" onClick={addAnotherZone} className={s.zoneBtn}>
//             <FaPlus /> Add Another Zone
//           </button>
//           <div className="flex gap-4">
//             <button type="button" onClick={saveCurrentRoom} className={s.backBtn}>
//               {T.buttons.saveRoom}
//             </button>
//             <button type="button" onClick={goToResultsPage} className={s.saveBtn}>
//               {T.buttons.generate} <FaSave />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
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



  // ─── Room slice ───
  const form = useAppSelector((state: any) => state.room.form) as RoomForm;
  const savedRooms = useAppSelector((state: any) => state.room.savedRooms) as any[];
  const isFormVisible = useAppSelector((state: any) => state.room.isFormVisible) as boolean;


  const [acphDeviation, setAcphDeviation] = useState<number>(0);

  // ─── Standards slice ───
  const rawZoneId = useAppSelector((state: any) => state.standards.zoneId ?? "1");
  const zoneId = savedRooms.length === 0 ? "1" : rawZoneId;
  const standard = useAppSelector((state: any) => state.standards.standard);
  const classification = useAppSelector((state: any) => state.standards.classification);
  const standardsAcph = useAppSelector((state: any) => state.standards.acph);
  const system = useAppSelector((state: any) => state.standards.system);
  const systemType = useAppSelector((state: any) => state.standards.systemType);
  const coolingMethod = useAppSelector((state: any) => state.standards.coolingMethod);
  const heatingMethod = useAppSelector((state: any) => state.standards.heatingMethod);
  const reqInsideTempC = useAppSelector((state: any) => state.standards.reqInsideTempC);
  const reqInsideHum = useAppSelector((state: any) => state.standards.reqInsideHum);

  // ─── ProjectInfo slice ───
  const minTempC = useAppSelector((state: any) => state.projectInfo.minTemp);
  const maxTempC = useAppSelector((state: any) => state.projectInfo.maxTemp);
  const rhMin = useAppSelector((state: any) => state.projectInfo.relativeHumidityMin);
  const rhMax = useAppSelector((state: any) => state.projectInfo.relativeHumidityMax);

  // ─── Local ACPH ───
  const [selectedAcph, setSelectedAcph] = useState<number | string>(standardsAcph ?? "");

  useEffect(() => {
    setSelectedAcph(standardsAcph ?? "");
  }, [standardsAcph]);

  // ─── Zone rooms ───
  const zoneRooms = useMemo(() => {
    return savedRooms.filter((r: any) => String(r.zoneId ?? "1") === String(zoneId));
  }, [savedRooms, zoneId]);

  const isVentilationOnly =
    system === "Ventilation System" || systemType === "Ventilation System";

  const ventilationAllowedFields: (keyof RoomForm)[] = [
    "roomName", "length", "width", "height", "exhaustAir",
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
    return selectedStandardObj.classifications.find((c) => c.name === classification) || null;
  }, [selectedStandardObj, classification]);

  const acphMin = useMemo(() => selectedClassObj?.minAir ?? null, [selectedClassObj]);
  const acphMax = useMemo(() => selectedClassObj?.maxAir ?? null, [selectedClassObj]);

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
    const standardsVal = standardsAcph !== "" && standardsAcph != null ? Number(standardsAcph) : null;
    const current = selectedAcph === "" || selectedAcph == null ? null : Number(selectedAcph);
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
      key === "roomName" ? form[key].trim() !== "" : form[key] !== "",
    );
  }, [form, isVentilationOnly]);

  const handleOpenNewRoomForm = () => dispatch(openNewRoomForm());
  const handleResetRoomForm = () => dispatch(resetRoomForm());

  const getNextZoneId = () => {
    const ids = savedRooms
      .map((r: any) => Number(r.zoneId))
      .filter((n: number) => Number.isFinite(n));
    const current = Number(zoneId);
    const maxId = Math.max(current || 1, ...(ids.length ? ids : [1]));
    return String(maxId + 1);
  };

  // ─── Save room WITH zone standards snapshot ───
  const saveCurrentRoom = () => {
    if (!isRoomReadyToSave) {
      alert("Please fill all fields.");
      return;
    }
    if (selectedAcph === "" || selectedAcph == null) {
      alert("Please select an ACPH value.");
      return;
    }

    //  Each room carries its zone's standards 
    const roomToSave = {
      ...form,
      id: generateId(),
      acph: Number(selectedAcph),
      zoneId: String(zoneId),
      // Zone standards snapshot — saved with each room
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

    dispatch(saveRoom(roomToSave));
    setSelectedAcph(standardsAcph ?? "");
  };

  // Reset zoneId to "1" when all rooms are deleted ───
  const removeSavedRoomById = (id: string) => {
    dispatch(removeRoom(id));
    const remainingRooms = savedRooms.filter((r: any) => r.id !== id);
    if (remainingRooms.length === 0) {
      dispatch(updateStandardsField({ field: "zoneId", value: "1" }));
    }
  };

  // ─── Navigate to Results — ALL rooms, ALL zones ───
  const goToResultsPage = () => {
    if (!savedRooms.length) {
      alert("Please add at least one room.");
      return;
    }

    // ProjectInfo is shared across all zones
    const resultsPayload = {
      minTempC,
      maxTempC,
      rhMin,
      rhMax,
      rooms: savedRooms,
    };

    console.log("=== NAVIGATING TO RESULTS ===");
    console.log("Total rooms:", savedRooms.length);
    const zoneIds = [...new Set(savedRooms.map((r: any) => r.zoneId || "1"))];
    zoneIds.forEach((zid) => {
      const zRooms = savedRooms.filter((r: any) => String(r.zoneId || "1") === String(zid));
      console.log(`Zone ${zid}: ${zRooms.length} rooms | System: ${zRooms[0]?.zoneSystem}`);
    });
    console.log("==============================");

    navigate("/results", { state: resultsPayload });
  };

  const addAnotherZone = () => {
    if (!zoneRooms.length) {
      alert("Please add at least one room to the current zone before adding another.");
      return;
    }
    const nextZoneId = getNextZoneId();
    console.log("=== ADD ANOTHER ZONE ===", zoneId, "→", nextZoneId);
    dispatch(resetStandards());
    dispatch(updateStandardsField({ field: "zoneId", value: nextZoneId }));
    navigate("/standards");
  };

  const increaseDeviation = () => {
    setAcphDeviation((prev) => (prev < 20 ? prev + 5 : prev));
  };

  const decreaseDeviation = () => {
    setAcphDeviation((prev) => (prev > -20 ? prev - 5 : prev));
  };


  // ─── Console Debug ───
  useEffect(() => {
    console.log("=== ROOM PAGE DEBUG ===");
    console.log("Zone:", zoneId, "| System:", system, "| Classification:", classification);
    console.log("Zone Rooms:", zoneRooms.length, "| All Rooms:", savedRooms.length);
    console.log("========================");
  }, [zoneId, system, classification, zoneRooms.length, savedRooms.length]);

  const renderInput = (key: keyof RoomForm) => {
    const disabled = isVentilationOnly && !ventilationAllowedFields.includes(key);
    return (
      <div className={s.field} key={key}>
        <label className={s.label}>
          {(T.fields as any)[key].label} <span className={s.required1}>*</span>
          <Tooltip
            id={key}
            content={
              key === "roomName" ? constants.Tooltip.roomNameTooltip :
                key === "length" ? constants.Tooltip.lengthTooltip :
                  key === "width" ? constants.Tooltip.widthTooltip :
                    key === "height" ? constants.Tooltip.heightTooltip :
                      key === "occupancy" ? constants.Tooltip.occupancyTooltip :
                        key === "equipmentLoad" ? constants.Tooltip.equipmentLoadTooltip :
                          key === "lightingLoad" ? constants.Tooltip.lightingLoadTooltip :
                            key === "infiltrationsPerHour" ? constants.Tooltip.infiltrationsTooltip :
                              key === "freshAirPercent" ? constants.Tooltip.freshAirTooltip :
                                key === "exhaustAir" ? constants.Tooltip.exhaustAirTooltip :
                                  ""
            }
          />
        </label>
        <input
          className={disabled ? s.inputDisabled : s.input}
          inputMode={key === "roomName" ? "text" : "decimal"}
          value={form[key]}
          disabled={disabled}
          placeholder={disabled ? "Not required for ventilation" : (T.fields as any)[key].placeholder}
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
                  {savedRooms.length ? "Room Details Saved" : "No Rooms Added Yet"}
                </div>
                <div className={s.emptySubtitle}>
                  Click "Add Room" to start adding room specifications
                </div>
                <div className="mt-8">
                  <button type="button" onClick={handleOpenNewRoomForm} className={s.saveBtn}>
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
                <button type="button" onClick={handleResetRoomForm} className={s.clrBtn}>
                  Clear
                </button>
              </div>

              <div className={s.sectionTitle}>{T.sections.roomDetails}</div>
              <div className={s.grid2}>{renderInput("roomName")}</div>
              <div className={s.sectionDivider} />

              <div className={s.sectionTitle}>
                {T.sections.roomDimensions}
                <Tooltip id="roomDimensions" content={constants.Tooltip.roomDimensionsTooltip} />
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

              <div className={s.sectionTitle}>{T.sections.airflowParameters}</div>
              <div className={s.grid3}>
                {renderInput("infiltrationsPerHour")}
                {renderInput("freshAirPercent")}
                {renderInput("exhaustAir")}
                <div>
                  <label className={s.label}>
                    ACPH Value <span className={s.required1}>*</span>
                    <Tooltip id="acphValue" content={constants.Tooltip.acphValueTooltip} />
                  </label>
                  <select
                    className={acphOptions.length ? s.select : s.selectDisabled}
                    value={selectedAcph ?? ""}
                    onChange={(e) => setSelectedAcph(e.target.value)}
                    disabled={!acphOptions.length}
                    required={true}
                  >
                    {!acphOptions.length && <option value="">ACPH not available</option>}
                    {acphOptions.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  {acphOptions.length > 0 && (
                    <div>
                      Range: <span className={s.range}>{acphMin}-{acphMax}</span>
                    </div>
                  )}
                </div>

                {/* ACPH Deviation Field */}
                <div>
                  <label className={s.label}>
                    ACPH Deviation
                  </label>

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
                  <div className={s.rangeText}>
                    Range: -20% to +20%
                  </div>
                </div>
              </div>
            </div>

            <div className={s.acphBanner}>
              <div className={s.acphBannerStyle}>
                <p className={s.bannerTitle}>
                  Default ACPH from Classification:{" "}
                  <span className={s.bannerValue}>{acphMin} - {acphMax}</span>
                </p>
                <p className={s.bannerText}> Pre-filled with Maximum</p>
              </div>
              <span className={s.bannerValue}>({standard} - {classification})</span>
            </div>
          </div>

        )}

        {/* saved rooms list — ALL zones */}
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
                savedRooms.map((r: any, i: number) => (
                  <div key={r.id || i} className={s.roomCard}>
                    <div className="flex items-start justify-between gap-4">
                      <div className={s.roomCardTitle}>Room {i + 1}: {r.roomName}</div>
                      <button type="button" onClick={() => removeSavedRoomById(r.id)} className={s.deleteBtn}>
                        <FaTrash />
                      </button>
                    </div>
                    <div className={s.roomCardLine}>Zone: {r.zoneId ?? "1"} | System: {r.zoneSystem || "-"}</div>
                    <div className={s.roomCardLine}>Length:{r.length} | Width:{r.width} | Height:{r.height}</div>
                    <div className={s.roomCardLine}>Occupancy:{r.occupancy} | Equipment:{r.equipmentLoad} | Lighting:{r.lightingLoad}</div>
                    <div className={s.roomCardLine}>Infil/hr:{r.infiltrationsPerHour} | Fresh Air:{r.freshAirPercent}% | Exhaust:{r.exhaustAir}</div>
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