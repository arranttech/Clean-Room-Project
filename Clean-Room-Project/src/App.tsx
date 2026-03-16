import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/LandingPage";
import CustomerInfoPage from "./pages/customerInfo";
import ProjectInfoPage from "./pages/projectInfo";
import Dashboard from "./pages/dashboard";
import Standard from "./pages/standards";
import Room from "./pages/rooms";
import Login from "./pages/login";
import Register from "./pages/register";
import AllProjects from "./pages/dashboard/projects";
import ApiDocs from "./pages/ApiDocs";
import Main from "./pages/admin/adminLayout";
import DynamicResults from "./pages/results/dynamicresults";

// scroll to top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// protect dashboard routes
function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/customer-info" element={<CustomerInfoPage />} />
        <Route path="/project-info" element={<ProjectInfoPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Main />} />

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/standards" element={<Standard />} />
          <Route path="/room" element={<Room />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/docs" element={<ApiDocs />} />
          <Route path="/dynamic-results" element={<DynamicResults />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;