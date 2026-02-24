import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  standard: "",
  classification: "",
  acph: "",
  acphMin: null,
  acphMax: null,
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
  zoneId: null,
  projectStandardId: null,
};

const standardsSlice = createSlice({
  name: "standards",
  initialState,
  reducers: {
    updateStandardsField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    updateMultipleStandardsFields: (state, action) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key] = value;
      });
    },
    resetStandards: () => initialState,
  },
});

export const {
  updateStandardsField,
  updateMultipleStandardsFields,
  resetStandards,
} = standardsSlice.actions;

export default standardsSlice.reducer;