import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCalculator, FaArrowLeft, FaSave } from "react-icons/fa";
import s from "./roomDesign";
import T from "../../json/room.json";

type FormState = {
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

type StandardsToRoomState = {
  acph?: number | string;
};

export default function AddRoom() {
  const location = useLocation();
  const prev = (location.state || {}) as StandardsToRoomState;
  const acph = prev.acph ?? "";

  const [form, setForm] = useState<FormState>({
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
  });

  const setField = (key: keyof FormState, value: string) => {
    if (key === "roomName") {
      if (value !== "" && !/^[a-zA-Z\s]+$/.test(value)) return;
    } else {
      if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const renderInput = (
    key: keyof FormState,
    mode: "text" | "numeric" = "numeric"
  ) => (
    <div className={s.field} key={key}>
      <div className={s.labelRow}>
        <label className={s.label}>{(T.fields as any)[key].label}</label>
        {(T.fields as any)[key].required && (
          <span className={s.required}>*</span>
        )}
      </div>
      <input
        className={s.input}
        inputMode={mode}
        value={form[key]}
        placeholder={(T.fields as any)[key].placeholder}
        onChange={(e) => setField(key, e.target.value)}
      />
    </div>
  );

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
        <div className={s.card}>
          <div className={s.cardInner}>
            <div className={s.sectionTitle}>{T.sections.roomDetails}</div>
            <div className={s.grid2}>{renderInput("roomName", "text")}</div>
            <div className={s.sectionDivider} />

            <div className={s.sectionTitle}>{T.sections.roomDimensions}</div>
            <div className={s.grid3}>
              {["length", "width", "height"].map((k) =>
                renderInput(k as keyof FormState)
              )}
            </div>
            <div className={s.sectionDivider} />

            <div className={s.sectionTitle}>{T.sections.occupancyLoad}</div>
            <div className={s.grid3}>
              {["occupancy", "equipmentLoad", "lightingLoad"].map((k) =>
                renderInput(k as keyof FormState)
              )}
            </div>
            <div className={s.sectionDivider} />

            <div className={s.sectionTitle}>{T.sections.airflowParameters}</div>
            <div className={s.grid3}>
              {["infiltrationsPerHour", "freshAirPercent", "exhaustAir"].map(
                (k) => renderInput(k as keyof FormState)
              )}
            </div>
          </div>
        </div>

        <div className={s.footer}>
          <Link to="/standards" className={s.backBtn}>
            <FaArrowLeft /> {T.buttons.back}
          </Link>

          <Link to="/results" className={s.saveBtn} state={{ ...form, acph }}>
            {T.buttons.save} <FaSave />
          </Link>
        </div>
      </div>
    </div>
  );
}
