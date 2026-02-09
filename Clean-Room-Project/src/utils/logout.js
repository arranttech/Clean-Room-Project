import { resetCustomerInfo } from "../redux/slices/customerInfoSlice";
// Clears all Redux state + persisted localStorage.
export const handleLogout = (dispatch) => {
  dispatch(resetCustomerInfo());
  localStorage.removeItem("persist:root");
};