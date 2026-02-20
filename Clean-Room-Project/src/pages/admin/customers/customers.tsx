import { useState, useEffect } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import s from "./customersDesign";
import AddCustomer from "./addCustomer";
import { customerDetails } from "../../../backend/controller/controller";

type Customer = {
  customer_id: number;
  customer_name: string;
  customer_email_id: string;
  customer_phone: string;
  customer_address: string;
  customers_additional_notes: string;
  created_at: string;
};

type CustomersProps = {
  onCountChange?: (count: number) => void;
};

export default function Customers({ onCountChange }: CustomersProps) {
  const [customers, setCustomers]   = useState<Customer[]>([]);
  const [search, setSearch]         = useState("");
  const [showAdd, setShowAdd]       = useState(false);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const data = await customerDetails();
        console.log("Customer data:", data);
        const list = data.customers ?? data;
        setCustomers(list);
        if (onCountChange) onCountChange(list.length);
      } catch (error) {
        console.error((error as Error).message);
        setFetchError("Failed to load customers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_email_id.toLowerCase().includes(search.toLowerCase())
  );

  if (showAdd) {
    return (
      <AddCustomer
        onCancel={() => setShowAdd(false)}
        onSaved={async () => {
          setShowAdd(false);
          try {
            const data = await customerDetails();
            console.log("Customer data:", data);
            const list = data.customers ?? data;
            setCustomers(list);
            if (onCountChange) onCountChange(list.length);
          } catch (error) {
            console.error((error as Error).message);
          }
        }}
      />
    );
  }

  return (
    <div>
      <div className={s.panelHeader}>
        <h1 className={s.panelTitle}>Customers</h1>
        <button type="button" onClick={() => setShowAdd(true)} className={s.addBtn}>
          <FiPlus className="text-base" /> Add Customer
        </button>
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
            </tr>
          </thead>
          <tbody className={s.tbody}>
            {loading ? (
              <tr><td colSpan={4} className={s.emptyRow}>Loading customers...</td></tr>
            ) : fetchError ? (
              <tr><td colSpan={4} className={s.emptyRow}>{fetchError}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className={s.emptyRow}>No customers found.</td></tr>
            ) : (
              filtered.map((customer) => (
                <tr key={customer.customer_id} className={s.tr}>
                  <td className={s.tdName}>{customer.customer_name}</td>
                  <td className={s.tdEmail}>{customer.customer_email_id}</td>
                  <td className={s.td}>{customer.customer_phone}</td>
                  <td className={s.td}>{customer.created_at?.split(" ")[0]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}