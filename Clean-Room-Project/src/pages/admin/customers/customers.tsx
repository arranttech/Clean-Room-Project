import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import s from "./styles";
import AddCustomer from ".";
import {
  customerDetails,
  getCustomerById,
  deleteCustomer,
} from "../../../backend/controller/customerController";

type Customer = {
  customer_id: number;
  customer_name: string;
  customer_email_id: string;
  customer_phone: string;
  customer_address: string;
  customers_additional_notes: string;
  status: string;
  created_at: string;
};

type CustomersProps = {
  onCountChange?: (count: number) => void;
};

export default function Customers({ onCountChange }: CustomersProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "A" | "I">("ALL");
  const [showAdd, setShowAdd] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const loadCustomers = async () => {
    try {
      const data = await customerDetails();
      const list = data.customers ?? data;
      setCustomers(list);
      if (onCountChange) onCountChange(list.length);
    } catch (error) {
      setFetchError("Failed to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleEdit = async (customerId: number) => {
    try {
      const data = await getCustomerById(customerId);
      const customer = data.customer ?? data;
      setEditCustomer(customer);
      setShowAdd(true);
    } catch (error) {
      console.error("Failed to fetch customer:", (error as Error).message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCustomer(deleteTarget.customer_id);
      setCustomers((prev) =>
        prev.map((c) =>
          c.customer_id === deleteTarget.customer_id ? { ...c, status: "I" } : c
        )
      );
    } catch (error) {
      console.error("Delete failed:", (error as Error).message);
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = customers
    .filter((c) => {
      const matchesSearch =
        c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        c.customer_email_id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" ? true : c.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => b.customer_id - a.customer_id); // latest added first

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (showAdd) {
    return (
      <AddCustomer
        customer={editCustomer}
        onCancel={() => {
          setShowAdd(false);
          setEditCustomer(null);
        }}
        onSaved={async () => {
          setShowAdd(false);
          setEditCustomer(null);
          await loadCustomers();
        }}
      />
    );
  }

  return (
    <div>
      <div className={s.panelHeader}>
        <h1 className={s.panelTitle}>Customers</h1>
        <button
          type="button"
          onClick={() => {
            setEditCustomer(null);
            setShowAdd(true);
          }}
          className={s.addBtn}
        >
          <FiPlus className="text-base" /> Add Customer
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {(["ALL", "A", "I"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${statusFilter === f
                ? f === "I"
                  ? "bg-red-500 text-white border-red-500"
                  : f === "A"
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
              }`}
          >
            {f === "ALL" ? "All" : f === "A" ? "Active" : "Inactive"}
          </button>
        ))}
      </div>

      <div className={s.searchWrap}>
        <FiSearch className={s.searchIcon} />
        <input
          type="text"
          className={s.searchInput}
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {fetchError && (
        <p className="text-red-500 text-sm text-center py-3">{fetchError}</p>
      )}
      
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.th}>ID</th>
              <th className={s.th}>Customer Name</th>
              <th className={s.th}>Email</th>
              <th className={s.th}>Phone</th>
              <th className={s.th}>Status</th>
              <th className={s.thActions}>Actions</th>
            </tr>
          </thead>
          <tbody className={s.tbody}>
            {loading ? (
              <tr>
                <td colSpan={6} className={s.emptyRow}>
                  Loading customers...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className={s.emptyRow}>
                  No customers found.
                </td>
              </tr>
            ) : (
              paginatedData.map((customer) => (
                <tr key={customer.customer_id} className={s.tr}>
                  <td className={s.td}>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-200 text-black-900">
                      {customer.customer_id}
                    </span>
                  </td>
                  <td className={s.tdName}>{customer.customer_name}</td>
                  <td className={s.tdEmail}>{customer.customer_email_id}</td>
                  <td className={s.td}>{customer.customer_phone}</td>
                  <td className={s.td}>
                    {customer.status === "I" ? (
                      <span className={s.statusInactive}>Inactive</span>
                    ) : (
                      <span className={s.statusActive}>Active</span>
                    )}
                  </td>
                  <td className={s.tdActions}>
                    <button
                      className={s.editBtn}
                      title="Edit customer"
                      onClick={() => handleEdit(customer.customer_id)}
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      className={
                        customer.status === "I"
                          ? "text-slate-300 cursor-not-allowed p-1.5 rounded-lg"
                          : s.deleteBtn
                      }
                      title={
                        customer.status === "I"
                          ? "Already inactive"
                          : "Set Inactive"
                      }
                      disabled={customer.status === "I"}
                      onClick={() =>
                        customer.status !== "I" && setDeleteTarget(customer)
                      }
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={s.paginationWrap}>
          <div className={s.paginationInfo}>
            Showing <span className="text-slate-900">{startIndex + 1}</span> to{" "}
            <span className="text-slate-900">
              {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}
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
            <h2 className={s.deleteTitle}>Delete Customer</h2>
            <p className={s.deleteMessage}>
              Are you sure you want to delete{" "}
              <span className={s.deleteCustomerName}>
                {deleteTarget.customer_name}
              </span>
              ? This action cannot be undone.
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