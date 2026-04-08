import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import App from "./App";
import "./index.css";
import { initAutoLogout } from './utils/auth.ts';
import { ErrorProvider } from "./pages/ErrorHandler/ErrorContext";


// Schedule auto logout if there's an existing token
initAutoLogout(() => {
  localStorage.removeItem('token');
  window.location.href = '/login';
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
    </ErrorProvider>
  </React.StrictMode>
);