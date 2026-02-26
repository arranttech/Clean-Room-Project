import { useState } from "react";
import { FiX } from "react-icons/fi";
import {
  FaFloppyDisk,
  FaCircleCheck,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";
import s from "./styles";
import { createUsers, createUserPassword } from "../../../backend/controller/controller";

type AddUserProps = {
  onCancel: () => void;
  onSaved: () => void;
};

type FormErrors = {
  user_first_name: string;
  user_last_name: string;
  user_email_id: string;
  user_id: string;
  user_phone_home: string;
  user_phone_work: string;
  created_by: string;
  updated_by: string;
  user_admin_flag: string;
  customer_id: string;
  password: string;
  confirmPassword: string;
};

export default function AddUser({ onCancel, onSaved }: AddUserProps) {
  const [form, setForm] = useState({
    user_first_name: "",
    user_last_name: "",
    user_id: "",
    user_email_id: "",
    user_address: "",
    user_phone_home: "",
    user_phone_work: "",
    created_by: "admin",
    updated_by: "admin",
    user_admin_flag: "No",
    customer_id: 0,
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({
    user_first_name: "",
    user_last_name: "",
    user_email_id: "",
    user_id: "",
    user_phone_home: "",
    user_phone_work: "",
    created_by: "",
    updated_by: "",
    user_admin_flag: "",
    customer_id: "",
    password: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const validatefirstName = (v: string) =>
    /^[A-Za-z\s]{3,30}$/.test(v) ? "" : "Enter First Name (3–30 letters only)";
  const validatelastName = (v: string) =>
    /^[A-Za-z\s]{3,30}$/.test(v) ? "" : "Enter Last Name (3–30 letters only)";
  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter valid email address";
  const validateUserId = (v: string) =>
    /^[A-Za-z0-9_]{3,10}$/.test(v)
      ? ""
      : "Enter User ID (3–10 chars, letters/numbers/_)";
  const validatePhone = (v: string) =>
    !v || /^\+?[0-9\s\-()]{7,20}$/.test(v) ? "" : "Enter valid phone number";

  const validatePassword = (v: string) => {
    if (!v) return "Password is required";
    if (v.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(v))
      return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(v)) return "Password must contain at least one number";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v))
      return "Password must contain at least one special character";
    return "";
  };

  const validateConfirmPassword = (v: string, pwd: string) => {
    if (!v) return "Please confirm your password";
    if (v !== pwd) return "Passwords do not match";
    return "";
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveUser = async () => {
    const firstNameErr = validatefirstName(form.user_first_name);
    const lastNameErr = validatelastName(form.user_last_name);
    const emailErr = validateEmail(form.user_email_id);
    const userIdErr = validateUserId(form.user_id);
    const homePhoneErr = validatePhone(form.user_phone_home);
    const workPhoneErr = validatePhone(form.user_phone_work);
    const passwordErr = validatePassword(form.password);
    const confirmPasswordErr = validateConfirmPassword(
      confirmPassword,
      form.password
    );

    if (
      firstNameErr ||
      lastNameErr ||
      emailErr ||
      userIdErr ||
      homePhoneErr ||
      workPhoneErr ||
      passwordErr ||
      confirmPasswordErr
    ) {
      setErrors((p) => ({
        ...p,
        user_first_name: firstNameErr,
        user_last_name: lastNameErr,
        user_email_id: emailErr,
        user_id: userIdErr,
        user_phone_home: homePhoneErr,
        user_phone_work: workPhoneErr,
        password: passwordErr,
        confirmPassword: confirmPasswordErr,
      }));
      return;
    }

    setSaving(true);

    try {
		//POST
      const payload = { ...form };
      const response = await createUsers(payload);
      console.log("Backend response:", response);

      // POST 2
      await createUserPassword({ user_login_id: response.userId, password: form.password });

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
        <div className={s.formRow}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>
              First Name <span className={s.formRequired}>*</span>
            </label>
            <input
              className={s.formInput}
              placeholder="Enter First Name"
              value={form.user_first_name}
              onChange={(e) => {
                handleChange("user_first_name", e.target.value);
                setErrors((p) => ({
                  ...p,
                  user_first_name: validatefirstName(e.target.value),
                }));
              }}
            />
            {errors.user_first_name && form.user_first_name.length !== 0 && (
              <p className={s.formError}>{errors.user_first_name}</p>
            )}
          </div>

          <div className={s.formGroup}>
            <label className={s.formLabel}>
              Last Name <span className={s.formRequired}>*</span>
            </label>
            <input
              className={s.formInput}
              placeholder="Enter Last Name"
              value={form.user_last_name}
              onChange={(e) => {
                handleChange("user_last_name", e.target.value);
                setErrors((p) => ({
                  ...p,
                  user_last_name: validatelastName(e.target.value),
                }));
              }}
            />
            {errors.user_last_name && form.user_last_name.length !== 0 && (
              <p className={s.formError}>{errors.user_last_name}</p>
            )}
          </div>
        </div>

        <div className={s.formRow}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>
              Email <span className={s.formRequired}>*</span>
            </label>
            <input
              type="email"
              className={s.formInput}
              placeholder="Enter Email Address"
              value={form.user_email_id}
              onChange={(e) => {
                handleChange("user_email_id", e.target.value);
                setErrors((p) => ({
                  ...p,
                  user_email_id: validateEmail(e.target.value),
                }));
              }}
            />
            {errors.user_email_id && form.user_email_id.length !== 0 && (
              <p className={s.formError}>{errors.user_email_id}</p>
            )}
          </div>

          <div className={s.formGroup}>
            <label className={s.formLabel}>
              User Id <span className={s.formRequired}>*</span>
            </label>
            <input
              type="text"
              className={s.formInput}
              placeholder="Enter User ID"
              value={form.user_id}
              onChange={(e) => {
                handleChange("user_id", e.target.value);
                setErrors((p) => ({
                  ...p,
                  user_id: validateUserId(e.target.value),
                }));
              }}
            />
            {errors.user_id && form.user_id.length !== 0 && (
              <p className={s.formError}>{errors.user_id}</p>
            )}
          </div>
        </div>

        <div className={s.formRow}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>
              Password <span className={s.formRequired}>*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={s.formInput}
                value={form.password}
                placeholder="Min 8 chars, uppercase, number, special"
                onChange={(e) => {
                  handleChange("password", e.target.value);
                  setErrors((p) => ({
                    ...p,
                    password: validatePassword(e.target.value),
                    confirmPassword:
                      confirmPassword.length > 0
                        ? validateConfirmPassword(confirmPassword, e.target.value)
                        : p.confirmPassword,
                  }));
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && form.password.length !== 0 && (
              <p className={s.formError}>{errors.password}</p>
            )}
          </div>

          <div className={s.formGroup}>
            <label className={s.formLabel}>
              Confirm Password <span className={s.formRequired}>*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={s.formInput}
                value={confirmPassword}
                placeholder="Re-enter your password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((p) => ({
                    ...p,
                    confirmPassword: validateConfirmPassword(e.target.value, form.password),
                  }));
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && confirmPassword.length !== 0 && (
              <p className={s.formError}>{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div className={s.formGroup}>
          <label className={s.formLabel}>
            Address <span className={s.formRequired}>*</span>
          </label>
          <textarea
            className={s.formTextarea}
            placeholder="Enter Address"
            value={form.user_address}
            cols={1}
            rows={1}
            onChange={(e) => handleChange("user_address", e.target.value)}
          />
        </div>

        <div className={s.formRow}>
          <div>
            <label className={s.formLabel}>Home Phone</label>
            <input
              className={s.formInput}
              placeholder="Enter Home Phone"
              onChange={(e) => {
                handleChange("user_phone_home", e.target.value);
                setErrors((p) => ({
                  ...p,
                  user_phone_home: validatePhone(e.target.value),
                }));
              }}
            />
            {errors.user_phone_home && (
              <p className={s.formError}>{errors.user_phone_home}</p>
            )}
          </div>
          <div>
            <label className={s.formLabel}>Work Phone</label>
            <input
              className={s.formInput}
              placeholder="Enter Work Phone"
              onChange={(e) => {
                handleChange("user_phone_work", e.target.value);
                setErrors((p) => ({
                  ...p,
                  user_phone_work: validatePhone(e.target.value),
                }));
              }}
            />
            {errors.user_phone_work && (
              <p className={s.formError}>{errors.user_phone_work}</p>
            )}
          </div>
        </div>

        <div className={s.formRow}>
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

          <div className={s.formGroup}>
            <label className={s.formLabel}>
              Customer ID <span className={s.formRequired}>*</span>
            </label>
            <input
              type="number"
              className={s.formInput}
              placeholder="Enter Customer ID"
              onChange={(e) =>
                handleChange("customer_id", Number(e.target.value))
              }
            />
          </div>
        </div>

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
