import { configureStore } from "@reduxjs/toolkit";
import { 
  persistStore, 
  persistReducer, 
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER 
} from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import { combineReducers } from "redux";

import projectInfoReducer from "./slices/projectInfoSlice";
import standardsReducer from "./slices/standardSlice";
import roomReducer from "./slices/roomSlice";
import customerReducer from "./slices/customerSlice";
import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
  user: userReducer,
  customer: customerReducer,
  projectInfo: projectInfoReducer,
  standards: standardsReducer,
  room: roomReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "customer", "projectInfo", "standards", "room"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;