
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
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

function ProtectedRoute() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/customer-info" element={<CustomerInfoPage />} />
        <Route path="/project-info" element={<ProjectInfoPage />} />
        <Route path="/login" element={localStorage.getItem("token") ? <Navigate to="/dashboard"/> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Main />} />

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/standards" element={<Standard />} />
          <Route path="/room" element={<Room />} />
          <Route path="/results" element={<Results />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/docs" element={<ApiDocs />} />
        </Route>
      </Routes>
  );
}

export default App;
