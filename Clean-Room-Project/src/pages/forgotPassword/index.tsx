import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiKey,
  FiX,
} from "react-icons/fi";
import { forgotPassword } from "../../backend/controller/userController";
import s from "./styles";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Auto dismiss popup after 4 seconds
  useEffect(() => {
    if (notFound) {
      const timer = setTimeout(() => setNotFound(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [notFound]);

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
    setNotFound(false);
    try {
      setLoading(true);
      await forgotPassword({ email });
      setSent(true);
    } catch (e: any) {
      if (e?.message?.includes("Too many requests")) {
        setEmailError("Too many attempts. Please try again after 15 minutes.");
      } else if (e?.message?.includes("No account found")) {
        setNotFound(true);
      } else {
        setEmailError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.pageBackground} />

      {/* Floating popup — top center, does not expand card */}
      {notFound && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-start gap-3 bg-white border border-red-200 shadow-xl rounded-xl px-4 py-3 w-[90%] max-w-[400px] animate-fade-in">
          <FiAlertCircle
            size={18}
            className="text-red-500 flex-shrink-0 mt-0.5"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-600">
              Account Not Found
            </p>
            <p className="text-xs text-red-500 mt-0.5">
              No account is registered with <strong>{email}</strong>.
            </p>
          </div>
          <button
            onClick={() => setNotFound(false)}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <FiX size={15} />
          </button>
        </div>
      )}

      <div className={s.card}>
        <div className={s.iconWrap}>
          <FiKey size={28} className="text-teal-600" />
        </div>

        <h1 className={s.title}>Forgot Password?</h1>
        <p className={s.subtitle}>
          Enter your email and we'll send you a reset link.
        </p>

        <hr className={s.divider} />

        {!sent ? (
          <>
            <div className={s.fieldGroup}>
              <label className={s.label}>Email Address</label>
              <div className={s.inputWrapper}>
                <FiMail size={16} className={s.inputIcon} />
                <input
                  type="email"
                  className={`${s.input} ${
                    emailError ? "border-red-400 focus:ring-red-300" : ""
                  }`}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                    setNotFound(false);
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

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={s.submitBtn}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        ) : (
          <div className={s.successWrap}>
            <div className={s.successIcon}>
              <FiCheckCircle size={28} className="text-green-500" />
            </div>
            <p className={s.successTitle}>Check your inbox!</p>
            <p className={s.successMsg}>
              A reset link has been sent to your email address.
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <button onClick={() => navigate("/login")} className={s.backBtn}>
            <FiArrowLeft size={15} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
