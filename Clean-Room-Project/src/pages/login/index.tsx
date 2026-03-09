import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import loginDesign from "./styles";
import { loginUser } from "../../backend/controller/authContoller";
import { getUserById } from "../../backend/controller/userController";
import { getCustomerInfo } from "../../backend/controller/customerController";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/slices/userSlice";
import { setCustomer } from "../../redux/slices/customerSlice";

const API_URL = import.meta.env.VITE_API_URL || "";

function Login() {
  const styles = loginDesign;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({ identifier, password });

      if (!response.success) {
        setError(response.message || "Login failed");
        return;
      }

      // Store token only
      localStorage.setItem("token", response.token);


      // Fetch full user details from DB
      const userRes = await getUserById(response.user.user_login_id);
      const u = userRes?.user ?? userRes;

      // Dispatch user to Redux
      dispatch(
        setUser({
          user_login_id: response.user.user_login_id,
          user_id: response.user.user_id,
          customer_id: response.user.customer_id,
          name: u
            ? `${u.user_first_name || ""} ${u.user_last_name || ""}`.trim()
            : response.user.name,
          firstName: u?.user_first_name || "",
          lastName: u?.user_last_name || "",
          email: u?.user_email_id || "",
        })
      );

      // Fetch customer info
      try {
        const customerResult = await getCustomerInfo(
          response.user.user_login_id
        );
        if (customerResult?.success && customerResult?.customer) {
          const c = customerResult.customer;
          dispatch(
            setCustomer({
              customerId: c.customer_id,
              customerName: c.customer_name || "",
              phoneNumber: c.customer_phone || "",
              customerAddress: c.customer_address || "",
              emailAddress: c.customer_email_id || "",
              additionalNotes:
                c.customers_additional_notes ||
                c.customers_addional_notes ||
                "",
            })
          );
        }
      } catch {
        // Customer fetch failed silently
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRedirect = () => {
    const returnTo = `${window.location.origin}/login`;
    const url = `${API_URL}/auth/google?returnTo=${encodeURIComponent(
      returnTo
    )}`;
    window.location.assign(url);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.gridContainer}>
        <div className={styles.card}>
          <div className={styles.fieldGroup}>
            <form onSubmit={handleLogin}>
              <img
                src="/Arrant.jpeg"
                alt="Arrant Logo"
                className={styles.logoImg}
              />
              <h2 className={styles.cardTitle}>Welcome</h2>
              <p className={styles.cardInfo}>
                Sign in to your STERI Clean Air account
              </p>

              <label className={styles.label}>Email Address/UserID</label>
              <div className={styles.inputWrapper}>
                <FaEnvelope className={styles.mailIcon} />
                <input
                  type="text"
                  placeholder="Enter Email Address or UserID"
                  className={styles.input}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <FaLock className={styles.mailIcon} />
                <input
                  type="password"
                  placeholder="Enter Password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Link to="/register" className={styles.resetPwdLink}>
                <span>Forgot Password?</span>
              </Link>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`${styles.loginButton} ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <div className="flex justify-center my-2">
                <div className="w-full">
                  <button
                    type="button"
                    onClick={handleGoogleRedirect}
                    disabled={loading}
                    className={`${styles.loginButton} ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    } flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-2 px-4 bg-white hover:bg-gray-50 transition-all font-medium shadow-sm !text-black`}
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span>
                      {loading ? "Processing..." : "Continue with Google"}
                    </span>
                  </button>
                </div>
              </div>

              <Link to="/register" className={styles.nextLink}>
                New Customer{" "}
                <span className="text-blue-600 hover:text-blue-400">
                  Register Here!
                </span>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
