import { Routes, Route } from "react-router-dom";
import Home from "./pages/LandingPage";
import CustomerInfoPage from "./pages/customerInfo/CustomerInfoPage";
import Dashboard from "./components/dashboard/dashboard";
function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/customer" element={<CustomerInfoPage />} />
				<Route path="/dashboard" element={<Dashboard/>} />
			</Routes>
		</>
	);
}

export default App;
