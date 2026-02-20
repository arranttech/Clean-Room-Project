import { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import s from "./usersDesign";

interface UsersProps {
    onCountChange?: (count: number) => void;
}

type User = {
    user_login_id: number;
    user_first_name: string;
    user_last_name: string;
    user_id: number;
    user_email_id: string;
    user_address: string;
    user_phone_home: string;
    user_phone_work: string;
    created_date: string;
    created_by: string;
    updated_by: string;
    update_date: string;
    user_admin_flag: string;
    customer_id: number;
};

export default function Users({ onCountChange }: UsersProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/v1/users")
            .then((res) => res.json())
            .then((data) => {
                console.log("API Response:", data);

                const apiUsers: User[] = data.users || [];

                setUsers(apiUsers);
                onCountChange?.(apiUsers.length);
            })
            .catch((err) => {
                console.error("Frontend error:", err);
            });
    }, [onCountChange]);

    const filtered = users.filter(
        (u) =>
            u.user_first_name.toLowerCase().includes(search.toLowerCase()) ||
            u.user_email_id.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (loginId: number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const updated = users.filter((u) => u.user_login_id !== loginId);
            setUsers(updated);
            onCountChange?.(updated.length);
        }
    };

    const handleEdit = (user: User) => {
        alert(`Edit: ${user.user_first_name} ${user.user_last_name}`);
    };

    return (
        <div>
            <div className={s.panelHeader}>
                <h1 className={s.panelTitle}>Users</h1>
            </div>

            <div className={s.searchWrap}>
                <FiSearch className={s.searchIcon} />
                <input
                    type="text"
                    className={s.searchInput}
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className={s.tableWrap}>
                <table className={s.table}>
                    <thead className={s.thead}>
                        <tr>
                            <th className={s.th}>Name</th>
                            <th className={s.th}>Email</th>
                            <th className={s.th}>Admin</th>
                            <th className={s.th}>User ID</th>
                            <th className={s.th}>Address</th>
                            <th className={s.th}>Home Phone</th>
                            <th className={s.th}>Work Phone</th>
                            <th className={s.th}>Created Date</th>
                            <th className={s.th}>Created By</th>
                            <th className={s.th}>Updated Date</th>
                            <th className={s.th}>Updated By</th>
                            <th className={s.th}>Customer</th>
                            <th className={s.thActions}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={s.tbody}>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={s.emptyRow}>
                                    No users match your search.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((user) => (
                                <tr key={user.user_login_id} className={s.tr}>
                                    <td className={s.tdName}>
                                        {user.user_first_name} {user.user_last_name}
                                    </td>
                                    <td className={s.tdEmail}>{user.user_email_id}</td>
                                    <td className={s.td}>
                                        {user.user_admin_flag === "Yes" ? "Admin" : "User"}
                                    </td>
                                    <td className={s.td}>{user.user_id}</td>
                                    <td className={s.td}>{user.user_address}</td>
                                    <td className={s.td}>{user.user_phone_home}</td>
                                    <td className={s.td}>{user.user_phone_work}</td>
                                     <td className={s.td}>
                                        {user.created_date ? new Date(user.created_date).toISOString().split("T")[0] : "N/A"}
                                    </td>
                                    <td className={s.td}>{user.created_by}</td>
                                     <td className={s.td}>
                                        {user.update_date ? new Date(user.update_date).toISOString().split("T")[0] : "N/A"}
                                    </td>
                                    <td className={s.td}>{user.updated_by}</td>
                                    <td className={s.td}>{user.customer_id}</td>
                                    <td className={s.tdActions}>
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(user)}
                                            className={s.editBtn}
                                            title="Edit"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(user.user_login_id)
                                            }
                                            className={s.deleteBtn}
                                            title="Delete"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
