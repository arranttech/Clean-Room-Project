import { Routes, Route } from "react-router-dom";
import Home from "./pages/LandingPage";
import CustomerInfoPage from "./pages/customerInfo/CustomerInfoPage";
import ProjectInfoPage from "./pages/projectInfo/ProjectInfoPage";
import Dashboard from "./pages/dashboard/dashboard";
import Standard from "./pages/Standards/standard";
import Room from "./pages/Room/room";
import Results from "./pages/Results/results";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import AllProjects from "./pages/dashboard/projects";
import ApiDocs from "./pages/ApiDocs";
import Main from "./pages/admin/adminLayout";

function App() {
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
		</>
	);
}

export default App;
