import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	total: 0,
	inProgress: 0,
	completed: 0,
	inProgressProjects: [],
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

		setInProgressProjects: (state, action) => {
			state.inProgressProjects = action.payload;
		},

		// Upsert — updates if project_id exists, adds if not
		updateInProgressProject: (state, action) => {
			const { project_id, ...updates } = action.payload;
			const idx = state.inProgressProjects.findIndex(
				(p) => p.project_id === project_id
			);
			if (idx !== -1) {
				state.inProgressProjects[idx] = {
					...state.inProgressProjects[idx],
					...updates,
				};
			} else {
				state.inProgressProjects.unshift({ project_id, ...updates });
			}
		},

		removeInProgressProject: (state, action) => {
			state.inProgressProjects = state.inProgressProjects.filter(
				(p) => p.project_id !== action.payload
			);
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

export const {
	setProjectCounts,
	setInProgressProjects,
	updateInProgressProject,
	removeInProgressProject,
	updateDashboardField,
	updateMultipleDashboardFields,
	resetDashboard,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
