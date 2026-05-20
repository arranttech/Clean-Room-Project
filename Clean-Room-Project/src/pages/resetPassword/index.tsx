import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import {
  verifyResetToken,
  resetPassword,
} from "../../backend/controller/userController";
import s from "./styles";

// Password validation rules
const getPasswordErrors = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("At least one number");
  if (!/[^A-Za-z0-9]/.test(password))
    errors.push("At least one special character");
  return errors;
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Token comes from URL: /reset-password?token=abc123
  const token = searchParams.get("token") || "";

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [tokenError, setTokenError] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPw, setShowNewPw] = useState<boolean>(false);
  const [showConfirmPw, setShowConfirmPw] = useState<boolean>(false);
  const [newPasswordErrors, setNewPasswordErrors] = useState<string[]>([]);
  const [confirmError, setConfirmError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // On page load — verify token by calling GET /v1/auth/verify-reset-token/:token
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setTokenError("No reset token found. Please request a new link.");
      return;
    }
    const verify = async () => {
      try {
        const res = await verifyResetToken(token);
        if (res?.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setTokenError(res?.message || "Invalid or expired reset link.");
        }
      } catch {
        setTokenValid(false);
        setTokenError("Invalid or expired reset link.");
      }
    };
    verify();
  }, [token]);

  const handleReset = async () => {
    let hasError = false;

    // Validate new password rules
    const pwErrors = getPasswordErrors(newPassword);
    if (pwErrors.length > 0) {
      setNewPasswordErrors(pwErrors);
      hasError = true;
    } else {
      setNewPasswordErrors([]);
    }

    // Validate confirm password matches
    if (!confirmPassword) {
      setConfirmError("Please confirm your new password.");
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      hasError = true;
    } else {
      setConfirmError("");
    }

    if (hasError) return;

    try {
      setLoading(true);
      // Calls POST /v1/auth/reset-password
      // Backend hashes new password with bcrypt and updates tUserPassword
      await resetPassword({ token, new_password: newPassword });
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (e: any) {
      const errMsg = e?.message || "Failed to reset password. Please request a new link.";
      if (errMsg === "New password cannot be the same as your current password.") {
        setConfirmError(errMsg);
      } else {
        setTokenValid(false);
        setTokenError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.pageBackground} />
      <div className={s.card}>
        <div className={s.iconWrap}>
          <FiLock size={28} className="text-teal-600" />
        </div>

        <h1 className={s.title}>Reset Password</h1>
        <p className={s.subtitle}>Enter your new password below.</p>

        <hr className={s.divider} />

        {/* Loading state while verifying token */}
        {tokenValid === null && (
          <p className={s.verifyingText}>Verifying your reset link...</p>
        )}

        {/* Token invalid or expired */}
        {tokenValid === false && (
          <div className={s.errorBox}>
            <FiAlertCircle
              size={20}
              className="text-red-500 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className={s.errorBoxTitle}>Link Invalid or Expired</p>
              <p className={s.errorBoxMsg}>{tokenError}</p>
              <button
                onClick={() => navigate("/forgot-password")}
                className={s.requestNewLink}
              >
                Request a new link →
              </button>
            </div>
          </div>
        )}

        {/* Success — password reset, redirecting to login */}
        {success && (
          <div className={s.successWrap}>
            <div className={s.successIcon}>
              <FiCheckCircle size={28} className="text-green-500" />
            </div>
            <p className={s.successTitle}>Password reset successfully!</p>
            <p className={s.successMsg}>
              Redirecting you to login in 3 seconds...
            </p>
          </div>
        )}

        {/* Reset form — shown only when token is valid */}
        {tokenValid === true && !success && (
          <>
            <div className={s.fieldGroup}>
              <label className={s.label}>New Password</label>
              <div className={s.inputWrapper}>
                <FiLock size={16} className={s.inputIcon} />
                <input
                  type={showNewPw ? "text" : "password"}
                  className={`${s.input} ${s.inputPr} ${
                    newPasswordErrors.length > 0
                      ? "border-red-400 focus:ring-red-300"
                      : ""
                  }`}
                  placeholder="Min 8 chars, uppercase, number, special"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    // Live password validation
                    setNewPasswordErrors(getPasswordErrors(e.target.value));
                  }}
                />
                <button
                  type="button"
                  className={s.eyeBtn}
                  onClick={() => setShowNewPw((p) => !p)}
                >
                  {showNewPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {/* Show unmet password rules in red */}
              {newPasswordErrors.length > 0 && (
                <ul className={s.rulesList}>
                  {newPasswordErrors.map((err, i) => (
                    <li key={i} className={s.ruleItem}>
                      ✕ {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={s.fieldGroup}>
              <label className={s.label}>Confirm Password</label>
              <div className={s.inputWrapper}>
                <FiLock size={16} className={s.inputIcon} />
                <input
                  type={showConfirmPw ? "text" : "password"}
                  className={`${s.input} ${s.inputPr} ${
                    confirmError ? "border-red-400 focus:ring-red-300" : ""
                  }`}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmError("");
                  }}
                />
                <button
                  type="button"
                  className={s.eyeBtn}
                  onClick={() => setShowConfirmPw((p) => !p)}
                >
                  {showConfirmPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {confirmError && (
                <p className={s.errorText}>
                  <FiAlertCircle size={12} />
                  {confirmError}
                </p>
              )}
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              className={s.submitBtn}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {!success && (
          <div className="flex justify-center">
            <button onClick={() => navigate("/login")} className={s.backBtn}>
              <FiArrowLeft size={15} />
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
