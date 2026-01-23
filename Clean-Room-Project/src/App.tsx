import { Routes, Route } from "react-router-dom";
import Home from "./pages/LandingPage";
import CustomerInfoPage from "./pages/customerInfo/CustomerInfoPage";
import Login from "./pages/login/login";
function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/customer" element={<CustomerInfoPage />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</>
	);
}

export default App;
