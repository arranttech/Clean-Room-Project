import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getUserById } from "../../backend/controller/userController";
import { handleLogout } from "../../utils/logout";
import { FiLogOut } from "react-icons/fi";
import s from "./styles";


export default function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
  
    const loggedInUser = useAppSelector((state) => state.user);
    const [userEmail, setUserEmail] = useState("");
    const [userFullName, setUserFullName] = useState("");
  
    useEffect(() => {
      if (!loggedInUser?.user_login_id) return;
  
      const fetchUserDetails = async () => {
        try {
          const res = await getUserById(loggedInUser.user_login_id);
          const u = res?.user ?? res;
          if (u) {
            setUserFullName(`${u.user_first_name || ""} ${u.user_last_name || ""}`.trim());
            setUserEmail(u.user_email_id || "");
          }
        } catch (e) {
          console.error("Failed to fetch user details:", e);
        }
      };
  
      fetchUserDetails();
    }, [loggedInUser?.user_login_id]);
  
    const displayName = userFullName || loggedInUser?.name;
  
    const onLogout = () => {
      handleLogout(dispatch);
      navigate("/");
    };
  
    return (
      <header className={s.header}>
        <div className={s.headerInner}>
          <div className={s.left}>
            <div className={s.logoTile}>
              <img src="/Arrant.jpeg" alt="Arrant Dynamics" className={s.logoImg} />
            </div>
            <div className={s.brand}>
              <div>ARRANT</div>
              <div>DYNAMICS</div>
            </div>
          </div>
  
          <div className={s.center}>
            <div className={s.title1}>STERI Clean Air</div>
            <div className={s.subtitle1}>HVAC Matrix Platform</div>
          </div>
  
          <div className={s.right}>
            <div className="flex flex-col items-end mr-4 sm:flex">
              <span className="text-sm font-bold text-blue-600">{displayName}</span>
              {userEmail && <span className="text-xs text-slate-500 mt-0.5">{userEmail}</span>}
            </div>
            <div className="w-px h-8 bg-slate-200 mr-4 hidden sm:block" />
            <button type="button" className={s.logout} onClick={onLogout}>
              <FiLogOut className="text-[18px]" />
              Logout
            </button>
          </div>
        </div>
      </header>
    );
  }