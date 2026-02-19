// Customers panel for Admin

import { useState } from "react";
import { FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import s from "./customersDesign";

type Customer = {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  created: string;
};

const mockCustomers: Customer[] = [
  { id: 1, customerName: "Acme Corporation",      email: "contact@acme.com",        phone: "+1-555-0100", created: "2026-01-15" },
  { id: 2, customerName: "Global Industries Inc", email: "info@global.com",          phone: "+1-555-0200", created: "2026-01-22" },
  { id: 3, customerName: "Tech Solutions Ltd",    email: "hello@techsolutions.com",  phone: "+1-555-0300", created: "2026-02-05" },
  { id: 4, customerName: "Manufacturing Pro",     email: "sales@mfgpro.com",         phone: "+1-555-0400", created: "2026-02-10" },
  { id: 5, customerName: "Healthcare Systems",    email: "admin@healthcare.com",     phone: "+1-555-0500", created: "2026-02-12" },
];

interface CustomersProps {
  onCountChange?: (count: number) => void;
}

export default function Customers({ onCountChange }: CustomersProps) {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const updated = customers.filter((c) => c.id !== id);
      setCustomers(updated);
      onCountChange?.(updated.length);
    }
  };

  const handleEdit = (customer: Customer) => {
    alert(`Edit: ${customer.customerName}`);
  };

  return (
    <div>
      <div className={s.panelHeader}>
        <h1 className={s.panelTitle}>Customers</h1>
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

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.th}>Customer Name</th>
              <th className={s.th}>Email</th>
              <th className={s.th}>Phone</th>
              <th className={s.th}>Created</th>
              <th className={s.thActions}>Actions</th>
            </tr>
          </thead>
          <tbody className={s.tbody}>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className={s.emptyRow}>
                  No customers match your search.
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr key={customer.id} className={s.tr}>
                  <td className={s.tdName}>{customer.customerName}</td>
                  <td className={s.tdEmail}>{customer.email}</td>
                  <td className={s.td}>{customer.phone}</td>
                  <td className={s.td}>{customer.created}</td>
                  <td className={s.tdActions}>
                    <button type="button" onClick={() => handleEdit(customer)} className={s.editBtn} title="Edit">
                      <FiEdit2 className="text-base" />
                    </button>
                    <button type="button" onClick={() => handleDelete(customer.id)} className={s.deleteBtn} title="Delete">
                      <FiTrash2 className="text-base" />
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