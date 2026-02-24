import { resetProjectInfo } from "../redux/slices/projectInfoSlice";
import { resetStandards } from "../redux/slices/standardSlice";
import { resetRoom } from "../redux/slices/roomSlice";
import { resetCustomer } from "../redux/slices/customerSlice";

// Clears all Redux state + persisted localStorage.
export const handleLogout = (dispatch) => {
  dispatch(resetProjectInfo());
  dispatch(resetStandards());  ;
  dispatch(resetRoom()); 
  dispatch(resetCustomer());   
  localStorage.removeItem("persist:root");
};