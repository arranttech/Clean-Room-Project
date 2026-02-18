import { useState } from "react";
import { FaFloppyDisk } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import styles from "./customerInfo";
import { customerInfo } from "../../backend/controller/controller";
import { useAppDispatch } from "../../redux/hooks";
import { updateField } from "../../redux/slices/projectInfoSlice";

function CustomerInfoPage() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	// --- Local State (no Redux) ---
	const [customerName, setCustomerName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [customerAddress, setCustomerAddress] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [additionalNotes, setAdditionalNotes] = useState("");
	const [showPopup, setShowPopup] = useState(false);

	// --- Validation State ---
	const [errors, setErrors] = useState({
		name: "",
		address: "",
		notes: "",
		email: "",
		phone: "",
	});

	// --- Validation ---
	const validateCustomerName = (name: string) =>
		/^[A-Za-z\s]{3,30}$/.test(name)
			? ""
			: "Name must be 3–30 characters and contain only letters and spaces";

	const validateAddress = (address: string) =>
		/^.{1,50}$/.test(address) ? "" : "Address must be 1–50 characters";

	const validateNotes = (notes: string) =>
		/^.{0,200}$/.test(notes)
			? ""
			: "Additional notes cannot exceed 200 characters";

	const validatePhone = (phone: string) => {
		if (!phone) return "";
		return /^\+?[0-9\s\-()]{7,20}$/.test(phone) ? "" : "Invalid phone number";
	};

	const validateEmail = (email: string) => {
		if (!email) return "";
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
			? ""
			: "Invalid email address";
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
		const payload = {
			customerName,
			phoneNumber,
			customerAddress,
			emailAddress,
			additionalNotes,
		};
		// Dispatch customerName to Redux immediately for uniqueId generation
		dispatch(updateField({ field: "customerName", value: customerName }));
		try {
			const data = await customerInfo(payload);
			console.log(data);
			setShowPopup(true);
			setTimeout(() => {
				setShowPopup(false);
				// Navigate to project-info passing all customer fields via router state
				navigate("/project-info", {
					state: {
						customerName,
						phoneNumber,
						customerAddress,
						emailAddress,
						additionalNotes,
					},
				});
			}, 2000);
		} catch (error) {
			console.error((error as Error).message);
		}
	};

	return (
		<div className={styles.wrapper}>
			{/* Header */}
			<div className={styles.top}>
				<h1 className={styles.title}>Customer Information</h1>
				<h3 className={styles.headerText}>
					Please provide the basic customer details to get started
				</h3>
			</div>

			{/* Card */}
			<div className={styles.card}>
				<div className={styles.cardTitle}>Customer Information</div>
				<hr className={styles.divider} />

				{/* Customer Name */}
				<div className={styles.fieldGroup}>
					<label className={styles.label}>
						Customer Name <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						className={styles.input}
						value={customerName}
						onChange={(e) => {
							const value = e.target.value;
							setCustomerName(value);
							setErrors((prev) => ({
								...prev,
								name: validateCustomerName(value),
							}));
						}}
						minLength={3}
						maxLength={30}
						placeholder="Enter Customer Name"
					/>
					{errors.name && customerName.length !== 0 && (
						<p className="text-red-500 text-xs mt-1">{errors.name}</p>
					)}
				</div>

				{/* Phone Number */}
				<div className={styles.fieldGroup}>
					<label className={styles.label}>Phone Number</label>
					<input
						className={styles.input}
						value={phoneNumber}
						onChange={(e) => {
							const value = e.target.value;
							setPhoneNumber(value);
							setErrors((prev) => ({ ...prev, phone: validatePhone(value) }));
						}}
						placeholder="Enter Phone Number"
						minLength={7}
						maxLength={20}
					/>
					{errors.phone && phoneNumber.length !== 0 && (
						<p className="text-red-500 text-xs mt-1">{errors.phone}</p>
					)}
				</div>

				{/* Customer Address */}
				<div className={styles.fieldGroup}>
					<label className={styles.label}>
						Customer Address <span className="text-red-500">*</span>
					</label>
					<input
						className={styles.input}
						value={customerAddress}
						onChange={(e) => {
							const value = e.target.value;
							setCustomerAddress(value);
							setErrors((prev) => ({
								...prev,
								address: validateAddress(value),
							}));
						}}
						placeholder="Enter Customer Address"
						maxLength={100}
					/>
					{errors.address && customerAddress.length !== 0 && (
						<p className="text-red-500 text-xs mt-1">{errors.address}</p>
					)}
				</div>

				{/* Email Address */}
				<div className={styles.fieldGroup}>
					<label className={styles.label}>Email Address</label>
					<input
						type="email"
						className={styles.input}
						value={emailAddress}
						onChange={(e) => {
							const value = e.target.value;
							setEmailAddress(value);
							setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
						}}
						placeholder="Enter Email ID"
						maxLength={30}
					/>
					{errors.email && emailAddress.length !== 0 && (
						<p className="text-red-500 text-xs mt-1">{errors.email}</p>
					)}
				</div>

				{/* Additional Notes */}
				<div className={styles.fieldGroup}>
					<label className={styles.label}>Additional Notes</label>
					<input
						className={styles.input}
						value={additionalNotes}
						onChange={(e) => {
							const value = e.target.value;
							setAdditionalNotes(value);
							setErrors((prev) => ({ ...prev, notes: validateNotes(value) }));
						}}
						placeholder="Enter Additional Notes"
						maxLength={200}
					/>
					{errors.notes && additionalNotes.length !== 0 && (
						<p className="text-red-500 text-xs mt-1">{errors.notes}</p>
					)}
				</div>
			</div>

			{/* Footer */}
			<div className={styles.footer}>
				<Link to="/dashboard" className={styles.cancelLink}>
					Cancel
				</Link>
				<button
					className={`${styles.nextLink} ${!isFormValid ? styles.disabled : ""}`}
					onClick={() => {
						if (!isFormValid) {
							alert(
								"Please fill all required fields correctly before proceeding."
							);
						} else {
							saveCustomerInfo();
						}
					}}
				>
					<FaFloppyDisk />
					Save Customer Profile
				</button>
			</div>
			{/* Success Popup */}
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