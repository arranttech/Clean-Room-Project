import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import {
  FaFloppyDisk,
  FaCircleCheck,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";
import s from "./styles";
import {
  createUsers,
  updateUser,
} from "../../../backend/controller/userController";
import { createUserPassword } from "../../../backend/controller/authContoller";
import { customerDetails } from "../../../backend/controller/customerController";
import Select from "react-select";
import { components } from "react-select";


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
  customer_ids: string;
  password: string;
  confirmPassword: string;
};

export default function AddUser({ user, onCancel, onSaved }: AddUserProps) {
  const isEditMode = !!user;

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
    customer_ids: [] as number[],
    password: "",
    status: "A",
  });

  useEffect(() => {
    if (user) {

      let ids: number[] = [];
      if (Array.isArray(user.customer_ids) && user.customer_ids.length > 0) {
        ids = user.customer_ids.map(Number);
      } else if (user.customer_id) {
        ids = String(user.customer_id).split(",").map(Number).filter(Boolean);
      }

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
        customer_ids: ids,
        password: "",
        status: user.status && user.status.trim() !== "" ? user.status : "A",
      });
    }
  }, [user]);

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
    customer_ids: "",
    password: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await customerDetails();
        const list = data.customers ?? data;
        setCustomers(list);
      } catch (err) {
        console.error("Failed to load customers", err);
      }
    };
    loadCustomers();
  }, []);

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
  const validateCustomerIds = (v: number[]) =>
    !v || v.length === 0 ? "Customer is required" : "";
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

  const saveUser = async () => {
    const firstNameErr = validatefirstName(form.user_first_name);
    const lastNameErr = validatelastName(form.user_last_name);
    const emailErr = validateEmail(form.user_email_id);
    const userIdErr = validateUserId(form.user_id);
    const homePhoneErr = validatePhone(form.user_phone_home);
    const workPhoneErr = validatePhone(form.user_phone_work);
    const customerIdErr = isEditMode
      ? ""
      : validateCustomerIds(form.customer_ids);
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
      customerIdErr ||
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
        customer_ids: customerIdErr,
        password: passwordErr,
        confirmPassword: confirmPasswordErr,
      }));
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      if (isEditMode) {
        await updateUser(user.user_login_id, { ...form });
        console.log("User updated successfully");
      } else {
        const payload = {
          user_first_name: form.user_first_name,
          user_last_name: form.user_last_name,
          user_id: form.user_id,
          user_email_id: form.user_email_id,
          user_address: form.user_address || "",
          user_phone_home: form.user_phone_home || "",
          user_phone_work: form.user_phone_work || "",
          created_by: "admin",
          updated_by: "admin",
          user_admin_flag: form.user_admin_flag,
          customer_ids: form.customer_ids,
          password: form.password,
          status: form.status,
        };

        console.log("FRONTEND PAYLOAD:", payload);

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

  const customerOptions = customers.map((c) => ({
    value: c.customer_id,
    label: `${c.customer_name}`,
    address: `${c.customer_address}`,
  }));
  const CustomOption = (props: any) => {
    const { data, isSelected } = props;

    return (
      <components.Option {...props}>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            onClick={(e) => e.stopPropagation()}
            style={{ marginRight: 8, marginTop: 4 }}
          />
          <div >
            <div style={{ fontWeight: "600", fontSize: "14px" }}>
              {data.label}
            </div>
            <div style={{ fontSize: "12px", color: "#0e0d0d" }}>
              {data.address}
            </div>
          </div>
        </div>
      </components.Option>
    );
  };
  const CustomValueContainer = (props: any) => {
    return (
      <components.ValueContainer {...props}>
        {props.children}
      </components.ValueContainer>
    );
  };
  const customStyles = {
    control: (base: any) => ({
      ...base,
      border: "none",
      boxShadow: "none",
      backgroundColor: "transparent",
      minHeight: "10px",
      height: "30px",
      cursor: "pointer",
      alignItems: "center",
    }),
    indicatorSeparator: () => ({
      display: "flex",
      height: "100%",
      alignItems: "center",
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: 0,
    }),
    placeholder: (base: any) => ({
      ...base,
      textAlign: "left",
      marginLeft: "2px",
    }),

    menuList: (base: any) => ({
      ...base,
      padding: "6px",
    }),

    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#84ade2"
        : state.isFocused
          ? "#dbeafe"
          : "#ffffff",
      color: "#1e293b",
      padding: "10px 12px",
      marginBottom: "6px",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "flex-start",
    }),


    valueContainer: (base: any) => ({
      ...base,
      padding: "0px 20px 2px  0px ",
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
      overflowY: "hidden",
      whiteSpace: "nowrap",
      gap: "6px",

      // Optional: nicer scrollbar
      scrollbarWidth: "thin",
      alignItems: "center",
      height: "100%",

    }),

    input: (base: any) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),


    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "#eb9147",
      borderRadius: "6px",

      alignItems: "center",
      flexShrink: 0,
    }),

    multiValueLabel: (base: any) => ({
      ...base,
      color: "#070a0e",
      fontWeight: 500,
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "#003366",
      ":hover": {
        backgroundColor: "#a9b4be",
        color: "#000",
      },
    }),
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
          <div>
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

          <div>
            <label className={s.formLabel}>
              Customer ID <span className={s.formRequired}>*</span>
            </label>
            <Select
              className={s.formInput}
              styles={customStyles}
              components={{
                Option: CustomOption,
              
              }}
              options={customerOptions}
              isMulti
              closeMenuOnSelect={false}
              
               menuPortalTarget={document.body}
              menuPosition="fixed"
              hideSelectedOptions={false}
              value={customerOptions.filter((opt) =>
                form.customer_ids.includes(opt.value)
              )}
              onChange={(selected: any) => {
                const values = selected
                  ? selected.map((s: any) => Number(s.value))
                  : [];
                handleChange("customer_ids", values);
                setErrors((p) => ({
                  ...p,
                  customer_ids:
                    values.length === 0 ? "Customer is required" : "",
                }));
              }}
              placeholder="Select customers..."
            />
            {errors.customer_ids && (
              <p className={s.formError}>{errors.customer_ids}</p>
            )}
          </div>
        </div>


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
    </div>
  );
}
