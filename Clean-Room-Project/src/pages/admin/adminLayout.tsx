// Admin Panel Shell

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiLogOut,
    FiBriefcase,
    FiUsers,
    FiUser,
    FiChevronDown,
    FiLock
} from "react-icons/fi";
import s from "./adminLayoutDesign";
import ds from "../dashboard/styles";
import Customers from "./customers/customers";
import Users from "./users";
import Screens from "./screens/screens";
import ProfilesPlaceholder from "./profiles/profilesPlaceholder";
import CreateEditProfile from "./profiles/createEditProfile";
import AssignProfileDetails from "./profiles/assignProfileDetails";

const ICON_MAP = {
    customers: FiBriefcase,
    users: FiUsers,
    profiles: FiUser,
    screens: FiLock,
};

const NAV_ITEMS = [
    { key: "customers", label: "Customers", count: 50 },
    { key: "users", label: "Users", count: 0 },
    { key: "profiles", label: "Profiles", count: 0, subItems: [{ key: "createEditProfile", label: "Create/Edit Profile" }, { key: "assignProfile", label: "Assign Profile" }] }, // profiles with its sub items
    { key: "screens", label: "Screens", count: 0 },
];

export default function Main() {
    const [activePanel, setActivePanel] = useState("customers");
    const [customerCount, setCustomerCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [screenCount, setScreenCount] = useState(0);
    const [profileCount, setProfileCount] = useState(0);
    const [assignmentCount, setAssignmentCount] = useState(0);
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

                // Fetch screens count
                const screenRes = await fetch("http://localhost:3000/v1/screens");
                const screenData = await screenRes.json();
                const screenList = screenData.screens ?? [];
                setScreenCount(screenList.length);

                // Fetch profiles count
                const profileRes = await fetch("http://localhost:3000/v1/profiles");
                const profileData = await profileRes.json();
                const profileList = profileData.profiles ?? [];
                setProfileCount(profileList.length);

                // Fetch assignments count
                const assignRes = await fetch("http://localhost:3000/v1/assigned-profiles");
                const assignData = await assignRes.json();
                const assignList = assignData.assignedProfiles ?? [];
                setAssignmentCount(assignList.length);
            } catch (error) {
                console.error("Count fetch error:", error);
            }
        };

        fetchCounts();
    }, []);

    const getBadge = (key: string) => {
        if (key === "customers") return customerCount;
        if (key === "users") return userCount;
        if (key === "screens") return screenCount;
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
                return <ProfilesPlaceholder />;
            case "createEditProfile":
                return <CreateEditProfile />;
            case "assignProfile":
                return <AssignProfileDetails />;
            case "screens":
                return <Screens onCountChange={setScreenCount} />;
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
                                                <div className="flex items-center justify-between w-full">
                                                    <span>{sub.label}</span>
                                                    {(sub.key === "createEditProfile" && profileCount > 0) && (
                                                        <span className={activePanel === sub.key ? s.navSubBadgeActive : s.navSubBadge}>
                                                            {profileCount}
                                                        </span>
                                                    )}
                                                    {(sub.key === "assignProfile" && assignmentCount > 0) && (
                                                        <span className={activePanel === sub.key ? s.navSubBadgeActive : s.navSubBadge}>
                                                            {assignmentCount}
                                                        </span>
                                                    )}
                                                </div>
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
