import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getUserById,
  updateUser,
  updatePasswordByUserId,
} from "../../backend/controller/userController";
import { handleLogout } from "../../utils/logout";
import { setUser } from "../../redux/slices/userSlice";
import {
  FiLogOut,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiX,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import s from "./styles";

// Types
interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

interface UserDetails {
  user_login_id: number;
  user_id: string;
  user_first_name: string;
  user_last_name: string;
  user_email_id: string;
  user_address: string;
  user_phone_home: string;
  user_phone_work: string;
  user_admin_flag: string;
  status: string;
  customer_ids: number[];
}

interface ToastState {
  message: string;
  type: "success" | "error";
}

// Password rule checker
const getPasswordErrors = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("At least one number");
  if (!/[^A-Za-z0-9]/.test(password))
    errors.push("At least one special character");
  return errors;
};

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${s.toast} ${
        type === "success" ? s.toastSuccess : s.toastError
      }`}
    >
      <div className={s.toastInner}>
        {type === "success" ? (
          <FiCheckCircle size={18} className="text-green-500 flex-shrink-0" />
        ) : (
          <FiAlertCircle size={18} className="text-red-500 flex-shrink-0" />
        )}
        <span className={s.toastMsg}>{message}</span>
      </div>
      <button onClick={onClose} className={s.toastClose}>
        <FiX size={14} />
      </button>
    </div>
  );
}

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loggedInUser = useAppSelector((state: any) => state.user);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userFullName, setUserFullName] = useState<string>("");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [editingEmail, setEditingEmail] = useState<boolean>(false);
  const [editingPhone, setEditingPhone] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<boolean>(false);
  const [editingPassword, setEditingPassword] = useState<boolean>(false);

  const [emailVal, setEmailVal] = useState<string>("");
  const [homePhoneVal, setHomePhoneVal] = useState<string>("");
  const [workPhoneVal, setWorkPhoneVal] = useState<string>("");
  const [addressVal, setAddressVal] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [showCurrentPw, setShowCurrentPw] = useState<boolean>(false);
  const [showNewPw, setShowNewPw] = useState<boolean>(false);
  const [savingEmail, setSavingEmail] = useState<boolean>(false);
  const [savingPhone, setSavingPhone] = useState<boolean>(false);
  const [savingAddress, setSavingAddress] = useState<boolean>(false);
  const [savingPassword, setSavingPassword] = useState<boolean>(false);

  // Field errors
  const [emailError, setEmailError] = useState<string>("");
  const [homePhoneError, setHomePhoneError] = useState<string>("");
  const [workPhoneError, setWorkPhoneError] = useState<string>("");
  const [currentPasswordError, setCurrentPasswordError] = useState<string>("");
  const [newPasswordErrors, setNewPasswordErrors] = useState<string[]>([]);

  const sidebarRef = useRef<HTMLDivElement>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!loggedInUser?.user_login_id) return;
    const fetchUserDetails = async () => {
      try {
        const res = await getUserById(loggedInUser.user_login_id);
        const u = res?.user ?? res;
        if (u) {
          const fullName = `${u.user_first_name || ""} ${
            u.user_last_name || ""
          }`.trim();
          setUserFullName(fullName);
          setUserEmail(u.user_email_id || "");
          setUserDetails(u);
          dispatch(
            setUser({
              user_login_id: loggedInUser.user_login_id,
              user_id: u.user_id || loggedInUser.user_id,
              customer_id: u.customer_id || loggedInUser.customer_id,
              name: fullName || loggedInUser.name,
            })
          );
        }
      } catch (e) {
        console.error("Failed to fetch user details:", e);
      }
    };
    fetchUserDetails();
  }, [loggedInUser?.user_login_id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const displayName = userFullName || loggedInUser?.name || "";

  const getInitials = (name: string): string => {
    if (!name?.trim()) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const openEditEmail = () => {
    setEmailVal(userDetails?.user_email_id || "");
    setEmailError("");
    setEditingEmail(true);
  };
  const openEditPhone = () => {
    setHomePhoneVal(userDetails?.user_phone_home || "");
    setWorkPhoneVal(userDetails?.user_phone_work || "");
    setHomePhoneError("");
    setWorkPhoneError("");
    setEditingPhone(true);
  };
  const openEditAddress = () => {
    setAddressVal(userDetails?.user_address || "");
    setEditingAddress(true);
  };
  const openEditPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setCurrentPasswordError("");
    setNewPasswordErrors([]);
    setEditingPassword(true);
  };

  const saveEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal.trim()) {
      setEmailError("Email address cannot be empty.");
      return;
    }
    if (!emailRegex.test(emailVal.trim())) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    try {
      setSavingEmail(true);
      await updateUser(loggedInUser.user_login_id, {
        user_email_id: emailVal.trim(),
      });
      setUserDetails((prev) =>
        prev ? { ...prev, user_email_id: emailVal.trim() } : prev
      );
      setUserEmail(emailVal.trim());
      setEditingEmail(false);
      showToast("Email updated successfully!");
    } catch (e) {
      console.error("Failed to update email:", e);
      showToast("Failed to update email.", "error");
    } finally {
      setSavingEmail(false);
    }
  };

  const savePhone = async () => {
    const phoneRegex = /^[0-9]{1,15}$/;
    let hasError = false;

    if (homePhoneVal && !phoneRegex.test(homePhoneVal)) {
      setHomePhoneError("Numbers only, max 15 digits.");
      hasError = true;
    } else {
      setHomePhoneError("");
    }
    if (workPhoneVal && !phoneRegex.test(workPhoneVal)) {
      setWorkPhoneError("Numbers only, max 15 digits.");
      hasError = true;
    } else {
      setWorkPhoneError("");
    }
    if (hasError) return;

    try {
      setSavingPhone(true);
      await updateUser(loggedInUser.user_login_id, {
        user_phone_home: homePhoneVal,
        user_phone_work: workPhoneVal,
      });
      setUserDetails((prev) =>
        prev
          ? {
              ...prev,
              user_phone_home: homePhoneVal,
              user_phone_work: workPhoneVal,
            }
          : prev
      );
      setEditingPhone(false);
      showToast("Phone numbers updated successfully!");
    } catch (e) {
      console.error("Failed to update phone:", e);
      showToast("Failed to update phone numbers.", "error");
    } finally {
      setSavingPhone(false);
    }
  };

  const saveAddress = async () => {
    try {
      setSavingAddress(true);
      await updateUser(loggedInUser.user_login_id, {
        user_address: addressVal,
      });
      setUserDetails((prev) =>
        prev ? { ...prev, user_address: addressVal } : prev
      );
      setEditingAddress(false);
      showToast("Address updated successfully!");
    } catch (e) {
      console.error("Failed to update address:", e);
      showToast("Failed to update address.", "error");
    } finally {
      setSavingAddress(false);
    }
  };

  const savePassword = async () => {
    let hasError = false;

    if (!currentPassword) {
      setCurrentPasswordError("Current password is required.");
      hasError = true;
    } else {
      setCurrentPasswordError("");
    }

    const pwErrors = getPasswordErrors(newPassword);
    if (pwErrors.length > 0) {
      setNewPasswordErrors(pwErrors);
      hasError = true;
    } else {
      setNewPasswordErrors([]);
    }

    if (hasError) return;

    try {
      setSavingPassword(true);
      await updatePasswordByUserId(loggedInUser.user_login_id, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      showToast("Password updated successfully!");
    } catch (e) {
      console.error("Failed to update password:", e);
      setCurrentPasswordError("Your current password is incorrect.");
    } finally {
      setSavingPassword(false);
    }
  };

  const onLogout = async () => {
    setSidebarOpen(false);
    await handleLogout(dispatch);
    navigate("/");
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <header className={s.header}>
        <div className={s.headerInner}>
          <div className={s.left}>
            <div className={s.logoTile} onClick={() => navigate("/dashboard")}>
              <img
                src="/Arrant.jpeg"
                alt="Arrant Dynamics"
                className={s.logoImg}
              />
            </div>
            <div className={s.brand}>
              <div>ARRANT</div>
              <div>DYNAMICS</div>
            </div>
          </div>

          <div className={s.center}>
            <div className={s.title1}>STERI Clean Air</div>
            <div className={s.subtitle1}>HVAC Matrix Platform</div>
          </div>

          <div className={s.right}>
            <div className="flex flex-col items-end min-w-0">
              <span className={s.userName} title={displayName}>
                {displayName}
              </span>
              {userEmail && (
                <span className={s.userEmail} title={userEmail}>
                  {userEmail}
                </span>
              )}
            </div>
            <div className="w-px h-8 bg-slate-200 hidden sm:block flex-shrink-0" />
            <button
              type="button"
              className={s.avatarBtn}
              onClick={() => setSidebarOpen(true)}
              title={displayName}
            >
              {getInitials(displayName)}
            </button>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div className={s.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div
        ref={sidebarRef}
        className={`${s.sidebar} ${
          sidebarOpen ? s.sidebarOpen : s.sidebarClosed
        }`}
      >
        <div className={s.sidebarHeader}>
          <div className={s.sidebarAvatar}>{getInitials(displayName)}</div>
          <div className={s.sidebarUserInfo}>
            <div className={s.sidebarName}>{displayName}</div>
            <div className={s.sidebarRole}>
              {userDetails?.user_email_id || ""}
            </div>
          </div>
          <button
            className={s.sidebarClose}
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className={s.sidebarBody}>
          {/* Email */}
          <div className={s.infoCard}>
            <div className={s.infoCardHeader}>
              <div className={s.infoCardTitle}>
                <FiMail className={s.infoIcon} />
                <span>Email Address</span>
              </div>
              {!editingEmail && (
                <button className={s.updateBtn} onClick={openEditEmail}>
                  Update
                </button>
              )}
            </div>
            {editingEmail ? (
              <>
                <input
                  type="email"
                  className={`${s.inputField} ${
                    emailError ? s.inputError : ""
                  }`}
                  value={emailVal}
                  placeholder="Enter valid email address"
                  onChange={(e) => {
                    setEmailVal(e.target.value);
                    setEmailError("");
                  }}
                />
                {emailError && <p className={s.fieldError}>{emailError}</p>}
                <div className={s.btnRow}>
                  <button
                    className={s.saveBtn}
                    onClick={saveEmail}
                    disabled={savingEmail}
                  >
                    {savingEmail ? "Saving..." : "Save"}
                  </button>
                  <button
                    className={s.cancelBtn}
                    onClick={() => setEditingEmail(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className={s.infoCardValue}>
                {userDetails?.user_email_id || "—"}
              </div>
            )}
          </div>

          {/* Phone */}
          <div className={s.infoCard}>
            <div className={s.infoCardHeader}>
              <div className={s.infoCardTitle}>
                <FiPhone className={s.infoIcon} />
                <span>Phone Numbers</span>
              </div>
              {!editingPhone && (
                <button className={s.updateBtn} onClick={openEditPhone}>
                  Update
                </button>
              )}
            </div>
            {editingPhone ? (
              <>
                <label className={s.inputLabel}>Home Phone</label>
                <input
                  type="tel"
                  className={`${s.inputField} ${
                    homePhoneError ? s.inputError : ""
                  }`}
                  value={homePhoneVal}
                  maxLength={15}
                  placeholder="Numbers only, max 15 digits"
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setHomePhoneVal(val);
                    setHomePhoneError("");
                  }}
                />
                {homePhoneError && (
                  <p className={s.fieldError}>{homePhoneError}</p>
                )}

                <label className={s.inputLabel}>Work Phone</label>
                <input
                  type="tel"
                  className={`${s.inputField} ${
                    workPhoneError ? s.inputError : ""
                  }`}
                  value={workPhoneVal}
                  maxLength={15}
                  placeholder="Numbers only, max 15 digits"
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setWorkPhoneVal(val);
                    setWorkPhoneError("");
                  }}
                />
                {workPhoneError && (
                  <p className={s.fieldError}>{workPhoneError}</p>
                )}

                <div className={s.btnRow}>
                  <button
                    className={s.saveBtn}
                    onClick={savePhone}
                    disabled={savingPhone}
                  >
                    {savingPhone ? "Saving..." : "Save"}
                  </button>
                  <button
                    className={s.cancelBtn}
                    onClick={() => setEditingPhone(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className={s.infoCardValue}>
                {userDetails?.user_phone_home && (
                  <div>
                    <span className={s.phoneLabel}>Home: </span>
                    {userDetails.user_phone_home}
                  </div>
                )}
                {userDetails?.user_phone_work && (
                  <div>
                    <span className={s.phoneLabel}>Work: </span>
                    {userDetails.user_phone_work}
                  </div>
                )}
                {!userDetails?.user_phone_home &&
                  !userDetails?.user_phone_work &&
                  "—"}
              </div>
            )}
          </div>

          {/* Address */}
          <div className={s.infoCard}>
            <div className={s.infoCardHeader}>
              <div className={s.infoCardTitle}>
                <FiMapPin className={s.infoIcon} />
                <span>Address</span>
              </div>
              {!editingAddress && (
                <button className={s.updateBtn} onClick={openEditAddress}>
                  Update
                </button>
              )}
            </div>
            {editingAddress ? (
              <>
                <textarea
                  className={s.textareaField}
                  rows={3}
                  value={addressVal}
                  onChange={(e) => setAddressVal(e.target.value)}
                />
                <div className={s.btnRow}>
                  <button
                    className={s.saveBtn}
                    onClick={saveAddress}
                    disabled={savingAddress}
                  >
                    {savingAddress ? "Saving..." : "Save"}
                  </button>
                  <button
                    className={s.cancelBtn}
                    onClick={() => setEditingAddress(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className={s.infoCardValue}>
                {userDetails?.user_address || "—"}
              </div>
            )}
          </div>

          {/* Password */}
          <div className={s.infoCard}>
            <div className={s.infoCardHeader}>
              <div className={s.infoCardTitle}>
                <FiLock className={s.infoIcon} />
                <span>Password</span>
              </div>
              {!editingPassword && (
                <button className={s.updateBtn} onClick={openEditPassword}>
                  Update
                </button>
              )}
            </div>
            {editingPassword ? (
              <>
                <label className={s.inputLabel}>Current Password</label>
                <div className={s.pwInputWrap}>
                  <input
                    type={showCurrentPw ? "text" : "password"}
                    className={`${s.inputFieldPw} ${
                      currentPasswordError ? s.inputError : ""
                    }`}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setCurrentPasswordError("");
                    }}
                  />
                  <button
                    type="button"
                    className={s.eyeBtn}
                    onClick={() => setShowCurrentPw((p) => !p)}
                  >
                    {showCurrentPw ? (
                      <FiEyeOff size={15} />
                    ) : (
                      <FiEye size={15} />
                    )}
                  </button>
                </div>
                {currentPasswordError && (
                  <p className={s.fieldError}>{currentPasswordError}</p>
                )}

                <label className={s.inputLabel}>New Password</label>
                <div className={s.pwInputWrap}>
                  <input
                    type={showNewPw ? "text" : "password"}
                    className={`${s.inputFieldPw} ${
                      newPasswordErrors.length > 0 ? s.inputError : ""
                    }`}
                    placeholder="Min 8 chars, uppercase, number, special"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
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
                {newPasswordErrors.length > 0 && (
                  <ul className={s.passwordRulesList}>
                    {newPasswordErrors.map((err, i) => (
                      <li key={i} className={s.fieldError}>
                        ✕ {err}
                      </li>
                    ))}
                  </ul>
                )}

                <div className={s.btnRow}>
                  <button
                    className={s.saveBtn}
                    onClick={savePassword}
                    disabled={savingPassword}
                  >
                    {savingPassword ? "Saving..." : "Save"}
                  </button>
                  <button
                    className={s.cancelBtn}
                    onClick={() => setEditingPassword(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className={s.infoCardValue}>••••••••••••</div>
            )}
          </div>
        </div>

        <div className={s.sidebarFooter}>
          <button className={s.logoutBtn} onClick={onLogout}>
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
