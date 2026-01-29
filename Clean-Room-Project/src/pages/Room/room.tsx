import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaCalculator,
  FaArrowLeft,
  FaSave,
  FaPlus,
  FaTrash
} from "react-icons/fa";

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
  acph?: number | string;
  reqInsideTempC?: number | string;
  reqInsideHum?: number | string;
  maxTempC?: number | string;
  rhMax?: number | string;
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
  exhaustAir: ""
};

const isDecimalLike = (v: string) => /^\d*\.?\d*$/.test(v);


export default function Room() {
  const location = useLocation();
  const navigate = useNavigate();
  const standards = (location.state || {}) as StandardsPayload;
  const [form, setForm] = useState<RoomForm>(emptyForm);
  const [rooms, setRooms] = useState<RoomForm[]>([]);


  const setField = (key: keyof RoomForm, value: string) => {
    if (key === "roomName") {
      if (value && !/^[a-zA-Z\s]+$/.test(value)) return;
    } else {
      if (value && !isDecimalLike(value)) return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  

  const canSaveRoom = useMemo(() => {
    if (!form.roomName.trim()) return false;

    return Object.entries(form).every(([k, v]) =>
      k === "roomName" ? v.trim() !== "" : v !== ""
    );
  }, [form]);



  const addRoom = () => {
    setForm(emptyForm);
  };

  const saveRoom = () => {
    if (!canSaveRoom) {
      alert("Please fill all fields.");
      return;
    }

    setRooms((prev) => [...prev, form]);
    setForm(emptyForm);
  };

  const deleteRoom = (index: number) => {
    setRooms((prev) => prev.filter((_, i) => i !== index));
  };

  
  //payload 
  const generateCalculations = () => {
    const finalRooms = canSaveRoom ? [...rooms, form] : rooms;

    if (!finalRooms.length) {
      alert("Please add at least one room.");
      return;
    }

    navigate("/results", {
      state: {
        ...standards,
        rooms: finalRooms
      }
    });
  };



  const renderInput = (key: keyof RoomForm) => (
    <div className={s.field} key={key}>
      <div className={s.labelRow}>
        <label className={s.label}>{(T.fields as any)[key].label}</label>
        {(T.fields as any)[key].required && (
          <span className={s.required}>*</span>
        )}
      </div>

      <input
        className={s.input}
        inputMode={key === "roomName" ? "text" : "decimal"}
        value={form[key]}
        placeholder={(T.fields as any)[key].placeholder}
        onChange={(e) => setField(key, e.target.value)}
      />
    </div>
  );


  return (
    <div className={s.page}>
      {/* HEADER */}
      <div className={s.headerWrap}>
        <div className={s.headerIconWrap}>
          <FaCalculator className="text-white text-2xl" />
        </div>

        <h1 className={s.headerTitle}>{T.header.title}</h1>
        <p className={s.headerSubtitle}>{T.header.subtitle}</p>
      </div>

      <div className={s.cardWrap}>
        {/* FORM CARD */}
        <div className={s.card}>
          <div className={s.cardInner}>
            {/* ADD ROOM */}
            <div className={s.topActions}>
              <button onClick={addRoom} className={s.saveBtn}>
                <FaPlus /> {T.buttons.addRoom}
              </button>
            </div>

            {/* ROOM DETAILS */}
            <div className={s.sectionTitle}>{T.sections.roomDetails}</div>
            <div className={s.grid2}>{renderInput("roomName")}</div>

            <div className={s.sectionDivider} />

            {/* DIMENSIONS */}
            <div className={s.sectionTitle}>{T.sections.roomDimensions}</div>
            <div className={s.grid3}>
              {["length", "width", "height"].map((k) =>
                renderInput(k as keyof RoomForm)
              )}
            </div>

            <div className={s.sectionDivider} />

            {/* OCCUPANCY */}
            <div className={s.sectionTitle}>{T.sections.occupancyLoad}</div>
            <div className={s.grid3}>
              {["occupancy", "equipmentLoad", "lightingLoad"].map((k) =>
                renderInput(k as keyof RoomForm)
              )}
            </div>

            <div className={s.sectionDivider} />

            {/* AIRFLOW */}
            <div className={s.sectionTitle}>
              {T.sections.airflowParameters}
            </div>
            <div className={s.grid3}>
              {[
                "infiltrationsPerHour",
                "freshAirPercent",
                "exhaustAir"
              ].map((k) => renderInput(k as keyof RoomForm))}
            </div>
          </div>
        </div>

        {/* SAVED ROOMS */}
        <div className={s.roomsList}>
          {rooms.map((r, i) => (
            <div key={i} className={s.roomCard}>
              <div className="flex justify-between">
                <div className={s.roomCardTitle}>
                  Room {i + 1}: {r.roomName}
                </div>

                <button onClick={() => deleteRoom(i)}>
                  <FaTrash />
                </button>
              </div>

              <div className={s.roomCardLine}>
                Length:{r.length} | Width:{r.width} | Height:{r.height}
              </div>

              <div className={s.roomCardLine}>
                Occupancy:{r.occupancy} | Equipment load:{r.equipmentLoad} | Lighting:{r.lightingLoad}
              </div>

              <div className={s.roomCardLine}>
                Infil/hr:{r.infiltrationsPerHour} | Fresh Air:{r.freshAirPercent}% | Exhaust Air:{r.exhaustAir}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className={s.footer}>
          <Link to="/standards" className={s.backBtn}>
            <FaArrowLeft /> {T.buttons.back}
          </Link>

          <div className="flex gap-4">
            <button onClick={saveRoom} className={s.backBtn}>
              {T.buttons.saveRoom}
            </button>

            <button onClick={generateCalculations} className={s.saveBtn}>
              {T.buttons.generate} <FaSave />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
