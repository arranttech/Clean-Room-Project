import { useState } from "react";
import { FiX } from "react-icons/fi";
import { FaFloppyDisk, FaCircleCheck } from "react-icons/fa6";
import s from "./usersDesign";
// import { createUser } from "../../../backend/controller/controller";

type AddUserProps = {
  onCancel: () => void;
  onSaved: () => void;
};

type FormErrors = {
  user_first_name: string;
  user_last_name: string;
  user_email_id: string;
  user_phone_home: string;
  user_phone_work: string;
};

export default function AddUser({ onCancel, onSaved }: AddUserProps) {
  const [form, setForm] = useState({
    user_login_id: 0,
    user_first_name: "",
    user_last_name: "",
    user_id: 0,
    user_email_id: "",
    user_address: "",
    user_phone_home: "",
    user_phone_work: "",
    created_date: "",
    created_by: "admin",
    updated_by: "admin",
    update_date: "",
    user_admin_flag: "No",
    customer_id: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({
    user_first_name: "",
    user_last_name: "",
    user_email_id: "",
    user_phone_home: "",
    user_phone_work: "",
  });

  const [saving, setSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ---------- Validation ----------
  const validateName = (v: string) =>
    /^[A-Za-z\s]{3,30}$/.test(v)
      ? ""
      : "3–30 letters only";

  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? ""
      : "Invalid email";

  const validatePhone = (v: string) =>
    !v || /^\+?[0-9\s\-()]{7,20}$/.test(v)
      ? ""
      : "Invalid phone";

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveUser = async () => {
    const firstErr = validateName(form.user_first_name);
    const lastErr = validateName(form.user_last_name);
    const emailErr = validateEmail(form.user_email_id);
    const homeErr = validatePhone(form.user_phone_home);
    const workErr = validatePhone(form.user_phone_work);

    if (firstErr || lastErr || emailErr || homeErr || workErr) {
      setErrors({
        user_first_name: firstErr,
        user_last_name: lastErr,
        user_email_id: emailErr,
        user_phone_home: homeErr,
        user_phone_work: workErr,
      });
      return;
    }

    setSaving(true);

    try {
      const now = new Date().toISOString();

      const payload = {
        ...form,
        created_date: now,
        update_date: now,
      };

      console.log("Saving user:", payload);

      // await createUser(payload);

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        onSaved();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className={s.formTitle}>Add New User</h1>
      <div className={s.formCard}>

        {/* Login ID */}
        <div className={s.formGroup}>
          <label className={s.formLabel}>Login ID *</label>
          <input
            type="number"
            className={s.formInput}
            onChange={(e) => handleChange("user_login_id", Number(e.target.value))}
          />
        </div>

        {/* First Name */}
        <div className={s.formGroup}>
          <label className={s.formLabel}>First Name *</label>
          <input
            className={s.formInput}
            value={form.user_first_name}
            onChange={(e) => {
              handleChange("user_first_name", e.target.value);
              setErrors((p) => ({
                ...p,
                user_first_name: validateName(e.target.value),
              }));
            }}
          />
          {errors.user_first_name && <p className={s.formError}>{errors.user_first_name}</p>}
        </div>

        {/* Last Name */}
        <div className={s.formGroup}>
          <label className={s.formLabel}>Last Name *</label>
          <input
            className={s.formInput}
            value={form.user_last_name}
            onChange={(e) => {
              handleChange("user_last_name", e.target.value);
              setErrors((p) => ({
                ...p,
                user_last_name: validateName(e.target.value),
              }));
            }}
          />
          {errors.user_last_name && <p className={s.formError}>{errors.user_last_name}</p>}
        </div>

        {/* Email */}
        <div className={s.formGroup}>
          <label className={s.formLabel}>Email *</label>
          <input
            type="email"
            className={s.formInput}
            value={form.user_email_id}
            onChange={(e) => {
              handleChange("user_email_id", e.target.value);
              setErrors((p) => ({
                ...p,
                user_email_id: validateEmail(e.target.value),
              }));
            }}
          />
          {errors.user_email_id && <p className={s.formError}>{errors.user_email_id}</p>}
        </div>

        {/* Address */}
        <div className={s.formGroup}>
          <label className={s.formLabel}>Address *</label>
          <textarea
            className={s.formTextarea}
            value={form.user_address}
            onChange={(e) => handleChange("user_address", e.target.value)}
          />
        </div>

        {/* Phones */}
        <div className={s.formRow}>
          <div>
            <label className={s.formLabel}>Home Phone</label>
            <input
              className={s.formInput}
              onChange={(e) => handleChange("user_phone_home", e.target.value)}
            />
            {errors.user_phone_home && <p className={s.formError}>{errors.user_phone_home}</p>}
          </div>
          <div>
            <label className={s.formLabel}>Work Phone</label>
            <input
              className={s.formInput}
              onChange={(e) => handleChange("user_phone_work", e.target.value)}
            />
            {errors.user_phone_work && <p className={s.formError}>{errors.user_phone_work}</p>}
          </div>
        </div>

        {/* Admin Flag */}
        <div className={s.formGroup}>
          <label className={s.formLabel}>Admin User</label>
          <select
            className={s.formInput}
            onChange={(e) => handleChange("user_admin_flag", e.target.value)}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Customer ID */}
        <div className={s.formGroup}>
          <label className={s.formLabel}>Customer ID *</label>
          <input
            type="number"
            className={s.formInput}
            onChange={(e) => handleChange("customer_id", Number(e.target.value))}
          />
        </div>

        {/* Buttons */}
        <div className={s.formFooter}>
          <button type="button" onClick={onCancel} className={s.formCancelBtn}>
            <FiX /> Cancel
          </button>
          <button
            type="button"
            onClick={saveUser}
            className={s.formSubmitBtn}
            disabled={saving}
          >
            <FaFloppyDisk />
            {saving ? "Saving..." : "Save User"}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={s.popupOverlay}>
          <div className={s.popupBackdrop} />
          <div className={s.popupCard}>
            <FaCircleCheck className={s.popupIcon} />
            <h2 className={s.popupTitle}>User Saved!</h2>
            <p className={s.popupMessage}>
              User successfully saved to database.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
