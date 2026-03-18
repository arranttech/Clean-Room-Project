import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	total: 0,
	inProgress: 0,
	completed: 0,
};

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		setProjectCounts: (state, action) => {
			state.total = action.payload.total ?? 0;
			state.inProgress = action.payload.inProgress ?? 0;
			state.completed = action.payload.completed ?? 0;
		},

		// Update single field
		updateDashboardField: (state, action) => {
			const { field, value } = action.payload;
			state[field] = value;
		},

		// Update multiple fields
		updateMultipleDashboardFields: (state, action) => {
			Object.entries(action.payload).forEach(([key, value]) => {
				state[key] = value;
			});
		},

		resetDashboard: () => initialState,
	},
});

export const { setProjectCounts, updateDashboardField, updateMultipleDashboardFields, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
