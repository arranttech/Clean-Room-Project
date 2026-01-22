import { Routes, Route } from "react-router-dom";
import Home from "./pages/LandingPage";
import CustomerInfoPage from "./pages/customerInfo/CustomerInfoPage";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/customer" element={<CustomerInfoPage />} />
			</Routes>
		</>
	);
}

export default App;
