import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_login_id: null,
  user_id: null,
  customer_id: null,
  name: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user_login_id = action.payload.user_login_id;
      state.user_id = action.payload.user_id;
      state.customer_id = action.payload.customer_id;
      state.name = action.payload.name;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;