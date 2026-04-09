import { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import s from "./styles";
import AddUser from "./addUsers";
import {
  getUsers,
  getUserById,
  deleteUser,
} from "../../../backend/controller/userController";

interface UsersProps {
  onCountChange?: (count: number) => void;
}

type User = {
  user_login_id: number;
  user_first_name: string;
  user_last_name: string;
  user_id: string;
  user_email_id: string;
  user_address: string;
  user_phone_home: string;
  user_phone_work: string;
  created_date: string;
  created_by: string;
  updated_by: string;
  updated_date: string;
  user_admin_flag: string;
  customer_id: number;
  status: string;
};

export default function Users({ onCountChange }: UsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "A" | "I">("ALL");
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 10;

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      const list = data.users ?? data ?? [];
      setUsers(list);
      if (onCountChange) onCountChange(list.length);
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.user_first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.user_email_id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ? true : u.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const nameA = `${a.user_first_name} ${a.user_last_name}`.toLowerCase();
    const nameB = `${b.user_first_name} ${b.user_last_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filtered.slice(startIndex, startIndex + USERS_PER_PAGE);

  const handleEdit = async (user: User) => {
    try {
      const data = await getUserById(user.user_login_id);
      // route returns { success, user } — same pattern as customers
      if (!data?.success || !data?.user) {
        console.error("User not found or fetch failed");
        return;
      }
      setEditUser(data.user);
      setShowAdd(true);
    } catch (error) {
      console.error("Failed to fetch user:", (error as Error).message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.user_login_id);
      setUsers((prev) =>
        prev.map((u) =>
          u.user_login_id === deleteTarget.user_login_id
            ? { ...u, status: "I" }
            : u
        )
      );
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  if (showAdd) {
    return (
      <AddUser
        user={editUser}
        onCancel={() => {
          setShowAdd(false);
          setEditUser(null);
        }}
        onSaved={async () => {
          setShowAdd(false);
          setEditUser(null);
          await loadUsers();
        }}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={s.panelHeader}>
        <h1 className={s.panelTitle}>Users</h1>
        <button
          type="button"
          onClick={() => {
            setEditUser(null);
            setShowAdd(true);
          }}
          className={s.addBtn}
        >
          <FiPlus /> Add User
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className={s.filterWrap}>
        {(["ALL", "A", "I"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={s.filterBtn(statusFilter === f, f)}
          >
            {f === "ALL" ? "All" : f === "A" ? "Active" : "Inactive"}
          </button>
        ))}
      </div>

      {/* Search */}
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

      {/* Table */}
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
              <th className={s.th}>Status</th>
              <th className={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody className={s.tbody}>
            {loading ? (
              <tr>
                <td colSpan={9} className={s.emptyRow}>
                  Loading users...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className={s.emptyRow}>
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.user_login_id} className={s.tr}>
                  <td className={s.tdName}>
                    {user.user_first_name} {user.user_last_name}
                  </td>
                  <td className={s.tdEmail}>{user.user_email_id}</td>
                  <td className={s.td}>
                    {user.user_admin_flag === "Y" ? "Admin" : "User"}
                  </td>
                  <td className={s.td}>{user.user_id}</td>
                  <td className={s.td}>{user.user_address}</td>
                  <td className={s.td}>{user.user_phone_home}</td>
                  <td className={s.td}>{user.user_phone_work}</td>
                  <td className={s.td}>
                    {user.status === "I" ? (
                      <span className={s.statusInactive}>Inactive</span>
                    ) : (
                      <span className={s.statusActive}>Active</span>
                    )}
                  </td>
                  <td className={s.td}>
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
                        user.status !== "I" && setDeleteTarget(user)
                      }
                      className={
                        user.status === "I"
                          ? "text-slate-300 cursor-not-allowed p-1.5 rounded-lg"
                          : s.deleteBtn
                      }
                      title={
                        user.status === "I" ? "Already inactive" : "Delete"
                      }
                      disabled={user.status === "I"}
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

      {/* adding Pages if more than 10 users in a page */}
      {totalPages > 1 && (
        <div className={s.paginationWrap}>
          <div className={s.paginationInfo}>
            Showing <span className="text-slate-900">{startIndex + 1}</span> to{" "}
            <span className="text-slate-900">
              {Math.min(startIndex + USERS_PER_PAGE, filtered.length)}
            </span>{" "}
            of <span className="text-slate-900">{filtered.length}</span> entries
          </div>

          <div className={s.paginationControls}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={s.paginationNavBtn(currentPage === 1)}
            >
              <FiChevronLeft className="text-lg" /> Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={s.paginationBtn(currentPage === page, false)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={s.paginationNavBtn(currentPage === totalPages)}
            >
              Next <FiChevronRight className="text-lg" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className={s.deleteOverlay}>
          <div
            className={s.deleteBackdrop}
            onClick={() => setDeleteTarget(null)}
          />
          <div className={s.deleteCard}>
            <div className={s.deleteIconWrap}>
              <FiTrash2 className={s.deleteIcon} />
            </div>
            <h2 className={s.deleteTitle}>Delete User</h2>
            <p className={s.deleteMessage}>
              Are you sure you want to delete{" "}
              <span className={s.deleteUserName}>
                {deleteTarget.user_first_name} {deleteTarget.user_last_name}
              </span>
              ? They will be marked as inactive.
            </p>
            <div className={s.deleteBtnRow}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className={s.deleteCancelBtn}
              >
                <FiX className="text-base" /> No, Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className={s.deleteConfirmBtn}
              >
                <FiTrash2 className="text-base" /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
