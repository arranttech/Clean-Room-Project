import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import projectInfoReducer from "./slices/projectInfoSlice";
import standardsReducer from "./slices/standardSlice";
import roomReducer from "./slices/roomSlice";
import customerReducer from "./slices/customerSlice"; 


// --- Persist Config ---
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["projectInfo","standards","room","customer"], // only persist these slices
};

// --- Root Reducer ---
const rootReducer = combineReducers({
  customer: customerReducer,
  projectInfo: projectInfoReducer,
  standards: standardsReducer,
  room: roomReducer,
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