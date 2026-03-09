import { resetProjectInfo } from "../redux/slices/projectInfoSlice";
import { resetStandards } from "../redux/slices/standardSlice";
import { resetRoom } from "../redux/slices/roomSlice";
import { resetCustomer } from "../redux/slices/customerSlice";
import { clearUser } from "../redux/slices/userSlice";
import { persistor } from "../redux/store";

export const handleLogout = async (dispatch) => {
  dispatch(resetProjectInfo());
  dispatch(resetStandards());
  dispatch(resetRoom());
  dispatch(resetCustomer());
  dispatch(clearUser());
  localStorage.removeItem("token");
  await persistor.purge(); // clears sessionStorage
};

export const CleanProjectDetails = (dispatch) => {
  dispatch(resetProjectInfo());
  dispatch(resetStandards());
  dispatch(resetRoom());
};