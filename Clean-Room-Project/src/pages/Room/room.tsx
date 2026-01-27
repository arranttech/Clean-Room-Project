import { useEffect, useState } from "react";
import addRoomDesign from "./roomDesign";
import textJson from "../../json/room.json";
import { FaCalculator, FaArrowLeft, FaSave } from "react-icons/fa";
import { Link } from "react-router-dom";

type TextJson = typeof textJson;

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

const onlyDigits = (value: string) => {
  return value === "" || /^[0-9]+$/.test(value);
};

export default function AddRoom() {
  const s = addRoomDesign;
  const T = textJson as TextJson;

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
    exhaustAir: ""
  });

  const setField = (key: keyof FormState, value: string) => {
    const isNumericField = key !== "roomName";
    if (isNumericField && !onlyDigits(value)) return;

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    console.log("Room Form:", form);
  }, [form]);

  const onBack = () => {
    console.log("Back clicked");
  };

  const onSave = () => {
    if (T.fields.roomName.required && form.roomName.trim() === "") {
      alert("Room name is required");
      return;
    }
    console.log("Save Room / Do Calculations:", form);
  };

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

      {/* CARD */}
      <div className={s.cardWrap}>
        <div className={s.card}>
          <div className={s.cardInner}>
            {/* ROOM DETAILS */}
            <div className={s.sectionTitle}>{T.sections.roomDetails}</div>

            <div className={s.grid2}>
              <div className={s.field}>
                <div className={s.labelRow}>
                  <label className={s.label}>{T.fields.roomName.label}</label>
                  {T.fields.roomName.required ? (
                    <span className={s.required}>*</span>
                  ) : null}
                </div>

                <input
                  className={s.input}
                  value={form.roomName}
                  placeholder={T.fields.roomName.placeholder}
                  onChange={(e) => setField("roomName", e.target.value)}
                />
              </div>
            </div>

            <div className={s.sectionDivider} />

            {/* ROOM DIMENSIONS */}
            <div className={s.sectionTitle}>{T.sections.roomDimensions}</div>

            <div className={s.grid3}>
              <div className={s.field}>
                <label className={s.label}>{T.fields.length.label}</label>
                <input
                  className={s.input}
                  inputMode="numeric"
                  value={form.length}
                  placeholder={T.fields.length.placeholder}
                  onChange={(e) => setField("length", e.target.value)}
                />
              </div>

              <div className={s.field}>
                <label className={s.label}>{T.fields.width.label}</label>
                <input
                  className={s.input}
                  inputMode="numeric"
                  value={form.width}
                  placeholder={T.fields.width.placeholder}
                  onChange={(e) => setField("width", e.target.value)}
                />
              </div>

              <div className={s.field}>
                <label className={s.label}>{T.fields.height.label}</label>
                <input
                  className={s.input}
                  inputMode="numeric"
                  value={form.height}
                  placeholder={T.fields.height.placeholder}
                  onChange={(e) => setField("height", e.target.value)}
                />
              </div>
            </div>

            <div className={s.sectionDivider} />

            <div className={s.sectionTitle}>{T.sections.occupancyLoad}</div>

            <div className={s.grid3}>
              <div className={s.field}>
                <label className={s.label}>{T.fields.occupancy.label}</label>
                <input
                  className={s.input}
                  inputMode="numeric"
                  value={form.occupancy}
                  placeholder={T.fields.occupancy.placeholder}
                  onChange={(e) => setField("occupancy", e.target.value)}
                />
              
              </div>

              <div className={s.field}>
                <label className={s.label}>{T.fields.equipmentLoad.label}</label>
                <input
                  className={s.input}
                  inputMode="numeric"
                  value={form.equipmentLoad}
                  placeholder={T.fields.equipmentLoad.placeholder}
                  onChange={(e) => setField("equipmentLoad", e.target.value)}
                />

              </div>

              <div className={s.field}>
                <label className={s.label}>{T.fields.lightingLoad.label}</label>
                <input
                  className={s.input}
                  inputMode="numeric"
                  value={form.lightingLoad}
                  placeholder={T.fields.lightingLoad.placeholder}
                  onChange={(e) => setField("lightingLoad", e.target.value)}
                />
            
              </div>
            </div>

            <div className={s.sectionDivider} />


            <div className={s.sectionTitle}>{T.sections.airflowParameters}</div>

            <div className={s.grid3}>
              <div className={s.field}>
                <label className={s.label}>{T.fields.infiltrationsPerHour.label}</label>
                <input
                  className={s.input}
                  inputMode="numeric"
                  value={form.infiltrationsPerHour}
                  placeholder={T.fields.infiltrationsPerHour.placeholder}
                  onChange={(e) => setField("infiltrationsPerHour", e.target.value)}
                />
              </div>

              <div className={s.field}>
                <label className={s.label}>{T.fields.freshAirPercent.label}</label>
                <input
                  className={s.input}
                  inputMode="numeric"
                  value={form.freshAirPercent}
                  placeholder={T.fields.freshAirPercent.placeholder}
                  onChange={(e) => setField("freshAirPercent", e.target.value)}
                />

              </div>

              <div className={s.field}>
                <label className={s.label}>{T.fields.exhaustAir.label}</label>
                <input
                  className={s.input}
                  inputMode="numeric"
                  value={form.exhaustAir}
                  placeholder={T.fields.exhaustAir.placeholder}
                  onChange={(e) => setField("exhaustAir", e.target.value)}
                />
               
              </div>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
      
        </div>
        <div className={s.footer}>
          <Link to="/standards"> 
            <button type="button" className={s.backBtn} onClick={onBack}>
              <FaArrowLeft />
              {T.buttons.back}
            </button>
            </Link>

            <button type="button" className={s.saveBtn} onClick={onSave}>
              {T.buttons.save}
              <FaSave />
            </button>
          </div>
      </div>
    </div>
  );
}
