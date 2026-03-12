import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import {
  FaFloppyDisk,
  FaCircleCheck,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";
import s from "./styles";
import Select, { components } from "react-select";
import {
  createUsers,
  updateUser,
} from "../../../backend/controller/userController";
import { customerDetails } from "../../../backend/controller/customerController";
import { createUserPassword } from "../../../backend/controller/authContoller";

type AddUserProps = {
  user?: any;
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

export default function AddUser({ user, onCancel, onSaved }: AddUserProps) {
  const isEditMode = !!user;

  const CheckboxOption = (props: any) => (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        readOnly
        className="mr-2"
        style={{ accentColor: "#2563eb" }}
      />
      <span>{props.label}</span>
    </components.Option>
  );

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
    customer_id: "" as number | "",
    password: "",
    status: "A",
  });

  // Preload all fields from DB when in edit mode
  useEffect(() => {
    if (user) {
      setForm({
        user_first_name: user.user_first_name || "",
        user_last_name: user.user_last_name || "",
        user_id: user.user_id || "",
        user_email_id: user.user_email_id || "",
        user_address: user.user_address || "",
        user_phone_home: user.user_phone_home || "",
        user_phone_work: user.user_phone_work || "",
        created_by: user.created_by || "admin",
        updated_by: "admin",
        user_admin_flag: user.user_admin_flag === "Y" ? "Yes" : "No",
        customer_id: user.customer_id ?? "",
        password: "",
        status: user.status && user.status.trim() !== "" ? user.status : "A",
      });
    }
  }, [user]);

  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);

  const customerOptions = [
    { value: "ALL", label: "All" },
    ...customers.map((c: any) => ({
      value: c.customer_id,
      label: `${c.customer_id} - ${c.customer_name || ""}`.trim(),
    })),
  ];

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const result = await customerDetails();
        setCustomers(result?.customers || []);
      } catch (err) {
        console.error("Failed to load customers", err);
      }
    };

    loadCustomers();
  }, []);

  useEffect(() => {
    if (!form.customer_id || customers.length === 0) return;

    const matched = customerOptions.find(
      (opt) => String(opt.value) === String(form.customer_id)
    );

    if (matched) {
      setSelectedCustomers([matched]);
    }
  }, [form.customer_id, customers]);

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
  const [saveError, setSaveError] = useState("");

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

  const handleChange = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleCustomerSelectChange = (options: any) => {
    const picked = options || [];
    const allOption = customerOptions.find((opt) => opt.value === "ALL");
    const realOptions = customerOptions.filter((opt) => opt.value !== "ALL");

    const hasAll = picked.some((opt: any) => opt.value === "ALL");
    let nextSelected = picked.filter((opt: any) => opt.value !== "ALL");

    if (hasAll) {
      nextSelected = realOptions;
    }

    setSelectedCustomers(nextSelected);

    const firstSelected = nextSelected[0];
    handleChange("customer_id", firstSelected ? Number(firstSelected.value) : "");
  };

  useEffect(() => {
    const firstSelected = selectedCustomers.find((opt: any) => opt.value !== "ALL");
    if (!firstSelected) return;

    if (String(form.customer_id) !== String(firstSelected.value)) {
      handleChange("customer_id", Number(firstSelected.value));
    }
  }, [selectedCustomers]);

  const saveUser = async () => {
    const firstNameErr = validatefirstName(form.user_first_name);
    const lastNameErr = validatelastName(form.user_last_name);
    const emailErr = validateEmail(form.user_email_id);
    const userIdErr = validateUserId(form.user_id);
    const homePhoneErr = validatePhone(form.user_phone_home);
    const workPhoneErr = validatePhone(form.user_phone_work);
    const passwordErr = isEditMode ? "" : validatePassword(form.password);
    const confirmPasswordErr = isEditMode
      ? ""
      : validateConfirmPassword(confirmPassword, form.password);

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
    setSaveError("");
    try {
      const selectedCustomerIds = selectedCustomers
        .map((opt: any) => Number(opt.value))
        .filter((id: number) => Number.isFinite(id) && id > 0);

      const payload = {
        ...form,
        customer_ids: selectedCustomerIds,
        customer_id: selectedCustomerIds[0] ?? null,
      };

      if (isEditMode) {
        await updateUser(user.user_login_id, payload);
        console.log("User updated successfully");
      } else {
        const response = await createUsers(payload);
        if (!response?.userId)
          throw new Error("User creation failed — no userId returned");
        await createUserPassword({
          user_login_id: response.userId,
          password: form.password,
        });
        console.log("User created successfully");
      }

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        onSaved();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setSaveError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className={s.formTitle}>
        {isEditMode ? "Edit User" : "Add New User"}
      </h1>
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
              disabled={isEditMode}
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

        {!isEditMode && (
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
                          ? validateConfirmPassword(
                              confirmPassword,
                              e.target.value
                            )
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
                      confirmPassword: validateConfirmPassword(
                        e.target.value,
                        form.password
                      ),
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
        )}

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
            <label className={s.formLabel}>
              Home Phone <span className={s.formRequired}>*</span>
            </label>
            <input
              className={s.formInput}
              placeholder="Enter Home Phone"
              value={form.user_phone_home}
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
            <label className={s.formLabel}>
              Work Phone <span className={s.formRequired}>*</span>
            </label>
            <input
              className={s.formInput}
              placeholder="Enter Work Phone"
              value={form.user_phone_work}
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
            <label className={s.formLabel}>
              Admin User <span className={s.formRequired}>*</span>
            </label>
            <select
              className={s.formInput}
              value={form.user_admin_flag}
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
            <Select
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isDisabled={isEditMode}
              options={customerOptions}
              value={selectedCustomers}
              onChange={handleCustomerSelectChange}
              components={{ Option: CheckboxOption }}
              styles={{
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#ccd2db",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: "#111827",
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: "#111827",
                  ":hover": {
                    backgroundColor: "#ccd2db",
                    color: "#111827",
                  },
                }),
              }}
              isOptionSelected={(option) => {
                if (option.value === "ALL") {
                  const realOptions = customerOptions.filter((opt) => opt.value !== "ALL");
                  return (
                    realOptions.length > 0 &&
                    selectedCustomers.length === realOptions.length
                  );
                }

                return selectedCustomers.some(
                  (selected: any) => String(selected.value) === String(option.value)
                );
              }}
              placeholder="Select Customer IDs"
            />
          </div>
        </div>

        {/* Status — in add mode defaults to Active, in edit mode shows exact DB value */}
        <div className={s.formRow}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Status</label>
            <select
              className={s.formInput}
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="A">Active</option>
              <option value="I">Inactive</option>
            </select>
          </div>
        </div>

        {saveError && (
          <p className="text-red-500 text-sm text-right mb-3">{saveError}</p>
        )}

        <div className={s.formFooter}>
          <button
            type="button"
            onClick={onCancel}
            className={s.formCancelBtn}
            disabled={saving}
          >
            <FiX /> Cancel
          </button>
          <button
            type="button"
            onClick={saveUser}
            className={s.formSubmitBtn}
            disabled={saving}
          >
            <FaFloppyDisk />
            {saving
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
              ? "Update User"
              : "Save User"}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={s.popupOverlay}>
          <div className={s.popupBackdrop} />
          <div className={s.popupCard}>
            <FaCircleCheck className={s.popupIcon} />
            <h2 className={s.popupTitle}>
              {isEditMode ? "User Updated!" : "User Saved!"}
            </h2>
            <p className={s.popupMessage}>
              {isEditMode
                ? "User has been successfully updated."
                : "User has been successfully saved."}
            </p>
            <div className={s.popupProgressWrap}>
              <div className={s.popupProgressBar} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
