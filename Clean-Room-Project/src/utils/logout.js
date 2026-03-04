import { resetProjectInfo } from "../redux/slices/projectInfoSlice";
import { resetStandards } from "../redux/slices/standardSlice";
import { resetRoom } from "../redux/slices/roomSlice";
import { resetCustomer } from "../redux/slices/customerSlice";
import { clearUser } from "../redux/slices/userSlice";
import { persistor } from "../redux/store";

// Clears all Redux state + persisted localStorage.
export const handleLogout = async (dispatch) => {
  dispatch(resetProjectInfo());
  dispatch(resetStandards());  ;
  dispatch(resetRoom()); 
  dispatch(resetCustomer());  
  dispatch(clearUser());       // clears user_login_id, user_id, customer_id, name
  await persistor.purge();     // wipes redux-persist from localStorage
  localStorage.removeItem("persist:root");
};