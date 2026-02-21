
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { FaFloppyDisk, FaCircleCheck } from "react-icons/fa6";
import s from "./usersDesign";
import { createUsers } from "../../../backend/controller/controller";



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
    //Created_date: string;
    created_by: string;
    updated_by: string;
    //updated_date: string;
    user_admin_flag: string;
    customer_id: string;
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
       // created_date: "",
        created_by: "admin",
        updated_by: "admin",
       // updated_date: "",
        user_admin_flag: "No",
        customer_id: 0,
    });

    const [errors, setErrors] = useState<FormErrors>({
        user_first_name: "",
        user_last_name: "",
        user_email_id: "",
        user_id:"",
        user_phone_home: "",
        user_phone_work: "",
       // Created_date: "",
        created_by: "",
        updated_by: "",
       // updated_date: "",
        user_admin_flag: "",
        customer_id: "",
    });

    const [saving, setSaving] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    // ---------- Validation ----------
    const validatefirstName = (v: string) =>
        /^[A-Za-z\s]{3,30}$/.test(v)
            ? ""
            : "Enter First Name (3–30 letters only)";
            const validatelastName = (v: string) =>
        /^[A-Za-z\s]{3,30}$/.test(v)
            ? ""
            : "Enter Last Name (3–30 letters only)";

    const validateEmail = (v: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
            ? ""
            : "Enter valid email address";

    const validateUserId = (v: string) =>
        /^[A-Za-z0-9_]{3,10}$/.test(v)
            ? ""
            : "Enter User ID (3–10 chars, letters/numbers/_)";

    const validatePhone = (v: string) =>
        !v || /^\+?[0-9\s\-()]{7,20}$/.test(v)
            ? ""
            : "Enter valid phone number";

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

        if (firstNameErr || lastNameErr || emailErr || homePhoneErr || workPhoneErr) {
            setErrors((p) => ({
                ...p,
                user_first_name: firstNameErr,
                user_last_name: lastNameErr,
                user_email_id: emailErr,
                user_id: userIdErr,
                user_phone_home: homePhoneErr,
                user_phone_work: workPhoneErr,
            }));
            return;
        }

        setSaving(true);

        try {
           
            const payload = {
                ...form,
                
            };

            const response = await createUsers(payload);
             console.log("Backend response:", response);

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
                                user_first_name: validatefirstName(e.target.value),
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
                                user_last_name: validatelastName(e.target.value),
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

                 <div className={s.formGroup}>
                    <label className={s.formLabel}>User Id *</label>
                    <input
                        type="text"
                        className={s.formInput}
                        value={form.user_id}
                        onChange={(e) => {
                            handleChange("user_id", e.target.value);
                            setErrors((p) => ({
                                ...p,
                                user_id: validateUserId(e.target.value),
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
                            onChange={(e) => {handleChange("user_phone_home", e.target.value)
                                setErrors((p) => ({
                                ...p,
                                user_phone_home: validatePhone(e.target.value),
                            }));
                            }}
                        />
                        {errors.user_phone_home && <p className={s.formError}>{errors.user_phone_home}</p>}
                    </div>
                    <div>
                        <label className={s.formLabel}>Work Phone</label>
                        <input
                            className={s.formInput}
                            onChange={(e) => {handleChange("user_phone_work", e.target.value)
                                setErrors((p) => ({
                                ...p,
                                user_phone_work: validatePhone(e.target.value),
                            }));
                            }}
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