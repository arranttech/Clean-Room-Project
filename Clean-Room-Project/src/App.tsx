import { Routes, Route } from "react-router-dom";
import Home from "./pages/LandingPage";
import CustomerInfoPage from "./pages/customerInfo/CustomerInfoPage";
import Dashboard from "./pages/dashboard/dashboard";
import Standard from "./pages/Standards/standard";
import Room from "./pages/Room/room";
import Results from "./pages/Results/results";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import AllProjects from "./pages/dashboard/projects";


function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/customer-info" element={<CustomerInfoPage />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/standards" element={<Standard />} />
				<Route path="/room" element={<Room/>} />
				<Route path="/results" element={<Results />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/projects" element={<AllProjects/>} />
			</Routes>
		</>
	);
}

export default App;
