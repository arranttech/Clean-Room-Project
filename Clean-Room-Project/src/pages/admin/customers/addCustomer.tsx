import { useState } from "react";
import { FiX } from "react-icons/fi";
import { FaFloppyDisk, FaCircleCheck } from "react-icons/fa6";
import s from "./customersDesign";
import { customerInfo } from "../../../backend/controller/controller";

type AddCustomerProps = {
  onCancel: () => void;
  onSaved: () => void;
};

type FormErrors = {
  customerName: string;
  address: string;
  phone: string;
  email: string;
};

export default function AddCustomer({ onCancel, onSaved }: AddCustomerProps) {
  const [customerName, setCustomerName]       = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [phoneNumber, setPhoneNumber]         = useState("");
  const [emailAddress, setEmailAddress]       = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [saving, setSaving]                   = useState(false);
  const [showPopup, setShowPopup]             = useState(false);
  const [errors, setErrors]                   = useState<FormErrors>({
    customerName: "", address: "", phone: "", email: "",
  });

  // --- Validation (same as CustomerInfoPage) ---
  const validateCustomerName = (v: string) =>
    /^[A-Za-z\s]{3,30}$/.test(v)
      ? ""
      : "Name must be 3–30 characters and contain only letters and spaces";

  const validateAddress = (v: string) =>
    /^.{1,50}$/.test(v) ? "" : "Address must be 1–50 characters";

  const validatePhone = (v: string) => {
    if (!v) return "";
    return /^\+?[0-9\s\-()]{7,20}$/.test(v) ? "" : "Invalid phone number";
  };

  const validateEmail = (v: string) => {
    if (!v) return "";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Invalid email address";
  };

  const isFormValid =
    !!customerName && !errors.customerName &&
    !!customerAddress && !errors.address &&
    (!phoneNumber || !errors.phone) &&
    (!emailAddress || !errors.email);

  const saveCustomer = async () => {
    const nameErr  = validateCustomerName(customerName);
    const addrErr  = validateAddress(customerAddress);
    const phoneErr = validatePhone(phoneNumber);
    const emailErr = validateEmail(emailAddress);
    if (nameErr || addrErr || phoneErr || emailErr) {
      setErrors({ customerName: nameErr, address: addrErr, phone: phoneErr, email: emailErr });
      return;
    }
    setSaving(true);
    try {
      // Same payload as CustomerInfoPage — no admin_user_id, backend auto-generates it
      const data = await customerInfo({
        customerName,
        phoneNumber,
        customerAddress,
        emailAddress,
        additionalNotes,
      });
      console.log(data);
      setShowPopup(true);
      setTimeout(() => { setShowPopup(false); onSaved(); }, 2000);
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className={s.formTitle}>Add New Customer</h1>
      <div className={s.formCard}>

        <div className={s.formGroup}>
          <label className={s.formLabel}>Customer Name <span className={s.formRequired}>*</span></label>
          <input type="text" className={s.formInput} placeholder="Enter Customer Name"
            value={customerName} minLength={3} maxLength={30}
            onChange={(e) => { const v = e.target.value; setCustomerName(v); setErrors((p) => ({ ...p, customerName: validateCustomerName(v) })); }}
          />
          {errors.customerName && customerName.length > 0 && <p className={s.formError}>{errors.customerName}</p>}
        </div>

        <div className={s.formGroup}>
          <label className={s.formLabel}>Address <span className={s.formRequired}>*</span></label>
          <textarea className={s.formTextarea} placeholder="Enter Customer Address"
            value={customerAddress} maxLength={50}
            onChange={(e) => { const v = e.target.value; setCustomerAddress(v); setErrors((p) => ({ ...p, address: validateAddress(v) })); }}
          />
          {errors.address && customerAddress.length > 0 && <p className={s.formError}>{errors.address}</p>}
        </div>

        <div className={s.formRow}>
          <div>
            <label className={s.formLabel}>Phone Number</label>
            <input type="tel" className={s.formInput} placeholder="Enter Phone Number"
              value={phoneNumber} minLength={7} maxLength={20}
              onChange={(e) => { const v = e.target.value.replace(/[^0-9+\-() ]/g, ""); setPhoneNumber(v); setErrors((p) => ({ ...p, phone: validatePhone(v) })); }}
            />
            {errors.phone && phoneNumber.length > 0 && <p className={s.formError}>{errors.phone}</p>}
          </div>
          <div>
            <label className={s.formLabel}>Email Address</label>
            <input type="email" className={s.formInput} placeholder="Enter Email ID"
              value={emailAddress} maxLength={30}
              onChange={(e) => { const v = e.target.value; setEmailAddress(v); setErrors((p) => ({ ...p, email: validateEmail(v) })); }}
            />
            {errors.email && emailAddress.length > 0 && <p className={s.formError}>{errors.email}</p>}
          </div>
        </div>

        <div className={s.formGroup}>
          <label className={s.formLabel}>Additional Notes</label>
          <textarea className={s.formTextarea} placeholder="Enter Additional Notes"
            value={additionalNotes} maxLength={200}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        </div>

        <div className={s.formDivider}>
          <div className={s.formFooter}>
            <button type="button" onClick={onCancel} className={s.formCancelBtn} disabled={saving}>
              <FiX className="text-base" /> Cancel
            </button>
            <button type="button" onClick={saveCustomer}
              className={`${s.formSubmitBtn} ${!isFormValid ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={saving}
            >
              <FaFloppyDisk className="text-base" />
              {saving ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className={s.popupOverlay}>
          <div className={s.popupBackdrop} />
          <div className={s.popupCard}>
            <FaCircleCheck className={s.popupIcon} />
            <h2 className={s.popupTitle}>Customer Saved!</h2>
            <p className={s.popupMessage}>Customer has been successfully saved to the database.</p>
            <div className={s.popupProgressWrap}><div className={s.popupProgressBar} /></div>
          </div>
        </div>
      )}
    </div>
  );
}