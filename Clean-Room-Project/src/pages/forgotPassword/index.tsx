import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiKey,
} from "react-icons/fi";
import s from "./styles";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  const validateEmail = (val: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val.trim()) {
      setEmailError("Email address cannot be empty.");
      return false;
    }
    if (!emailRegex.test(val.trim())) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) return;
    try {
      setLoading(true);
      setSent(true);
    } catch (e) {
      console.error("Failed to send reset email:", e);
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>

      <div className={s.pageBackground} />

      <div className={s.card}>

        {/* Key Icon */}
        <div className={s.iconWrap}>
          <FiKey size={28} className="text-teal-600" />
        </div>

        {/* Title */}
        <h1 className={s.title}>Forgot Password?</h1>
        <p className={s.subtitle}>
          Enter your email and we'll send you a reset link.
        </p>

        <hr className={s.divider} />

        {!sent ? (
          <>
            {/* Email Input */}
            <div className={s.fieldGroup}>
              <label className={s.label}>Email Address</label>
              <div className={s.inputWrapper}>
                <FiMail size={16} className={s.inputIcon} />
                <input
                  type="email"
                  className={`${s.input} ${emailError ? "border-red-400 focus:ring-red-300" : ""}`}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
              {emailError && (
                <p className={s.errorText}>
                  <FiAlertCircle size={12} />
                  {emailError}
                </p>
              )}
            </div>

            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={s.submitBtn}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        ) : (
          /* Success State */
          <div className={s.successWrap}>
            <div className={s.successIcon}>
              <FiCheckCircle size={28} className="text-green-500" />
            </div>
            <p className={s.successTitle}>Reset link sent!</p>
            <p className={s.successMsg}>
              We've sent a reset link to{" "}
              <span className={s.successEmail}>{email}</span>. Check your
              inbox.
            </p>
          </div>
        )}

        {/* Back to Login */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/login")}
            className={s.backBtn}
          >
            <FiArrowLeft size={15} />
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}