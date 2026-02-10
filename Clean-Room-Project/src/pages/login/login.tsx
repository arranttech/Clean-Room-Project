import React, { useEffect, useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import loginDesign from "./loginCSS";
import { scheduleAutoLogout, clearAutoLogout } from "../../utils/auth";

// Backend URL - use Vite proxy by default
const API_URL = import.meta.env.VITE_API_URL || "";
function login() {
  const styles = loginDesign;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return;

    localStorage.setItem("token", token);
    scheduleAutoLogout(token, () => {
      clearAutoLogout();
      localStorage.removeItem("token");
      navigate("/login");
    });

    params.delete("token");
    const cleanedQuery = params.toString();
    const cleanUrl = cleanedQuery
      ? `${window.location.pathname}?${cleanedQuery}`
      : window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);

    navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      // Schedule auto logout when token expires
      scheduleAutoLogout(data.token, () => {
        clearAutoLogout();
        localStorage.removeItem("token");
        navigate("/login");
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRedirect = () => {
    const returnTo = `${window.location.origin}/login`;
    const url = `${API_URL}/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
    window.location.assign(url);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.gridContainer}>
        {/* Left Card */}
        <div className={styles.card}>
          <div className={styles.fieldGroup}>
            <img
              src="/Arrant.jpeg"
              alt="Arrant Logo"
              className={styles.logoImg}
            />

            <h2 className={styles.cardTitle}> Welcome</h2>
            <p className={styles.cardInfo}>
              {" "}
              Sign in to your STERI Clean Air account{" "}
            </p>

            <label className={styles.label}>Email Address</label>

            <div className={styles.inputWrapper}>
              <FaEnvelope className={styles.mailIcon} />
              <input
                type="email"
                placeholder="Enter Email Address"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label className={styles.label}> Password </label>

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
              <span> Forgot Password? </span>
            </Link>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`${styles.loginButton} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="flex justify-center my-2">
              <div className="w-full">
                <button
                  type="button"
                  onClick={handleGoogleRedirect}
                  disabled={loading}
                  className={`${styles.loginButton} ${loading ? "opacity-50 cursor-not-allowed" : ""} flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-2 px-4 bg-white hover:bg-gray-50 transition-all font-medium shadow-sm !text-black`}
                >
                  {/* Small, clean image tag instead of long SVG code */}
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
                {" "}
                Register Here!{" "}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default login;
