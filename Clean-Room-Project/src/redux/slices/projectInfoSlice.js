import { createSlice } from "@reduxjs/toolkit";

// --- Initial State ---
const initialState = {
  customerName: "",
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
const projectInfoSlice = createSlice({
  name: "projectInfo",
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

    // Reset entire slice
    resetProjectInfo: () => initialState,
  },
});

export const { updateField, updateMultipleFields, resetProjectInfo } = projectInfoSlice.actions;

export default projectInfoSlice.reducer;