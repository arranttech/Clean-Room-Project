import { Routes, Route } from "react-router-dom";
import Home from "./pages/LandingPage";
import CustomerInfoPage from "./pages/customerInfo/CustomerInfoPage";
import Dashboard from "./components/dashboard/dashboard";
import Standard from "./pages/Standards/standard";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/customer-info" element={<CustomerInfoPage />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/standards" element={<Standard />} />
			</Routes>
		</>
	);
}

export default App;
