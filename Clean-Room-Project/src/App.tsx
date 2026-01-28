import { Routes, Route } from "react-router-dom";
import Home from "./pages/LandingPage";
import CustomerInfoPage from "./pages/customerInfo/CustomerInfoPage";
import Dashboard from "./components/dashboard/dashboard";
import Standard from "./pages/Standards/standard";
import Room from "./pages/Room/room";
import Results from "./pages/Results/results";

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
			</Routes>
		</>
	);
}

export default App;
