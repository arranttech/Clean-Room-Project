import { useState, useEffect } from "react";
import { FaFloppyDisk, FaCircleCheck } from "react-icons/fa6";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./styles";
import {
  customerInfo,
  getCustomerById,
} from "../../backend/controller/customerController";
import { getUserById } from "../../backend/controller/userController";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCustomer } from "../../redux/slices/customerSlice";
import { updateField } from "../../redux/slices/projectInfoSlice";

function CustomerInfoPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const fromCreateProject = location.state?.from === "create-project";

  const savedCustomerId = useAppSelector((state: any) => state.customer.customerId);
  const savedCustomerName = useAppSelector((state: any) => state.customer.customerName);
  const savedPhoneNumber = useAppSelector((state: any) => state.customer.phoneNumber);
  const savedCustomerAddress = useAppSelector((state: any) => state.customer.customerAddress);
  const savedEmailAddress = useAppSelector((state: any) => state.customer.emailAddress);
  const savedAdditionalNotes = useAppSelector((state: any) => state.customer.additionalNotes);
  const isSaved = useAppSelector((state: any) => state.customer.isSaved);
  const loggedInUserId = useAppSelector((state: any) => state.user?.user_login_id ?? null);

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loadingPrefill, setLoadingPrefill] = useState(true);

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    notes: "",
    email: "",
    phone: "",
  });

  // Prefill from Redux if already loaded (back navigation)
  useEffect(() => {
    if (savedCustomerId && savedCustomerName) {
      setCustomerName(savedCustomerName);
      setPhoneNumber(savedPhoneNumber || "");
      setCustomerAddress(savedCustomerAddress || "");
      setEmailAddress(savedEmailAddress || "");
      setAdditionalNotes(savedAdditionalNotes || "");
      setLoadingPrefill(false);
      return;
    }

    // Otherwise fetch from DB using user_login_id from Redux (rehydrated from localStorage)
    const prefillFromDB = async () => {
      try {
        const user_login_id = loggedInUserId;
        if (!user_login_id) { setLoadingPrefill(false); return; }

        // Step 1: fetch user row to get customer_id
        const userRes = await getUserById(user_login_id);
        const customer_id = userRes?.user?.customer_id ?? userRes?.customer_id ?? null;
        if (!customer_id) { setLoadingPrefill(false); return; }

        // Step 2: fetch customer details by customer_id
        const customerRes = await getCustomerById(customer_id);
        const c = customerRes?.customer;
        if (!c) { setLoadingPrefill(false); return; }

        // Prefill form
        setCustomerName(c.customer_name || "");
        setPhoneNumber(c.customer_phone || "");
        setCustomerAddress(c.customer_address || "");
        setEmailAddress(c.customer_email_id || "");
        setAdditionalNotes(c.customers_additional_notes || "");

        // Also store in Redux so Dashboard and other pages have it
        dispatch(setCustomer({
          customerId: customer_id,
          customerName: c.customer_name || "",
          phoneNumber: c.customer_phone || "",
          customerAddress: c.customer_address || "",
          emailAddress: c.customer_email_id || "",
          additionalNotes: c.customers_additional_notes || "",
        }));
      } catch (error) {
        console.error("Failed to prefill customer info:", error);
      } finally {
        setLoadingPrefill(false);
      }
    };

    prefillFromDB();
  }, []);

  const validateCustomerName = (name: string) =>
    /^[A-Za-z\s]{3,30}$/.test(name)
      ? ""
      : "Name must be 3–30 characters and contain only letters and spaces";
  const validateAddress = (address: string) =>
    /^.{1,50}$/.test(address) ? "" : "Address must be 1–50 characters";
  const validateNotes = (notes: string) =>
    /^.{0,200}$/.test(notes) ? "" : "Additional notes cannot exceed 200 characters";
  const validatePhone = (phone: string) => {
    if (!phone) return "";
    return /^\+?[0-9\s\-()]{7,20}$/.test(phone) ? "" : "Invalid phone number";
  };
  const validateEmail = (email: string) => {
    if (!email) return "";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Invalid email address";
  };

  const isFormValid = (() => {
    if (!customerName || errors.name) return false;
    if (!customerAddress || errors.address) return false;
    if (phoneNumber && errors.phone) return false;
    if (emailAddress && errors.email) return false;
    if (additionalNotes && errors.notes) return false;
    return true;
  })();

  const saveCustomerInfo = async () => {
    if (isSaved && savedCustomerId) {
      dispatch(updateField({ field: "customerName", value: customerName }));
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        if (fromCreateProject) {
          navigate("/project-info", {
            state: { customerName, phoneNumber, customerAddress, emailAddress, additionalNotes },
          });
        } else {
          navigate("/dashboard");
        }
      }, 2000);
      return;
    }

    try {
      const data = await customerInfo({
        customerName,
        phoneNumber,
        customerAddress,
        emailAddress,
        additionalNotes,
      });
      const newCustomerId = data?.applicationId;

      dispatch(setCustomer({
        customerId: newCustomerId,
        customerName,
        phoneNumber,
        customerAddress,
        emailAddress,
        additionalNotes,
      }));
      dispatch(updateField({ field: "customerName", value: customerName }));

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        if (fromCreateProject) {
          navigate("/project-info", {
            state: { customerName, phoneNumber, customerAddress, emailAddress, additionalNotes },
          });
        } else {
          navigate("/dashboard");
        }
      }, 2000);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  if (loadingPrefill) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500 text-sm">
        Loading customer details...
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <h1 className={styles.title}>Customer Information</h1>
        <h3 className={styles.headerText}>
          Please provide the basic customer details to get started
        </h3>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Customer Information</div>
        <hr className={styles.divider} />

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={isSaved ? styles.inputDisabled : styles.input}
            value={customerName}
            disabled={isSaved}
            onChange={(e) => {
              setCustomerName(e.target.value);
              setErrors((p) => ({ ...p, name: validateCustomerName(e.target.value) }));
            }}
            minLength={3}
            maxLength={30}
            placeholder="Enter Customer Name"
          />
          {errors.name && customerName.length !== 0 && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Phone Number <span className="text-red-500">*</span></label>
          <input
            className={isSaved ? styles.inputDisabled : styles.input}
            value={phoneNumber}
            disabled={isSaved}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setErrors((p) => ({ ...p, phone: validatePhone(e.target.value) }));
            }}
            placeholder="Enter Phone Number"
            minLength={7}
            maxLength={20}
          />
          {errors.phone && phoneNumber.length !== 0 && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Customer Address <span className="text-red-500">*</span>
          </label>
          <input
            className={isSaved ? styles.inputDisabled : styles.input}
            value={customerAddress}
            disabled={isSaved}
            onChange={(e) => {
              setCustomerAddress(e.target.value);
              setErrors((p) => ({ ...p, address: validateAddress(e.target.value) }));
            }}
            placeholder="Enter Customer Address"
            maxLength={100}
          />
          {errors.address && customerAddress.length !== 0 && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email Address <span className="text-red-500">*</span></label>
          <input
            type="email"
            className={isSaved ? styles.inputDisabled : styles.input}
            value={emailAddress}
            disabled={isSaved}
            onChange={(e) => {
              setEmailAddress(e.target.value);
              setErrors((p) => ({ ...p, email: validateEmail(e.target.value) }));
            }}
            placeholder="Enter Email ID"
            maxLength={30}
          />
          {errors.email && emailAddress.length !== 0 && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Additional Notes</label>
          <input
            className={isSaved ? styles.inputDisabled : styles.input}
            value={additionalNotes}
            disabled={isSaved}
            onChange={(e) => {
              setAdditionalNotes(e.target.value);
              setErrors((p) => ({ ...p, notes: validateNotes(e.target.value) }));
            }}
            placeholder="Enter Additional Notes"
            maxLength={200}
          />
          {errors.notes && additionalNotes.length !== 0 && (
            <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <Link to="/dashboard" className={styles.cancelLink}>
          Cancel
        </Link>
        <div className="flex flex-col items-end gap-2">
          <button
            className={`${styles.nextLink} ${!isFormValid || isSaved ? styles.disabled : ""}`}
            disabled={isSaved}
            onClick={() => {
              if (!isFormValid) {
                alert("Please fill all required fields correctly before proceeding.");
              } else {
                saveCustomerInfo();
              }
            }}
          >
            <FaFloppyDisk /> Save Customer Profile
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBackdrop} />
          <div className={styles.popupCard}>
            <FaCircleCheck className={styles.popupIcon} />
            <h2 className={styles.popupTitle}>Details Saved!</h2>
            <p className={styles.popupMessage}>
              Customer information has been successfully saved to the database.
            </p>
            <div className={styles.popupProgressWrap}>
              <div className={styles.popupProgressBar} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerInfoPage;
