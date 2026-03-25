import { createSlice } from "@reduxjs/toolkit";

// --- Initial State ---
const initialState = {
  isNewProject: false,
  customerName:"",
  projectName: "",
  unitBranch: "",
  handling: [],
  industry: "",
  subIndustry: "",
  uniqueId: "",
  locationQuery: "",
  selectedLocation: null,
  minTemp: "",
  maxTemp: "",
  relativeHumidityMin: "",
  relativeHumidityMax: "",
  projectId: null,
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

		// Reset entire slice — sets isNewProject true to block DB fetch on next visit
		resetProjectInfo: () => ({ ...initialState, isNewProject: true }),
	},
});

export const { updateField, updateMultipleFields, resetProjectInfo } =
	projectInfoSlice.actions;

export default projectInfoSlice.reducer;
