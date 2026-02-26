// Admin Panel Shell

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
import {
	FiLogOut,
	FiBriefcase,
	FiUsers,
	FiUser,
	FiShield,
} from "react-icons/fi";
=======
import { FiLogOut, FiBriefcase, FiUsers, FiUser, FiLock, FiChevronDown } from "react-icons/fi";
>>>>>>> Stashed changes
import s from "./adminLayoutDesign";
import ds from "../dashboard/styles";
import Customers from "./customers/customers";
<<<<<<< Updated upstream
import Users from "./users";
import ScreenAccess from "./screenAccess";
=======
import Users from "./users/users";
import ScreenAccess from "./screens/screenAccess";
import ProfilesPlaceholder from "./profiles/profilesPlaceholder";
import CreateEditProfile from "./profiles/createEditProfile";
import AssignProfileDetails from "./profiles/assignProfileDetails";
>>>>>>> Stashed changes

// icon mapping for navigation items
const ICON_MAP = {
<<<<<<< Updated upstream
	customers: FiBriefcase,
	users: FiUsers,
	profiles: FiUser,
	screenAccess: FiShield,
};

const NAV_ITEMS = [
	{ key: "customers", label: "Customers", count: 50 },
	{ key: "users", label: "Users", count: 0 },
	{ key: "profiles", label: "Profiles", count: 0 },
	{ key: "screenAccess", label: "Screen Access", count: 0 },
=======
  customers: FiBriefcase,
  users: FiUsers,
  profiles: FiUser,
  screenAccess: FiLock,
};

const NAV_ITEMS = [
  { key: "customers", label: "Customers", count: 50 },
  { key: "users", label: "Users", count: 0 },
  { key: "profiles", label: "Profiles", count: 0, subItems: [{ key: "createEditProfile", label: "Create/Edit Profile" }, { key: "assignProfile", label: "Assign Profile" }] }, // profiles with its sub items
  { key: "screenAccess", label: "Screens", count: 0 },
>>>>>>> Stashed changes
];

export default function Main() {
	const [activePanel, setActivePanel] = useState("customers");
	const [customerCount, setCustomerCount] = useState(0);
	const [userCount, setUserCount] = useState(0);
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/");
	};

	useEffect(() => {
		const fetchCounts = async () => {
			try {
				// Fetch customers count
				const customerRes = await fetch("http://localhost:3000/v1/customers");
				const customerData = await customerRes.json();
				const customerList = customerData.customers ?? customerData;
				setCustomerCount(customerList.length);

				// Fetch users count
				const userRes = await fetch("http://localhost:3000/v1/users");
				const userData = await userRes.json();
				const userList = userData.users ?? [];
				setUserCount(userList.length);
			} catch (error) {
				console.error("Count fetch error:", error);
			}
		};

		fetchCounts();
	}, []);

	const getBadge = (key: string) => {
		if (key === "customers") return customerCount;
		if (key === "users") return userCount;
		const item = NAV_ITEMS.find((n) => n.key === key);
		return item ? item.count : 0;
	};

	const renderPanel = () => {
		switch (activePanel) {
			case "customers":
				return <Customers onCountChange={setCustomerCount} />;
			case "users":
				return <Users onCountChange={setUserCount} />;
			case "profiles":
				return null;
			case "screenAccess":
				return <ScreenAccess />;
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
							<img
								src="/Arrant.jpeg"
								alt="Arrant Dynamics"
								className={ds.logoImg}
							/>
						</div>
						<div className={ds.brand}>
							<div>ARRANT</div>
							<div>DYNAMICS</div>
						</div>
					</div>

<<<<<<< Updated upstream
					<div className={ds.center}>
						<div className={ds.title1}>STERI Clean Air</div>
						<div className={ds.subtitle1}>HVAC Matrix Platform</div>
					</div>
=======
  const renderPanel = () => {
    switch (activePanel) {
      case "customers":
        return <Customers onCountChange={setCustomerCount} />;
      case "users":
        return <Users onCountChange={setUserCount} />;
      case "profiles":
        return <ProfilesPlaceholder />;
      case "createEditProfile":
        return <CreateEditProfile />;
      case "assignProfile":
        return <AssignProfileDetails />;
      case "screenAccess":
        return <ScreenAccess />;
      default:
        return null;
    }
  };
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
				{/* Content */}
				<main className={s.content}>{renderPanel()}</main>
			</div>
		</div>
	);
}
=======
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
            const isSubItemActive = item.subItems?.some(sub => activePanel === sub.key);
            const isActive = activePanel === item.key || isSubItemActive;
            const badge = getBadge(item.key);
            const IconComponent = ICON_MAP[item.key as keyof typeof ICON_MAP];

            return (
              <div key={item.key} className="flex flex-col w-full">
                <button
                  type="button"
                  onClick={() => setActivePanel(item.key)}
                  className={isActive ? s.navItemActive : s.navItem}
                >
                  <div className={s.navItemLeft}>
                    <span className={s.navIcon}>
                      <IconComponent />
                    </span>
                    <span className={s.navLabel}>{item.label}</span>
                  </div>
                  {item.subItems ? (
                    <FiChevronDown className={`text-lg transition-transform ${isActive ? "rotate-180" : ""}`} />
                  ) : badge > 0 ? (
                    <span className={isActive ? s.navBadgeActive : s.navBadge}>
                      {badge}
                    </span>
                  ) : null}
                </button>
                {isActive && item.subItems && (
                  <div className={s.navSubList}>
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.key}
                        type="button"
                        onClick={() => setActivePanel(sub.key)}
                        className={activePanel === sub.key ? s.navSubItemActive : s.navSubItem}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
>>>>>>> Stashed changes
