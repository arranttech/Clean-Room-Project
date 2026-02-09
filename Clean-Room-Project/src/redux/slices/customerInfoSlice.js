
import { createSlice } from "@reduxjs/toolkit";

// --- Initial State ---
const initialState = {
  customerName: "",
  phoneNumber: "",
  customerAddress: "",
  emailAddress: "",
  additionalNotes: "",
  projectName: "",
  unitBranch: "",
  handling: [],
  industry: [],
  uniqueId: "",
  locationQuery: "",
  selectedLocation: null,
  minTemp: "",
  maxTemp: "",
  relativeHumidityMin: "",
  relativeHumidityMax: "",
};

// --- Slice (actions + reducers combined) ---
const customerInfoSlice = createSlice({
  name: "customerInfo",
  initialState,
  reducers: {
    // Update single field
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    // Update multiple fields
    updateMultipleFields: (state, action) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key] = value;
      });
    },

    // Reset entire slice (logout)
    resetCustomerInfo: () => initialState,
  },
});

export const { updateField, updateMultipleFields, resetCustomerInfo } =
  customerInfoSlice.actions;

export default customerInfoSlice.reducer;