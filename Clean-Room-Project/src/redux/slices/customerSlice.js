import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerId: null,
  customerName: "",
  phoneNumber: "",
  customerAddress: "",
  emailAddress: "",
  additionalNotes: "",
  isSaved: false,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      const { customerId, customerName, phoneNumber, customerAddress, emailAddress, additionalNotes } = action.payload;
      state.customerId = customerId;
      state.customerName = customerName;
      state.phoneNumber = phoneNumber;
      state.customerAddress = customerAddress;
      state.emailAddress = emailAddress;
      state.additionalNotes = additionalNotes;
      state.isSaved = true;
    },
    setCustomerId: (state, action) => {
      state.customerId = action.payload;
    },
    resetCustomer: () => initialState,
  },
});

export const { setCustomer, setCustomerId, resetCustomer } = customerSlice.actions;
export default customerSlice.reducer;