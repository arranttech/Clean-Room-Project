import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { FaFloppyDisk, FaCircleCheck } from "react-icons/fa6";
import s from "./styles";
import {
  customerInfo,
  updateCustomer,
} from "../../../backend/controller/customerController";

type Customer = {
  customer_id: number;
  customer_name: string;
  customer_email_id: string;
  customer_phone: string;
  customer_address: string;
  customers_additional_notes: string;
  status: string;
  created_at: string;
};

type AddCustomerProps = {
  customer?: Customer | null;
  onCancel: () => void;
  onSaved: () => void;
};

type FormErrors = {
  customerName: string;
  address: string;
  phone: string;
  email: string;
};

export default function AddCustomer({
  customer,
  onCancel,
  onSaved,
}: AddCustomerProps) {
  const isEditing = !!customer?.customer_id;

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [status, setStatus] = useState<"A" | "I">("A");
  const [saving, setSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    customerName: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (customer) {
      setCustomerName(customer.customer_name ?? "");
      setCustomerAddress(customer.customer_address ?? "");
      // convert phone to string in case DB returns a number
      setPhoneNumber(String(customer.customer_phone ?? ""));
      // convert email to lowercase so Joi doesn't reject XCV@GMAIL.COM
      setEmailAddress((customer.customer_email_id ?? "").toLowerCase());
      setAdditionalNotes(customer.customers_additional_notes ?? "");
      const st = customer.status;
      setStatus(!st || st.trim() === "" ? "A" : (st as "A" | "I"));
    } else {
      setCustomerName("");
      setCustomerAddress("");
      setPhoneNumber("");
      setEmailAddress("");
      setAdditionalNotes("");
      setStatus("A");
    }
    setErrors({ customerName: "", address: "", phone: "", email: "" });
  }, [customer]);

  const validateCustomerName = (v: string) =>
    /^[A-Za-z\s]{3,30}$/.test(v)
      ? ""
      : "Name must be 3-30 characters, letters and spaces only";
  const validateAddress = (v: string) =>
    /^.{1,50}$/.test(v) ? "" : "Address must be 1-50 characters";
  const validatePhone = (v: string) =>
    !v ? "" : /^\+?[0-9\s\-()]{7,20}$/.test(v) ? "" : "Invalid phone number";
  const validateEmail = (v: string) =>
    !v
      ? ""
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? ""
      : "Invalid email address";

  const isFormValid =
    !!customerName &&
    !errors.customerName &&
    !!customerAddress &&
    !errors.address &&
    (!phoneNumber || !errors.phone) &&
    (!emailAddress || !errors.email);

  const saveCustomer = async () => {
    const nameErr = validateCustomerName(customerName);
    const addrErr = validateAddress(customerAddress);
    const phoneErr = validatePhone(phoneNumber);
    const emailErr = validateEmail(emailAddress);
    if (nameErr || addrErr || phoneErr || emailErr) {
      setErrors({
        customerName: nameErr,
        address: addrErr,
        phone: phoneErr,
        email: emailErr,
      });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        customerName,
        phoneNumber: String(phoneNumber),
        customerAddress,
        emailAddress: emailAddress.toLowerCase(),
        additionalNotes,
        status,
      };
      if (isEditing) {
        await updateCustomer(customer!.customer_id, payload);
      } else {
        await customerInfo(payload);
      }
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        onSaved();
      }, 2000);
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className={s.formTitle}>
        {isEditing ? "Edit Customer" : "Add New Customer"}
      </h1>
      <div className={s.formCard}>
        <div className={s.formGroup}>
          <label className={s.formLabel}>
            Customer Name <span className={s.formRequired}>*</span>
          </label>
          <input
            type="text"
            className={s.formInput}
            placeholder="Enter Customer Name"
            value={customerName}
            minLength={3}
            maxLength={30}
            onChange={(e) => {
              const v = e.target.value;
              setCustomerName(v);
              setErrors((p) => ({
                ...p,
                customerName: validateCustomerName(v),
              }));
            }}
          />
          {errors.customerName && customerName.length > 0 && (
            <p className={s.formError}>{errors.customerName}</p>
          )}
        </div>

        <div className={s.formGroup}>
          <label className={s.formLabel}>
            Address <span className={s.formRequired}>*</span>
          </label>
          <textarea
            className={s.formTextarea}
            placeholder="Enter Customer Address"
            value={customerAddress}
            maxLength={50}
            onChange={(e) => {
              const v = e.target.value;
              setCustomerAddress(v);
              setErrors((p) => ({ ...p, address: validateAddress(v) }));
            }}
          />
          {errors.address && customerAddress.length > 0 && (
            <p className={s.formError}>{errors.address}</p>
          )}
        </div>

        <div className={s.formRow}>
          <div>
            <label className={s.formLabel}>
              Phone Number <span className={s.formRequired}>*</span>
            </label>
            <input
              type="tel"
              className={s.formInput}
              placeholder="Enter Phone Number"
              value={phoneNumber}
              minLength={7}
              maxLength={20}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9+\-() ]/g, "");
                setPhoneNumber(v);
                setErrors((p) => ({ ...p, phone: validatePhone(v) }));
              }}
            />
            {errors.phone && phoneNumber.length > 0 && (
              <p className={s.formError}>{errors.phone}</p>
            )}
          </div>
          <div>
            <label className={s.formLabel}>
              Email Address <span className={s.formRequired}>*</span>
            </label>
            <input
              type="email"
              className={s.formInput}
              placeholder="Enter Email ID"
              value={emailAddress}
              maxLength={30}
              onChange={(e) => {
                const v = e.target.value.toLowerCase();
                setEmailAddress(v);
                setErrors((p) => ({ ...p, email: validateEmail(v) }));
              }}
            />
            {errors.email && emailAddress.length > 0 && (
              <p className={s.formError}>{errors.email}</p>
            )}
          </div>
        </div>

        <div className={s.formGroup}>
          <label className={s.formLabel}>Status</label>
          <select
            className={s.formInput}
            value={status}
            onChange={(e) => setStatus(e.target.value as "A" | "I")}
          >
            <option value="A">Active</option>
            <option value="I">Inactive</option>
          </select>
        </div>

        <div className={s.formGroup}>
          <label className={s.formLabel}>Additional Notes</label>
          <textarea
            className={s.formTextarea}
            placeholder="Enter Additional Notes"
            value={additionalNotes}
            maxLength={200}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        </div>

        <div className={s.formDivider}>
          <div className={s.formFooter}>
            <button
              type="button"
              onClick={onCancel}
              className={s.formCancelBtn}
              disabled={saving}
            >
              <FiX className="text-base" /> Cancel
            </button>
            <button
              type="button"
              onClick={saveCustomer}
              className={`${s.formSubmitBtn} ${
                !isFormValid ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={saving || !isFormValid}
            >
              <FaFloppyDisk className="text-base" />
              {saving
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                ? "Update Customer"
                : "Save Customer"}
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className={s.popupOverlay}>
          <div className={s.popupBackdrop} />
          <div className={s.popupCard}>
            <FaCircleCheck className={s.popupIcon} />
            <h2 className={s.popupTitle}>
              {isEditing ? "Customer Updated!" : "Customer Saved!"}
            </h2>
            <p className={s.popupMessage}>
              {isEditing
                ? "Customer has been successfully updated."
                : "Customer has been successfully saved."}
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
