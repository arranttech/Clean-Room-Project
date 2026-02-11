import { resetCustomerInfo } from "../redux/slices/customerInfoSlice";
import { resetStandards } from "../redux/slices/standardSlice";
// Clears all Redux state + persisted localStorage.
export const handleLogout = (dispatch) => {
  dispatch(resetCustomerInfo());
  dispatch(resetStandards());
  localStorage.removeItem("persist:root");
};