import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user_login_id: null,
	user_id: null,
	customer_id: null,
	customer_ids: [],
	availableCustomers: [],
	name: null,
	adminFlag: "N",
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user_login_id = action.payload.user_login_id;
			state.user_id = action.payload.user_id;
			state.customer_id = action.payload.customer_id;
			state.customer_ids = action.payload.customer_ids ?? state.customer_ids;
			state.name = action.payload.name;
			state.adminFlag = action.payload.adminFlag;
		},
		setActiveCustomerId: (state, action) => {
			state.customer_id = action.payload;
		},
		setAvailableCustomers: (state, action) => {
			state.availableCustomers = action.payload;
		},
		clearUser: () => initialState,
	},
});

export const {
	setUser,
	setActiveCustomerId,
	setAvailableCustomers,
	clearUser,
} = userSlice.actions;
export default userSlice.reducer;
