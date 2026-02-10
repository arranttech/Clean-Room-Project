import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { initAutoLogout } from './utils/auth.ts';

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);

// Schedule auto logout if there's an existing token
initAutoLogout(() => {
  localStorage.removeItem('token');
  window.location.href = '/login';
});
