import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import App from "./App";
import "./index.css";
import { initAutoLogout } from './utils/auth.ts';
import { GoogleOAuthProvider } from "@react-oauth/google";

// Schedule auto logout if there's an existing token
initAutoLogout(() => {
  localStorage.removeItem('token');
  window.location.href = '/login';
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>  
    {/* Redux Provider — makes store available to all components */}
      <Provider store={store}>
      {/* PersistGate — restores saved state from localStorage before rendering */}
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
</React.StrictMode>
);