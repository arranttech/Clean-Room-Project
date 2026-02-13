import { resetCustomerInfo } from "../redux/slices/customerInfoSlice";
import { resetStandards } from "../redux/slices/standardSlice";
import { resetRoom } from "../redux/slices/roomSlice";

// Clears all Redux state + persisted localStorage.
export const handleLogout = (dispatch) => {
  dispatch(resetCustomerInfo());
  dispatch(resetStandards());
  dispatch(resetRoom());   
  localStorage.removeItem("persist:root");
};