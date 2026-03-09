import { useCallback, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/LandingPage";
import CustomerInfoPage from "./pages/customerInfo";
import ProjectInfoPage from "./pages/projectInfo";
import Dashboard from "./pages/dashboard";
import Standard from "./pages/standards";
import Room from "./pages/rooms";
import Results from "./pages/results";
import Login from "./pages/login";
import Register from "./pages/register";
import AllProjects from "./pages/dashboard/projects";
import ApiDocs from "./pages/ApiDocs";
import Main from "./pages/admin/adminLayout";
import { refreshSession } from "./backend/controller/authContoller";
import { scheduleSessionTimers, clearSessionTimers } from "./utils/auth";

const SESSION_WARNING_BEFORE_MS = 2 * 60 * 1000;
const SESSION_TOTAL_MINUTES = 20;
const SESSION_WARNING_MINUTES = SESSION_WARNING_BEFORE_MS / (60 * 1000);

function App() {
  const navigate = useNavigate();
  const [showSessionPopup, setShowSessionPopup] = useState(false);
  const [continuing, setContinuing] = useState(false);

  const onExpire = useCallback(() => {
    localStorage.removeItem("token");
    clearSessionTimers();
    setShowSessionPopup(false);
    navigate("/login");
  }, [navigate]);

  const armSessionTimers = useCallback(
    (token: string) => {
      scheduleSessionTimers(token, {
        warnBeforeMs: SESSION_WARNING_BEFORE_MS,
        onWarn: () => setShowSessionPopup(true),
        onExpire,
      });
    },
    [onExpire]
  );

  useEffect(() => {
    const syncSessionTimers = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        clearSessionTimers();
        return;
      }

      armSessionTimers(token);
    };

    syncSessionTimers();
    window.addEventListener("auth-token-updated", syncSessionTimers);

    return () => {
      clearSessionTimers();
      window.removeEventListener("auth-token-updated", syncSessionTimers);
    };
  }, [armSessionTimers]);

  const handleContinueSession = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      onExpire();
      return;
    }

    try {
      setContinuing(true);
      const result = await refreshSession(token);
      if (!result?.success || !result?.token) {
        onExpire();
        return;
      }

      localStorage.setItem("token", result.token);
      window.dispatchEvent(new Event("auth-token-updated"));
      setShowSessionPopup(false);
      armSessionTimers(result.token);
    } catch {
      onExpire();
    } finally {
      setContinuing(false);
    }
  };

  const handleLogoutNow = () => {
    onExpire();
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customer-info" element={<CustomerInfoPage />} />
        <Route path="/project-info" element={<ProjectInfoPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/standards" element={<Standard />} />
        <Route path="/room" element={<Room />} />
        <Route path="/results" element={<Results />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/admin" element={<Main />} />
        <Route path="/docs" element={<ApiDocs />} />
      </Routes>

      {showSessionPopup && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Session Expiring Soon
            </h2>
            <p className="text-gray-600 mb-6">
              Your session will expire in about {SESSION_WARNING_MINUTES} minute.
              Click Continue to stay signed in for another {SESSION_TOTAL_MINUTES}
              minutes.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleLogoutNow}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
              <button
                type="button"
                disabled={continuing}
                onClick={handleContinueSession}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {continuing ? "Continuing..." : "Continue Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
