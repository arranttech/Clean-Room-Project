import { resetProjectInfo } from "../redux/slices/projectInfoSlice";
import { resetStandards } from "../redux/slices/standardSlice";
import { resetRoom } from "../redux/slices/roomSlice";
import { resetCustomer } from "../redux/slices/customerSlice";
import { clearUser } from "../redux/slices/userSlice";
import { persistor } from "../redux/store";


// Clears all Redux state + persisted localStorage.
export const handleLogout = (dispatch) => {
  dispatch(resetProjectInfo());
  dispatch(resetStandards());
  dispatch(resetRoom());
  dispatch(resetCustomer());
  dispatch(clearUser());
  localStorage.removeItem("token");
  localStorage.removeItem("persist:root");
  persistor.purge();
};