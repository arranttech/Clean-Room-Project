import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import customerInfoReducer from "./slices/customerInfoSlice";
import standardsReducer from "./slices/standardSlice";

// --- Persist Config ---
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["customerInfo","standards"], // only persist these slices
};

// --- Root Reducer ---
const rootReducer = combineReducers({
  customerInfo: customerInfoReducer,
  standards: standardsReducer,
});

// --- Persisted Reducer ---
const persistedReducer = persistReducer(persistConfig, rootReducer);

// --- Store ---
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export default store;