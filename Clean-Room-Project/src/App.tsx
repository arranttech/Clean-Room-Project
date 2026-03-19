import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Home from "./pages/LandingPage";
import CustomerInfoPage from "./pages/customerInfo";
import ProjectInfoPage from "./pages/projectInfo";
import Dashboard from "./pages/dashboard";
import ProjectListInfoPage from "./pages/dashboard/projectListInfo";
import Standard from "./pages/standards";
import Room from "./pages/rooms";
import Results from "./pages/results";
import Login from "./pages/login";
import Register from "./pages/register";
import AllProjects from "./pages/dashboard/projects";
import ApiDocs from "./pages/ApiDocs";
import Main from "./pages/admin/adminLayout";
import { refreshSession } from "./backend/controller/authContoller";
import { clearSessionTimers, scheduleSessionTimers } from "./utils/auth";

const SESSION_WARNING_BEFORE_MS = 110 * 1000;
const SESSION_WARNING_MINUTES = SESSION_WARNING_BEFORE_MS / (60 * 1000);

// scroll
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  const navigate = useNavigate();
  const [showSessionPopup, setShowSessionPopup] = useState(false);
  const [continuing, setContinuing] = useState(false);

  const onExpire = useCallback(() => {
    localStorage.removeItem("token");
    clearSessionTimers();
    setShowSessionPopup(false);
    navigate("/login", { replace: true });
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
    const syncSession = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        clearSessionTimers();
        setShowSessionPopup(false);
        return;
      }
      armSessionTimers(token);
    };

    syncSession();
    window.addEventListener("auth-token-updated", syncSession);

    return () => {
      clearSessionTimers();
      window.removeEventListener("auth-token-updated", syncSession);
    };
  }, [armSessionTimers]);

  const handleContinueSession = async () => {
    try {
      setContinuing(true);
      const result = await refreshSession();
      if (!result?.success || !result?.token) {
        onExpire();
        return;
      }

      localStorage.setItem("token", result.token);
      window.dispatchEvent(new Event("auth-token-updated"));
      setShowSessionPopup(false);
    } catch {
      onExpire();
    } finally {
      setContinuing(false);
    }
  };

  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* public landing page — always accessible */}
        <Route path="/" element={<Home />} />

        {/* guest routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* public routes */}
        <Route path="/customer-info" element={<CustomerInfoPage />} />
        <Route path="/project-info" element={<ProjectInfoPage />} />
        <Route path="/admin" element={<Main />} />
        <Route
          path="/projectListInfo/:projectId"
          element={<ProjectListInfoPage />}
        />

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/standards" element={<Standard />} />
          <Route path="/room" element={<Room />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/docs" element={<ApiDocs />} />
          <Route path="/results/:projectId" element={<Results />} />
        </Route>
      </Routes>

      {showSessionPopup && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Session Expiring Soon
            </h2>
            <p className="text-gray-600 mb-6">
              Your session is getting expired. Would you like to continue?
            </p>
            <div className="flex justify-end gap-3">
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
