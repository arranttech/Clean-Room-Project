import { createSlice } from "@reduxjs/toolkit"; // Redux toolkit

const initialState = {
  zoneId: "1", // Default zone
  standard: "",
  classification: "",
  acph: "",
  system: "",
  systemType: "",
  heatingMethod: "",
  coolingMethod: "",
  tempUnit: "C",
  reqInsideTempC: "",
  reqInsideTempDisplay: "",
  reqInsideHum: "",
  flowVelocity: 1.5,
  heatingFlowVelocity: 1.5,
  coolingFlowVelocity: 1.5,
}; // Initial state

const standardsSlice = createSlice({
  name: "standards", // Slice name
  initialState, // Default state
  reducers: {
    updateStandardsField: (state, action) => {
      const { field, value } = action.payload; // Action payload
      state[field] = value; // Update field
    },

    updateMultipleStandardsFields: (state, action) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key] = value; // Batch update
      });
    },

    resetStandards: () => initialState, // Reset state
  },
});

export const {
  updateStandardsField,
  updateMultipleStandardsFields,
  resetStandards,
} = standardsSlice.actions; // Export actions

export default standardsSlice.reducer; // Export reducer
