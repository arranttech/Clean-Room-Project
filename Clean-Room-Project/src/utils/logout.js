import { resetProjectInfo } from "../redux/slices/projectInfoSlice";
import { fullResetStandards } from "../redux/slices/standardSlice";
import { resetRoom } from "../redux/slices/roomSlice";

// Clears all Redux state + persisted localStorage.
export const handleLogout = (dispatch) => {
  dispatch(resetProjectInfo());
  dispatch(fullResetStandards());  ;
  dispatch(resetRoom());   
  localStorage.removeItem("persist:root");
};