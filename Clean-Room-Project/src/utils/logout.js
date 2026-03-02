import { resetProjectInfo } from "../redux/slices/projectInfoSlice";
import { resetStandards } from "../redux/slices/standardSlice";
import { resetRoom } from "../redux/slices/roomSlice";
import { resetCustomer } from "../redux/slices/customerSlice";
import { persistor } from "../redux/store";

// Clears all Redux state + persisted localStorage.
export const handleLogout = async (dispatch) => {
  dispatch(resetProjectInfo());
  dispatch(resetStandards());  ;
  dispatch(resetRoom()); 
  dispatch(resetCustomer());  
  await persistor.purge(); 
  localStorage.removeItem("persist:root");
};