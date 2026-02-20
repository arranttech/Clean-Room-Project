// Admin Panel Shell

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiBriefcase, FiUsers, FiUser, FiShield } from "react-icons/fi";
import s from "./adminLayoutDesign";
import ds from "../dashboard/dashboardDesign";
import Customers from "./customers/customers";

const ICON_MAP = {
  customers:    FiBriefcase,
  users:        FiUsers,
  profiles:     FiUser,
  screenAccess: FiShield,
};

const NAV_ITEMS = [
  { key: "customers",     label: "Customers",     count: 5 },
  { key: "users",         label: "Users",         count: 0 },
  { key: "profiles",      label: "Profiles",      count: 0 },
  { key: "screenAccess",  label: "Screen Access", count: 0 },
];

export default function Main() {
  const [activePanel, setActivePanel] = useState("customers");
  const [customerCount, setCustomerCount] = useState(5);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getBadge = (key: string) => {
    if (key === "customers") return customerCount;
    const item = NAV_ITEMS.find((n) => n.key === key);
    return item ? item.count : 0;
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "customers":
        return <Customers onCountChange={setCustomerCount} />;
      case "users":
      case "profiles":
      case "screenAccess":
      default:
        return null;
    }
  };

  return (
    <div className={s.page}>
      <header className={ds.header}>
        <div className={ds.headerInner}>
          <div className={ds.left}>
            <div className={ds.logoTile}>
              <img src="/Arrant.jpeg" alt="Arrant Dynamics" className={ds.logoImg} />
            </div>
            <div className={ds.brand}>
              <div>ARRANT</div>
              <div>DYNAMICS</div>
            </div>
          </div>

          <div className={ds.center}>
            <div className={ds.title1}>STERI Clean Air</div>
            <div className={ds.subtitle1}>HVAC Matrix Platform</div>
          </div>

          <div className={ds.right}>
            <button type="button" className={ds.logout} onClick={handleLogout}>
              <FiLogOut className="text-[18px]" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className={s.body}>
        {/* Sidebar */}
        <aside className={s.sidebar}>
          <div className={s.sidebarTitle}>Arrant Admin Panel</div>
          {NAV_ITEMS.map((item) => {
            const isActive = activePanel === item.key;
            const badge = getBadge(item.key);
            const IconComponent = ICON_MAP[item.key as keyof typeof ICON_MAP];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActivePanel(item.key)}
                className={isActive ? s.navItemActive : s.navItem}
              >
                <span className={s.navIcon}>
                  <IconComponent />
                </span>
                <span className={s.navLabel}>{item.label}</span>
                {badge > 0 && (
                  <span className={isActive ? s.navBadgeActive : s.navBadge}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content */}
        <main className={s.content}>
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}