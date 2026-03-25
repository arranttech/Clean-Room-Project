import { database } from "../dbConnection/connections";

export const customerRepository = {
  getCustomerDetails: async () => {
    const [result] = await database.execute(`
      SELECT customer_unique_id, customer_id, admin_user_id, customer_name,
        customer_phone, customer_address, customer_email_id,
        customers_additional_notes, created_at, created_by,
        CASE WHEN status IS NULL OR status = '' THEN 'A' ELSE status END AS status
      FROM tCustomers
     
      ORDER BY created_at DESC
    `);
    return result;
  },

  createCustomer: async (payload: any) => {
    const admin_user_id = payload.admin_user_id || "lnredd";
    const status = payload.status || "A";
    const [result] = await database.execute(
      `INSERT INTO tCustomers 
      (admin_user_id, customer_name, customer_phone, customer_address, customer_email_id, customers_additional_notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        admin_user_id,
        payload.customerName,
        payload.phoneNumber,
        payload.customerAddress,
        payload.emailAddress,
        payload.additionalNotes,
        status,
      ]
    );
    return (result as any).insertId;
  },

  getCustomerById: async (customer_id: number) => {
    const [rows]: any = await database.execute(
      `SELECT customer_unique_id, customer_id, admin_user_id, customer_name,
        customer_phone, customer_address, customer_email_id,
        customers_additional_notes, created_at, created_by,
        CASE WHEN status IS NULL OR status = '' THEN 'A' ELSE status END AS status
      FROM tCustomers WHERE customer_id = ? LIMIT 1`,
      [customer_id]
    );
    return rows[0] || null;
  },

  updateCustomer: async (customer_id: number, payload: any) => {
    const status = payload.status || "A";
    const [result] = await database.execute(
      `UPDATE tCustomers
      SET customer_name = ?, customer_phone = ?, customer_address = ?,
        customer_email_id = ?, customers_additional_notes = ?, status = ?
      WHERE customer_id = ?`,
      [
        payload.customerName,
        payload.phoneNumber,
        payload.customerAddress,
        payload.emailAddress,
        payload.additionalNotes,
        status,
        customer_id,
      ]
    );
    return (result as any).affectedRows;
  },

  deleteCustomer: async (customer_id: number) => {
    const [result] = await database.execute(
      "UPDATE tCustomers SET status = 'I' WHERE customer_id = ?",
      [customer_id]
    );
    return (result as any).affectedRows;
  },

 
  // getCustomerInfo: async (user_login_id: number) => {
  //   const [resultSets]: any = await database.execute(
  //     "CALL new_cleanroom_db.CustomerInfoDetail(?)",
  //     [user_login_id]
  //   );
  //   const rows = resultSets[0];
  

  //   if (!rows?.length) {
  //     return { success: false, message: "Customer profile not found" };
  //   }

  //   const customer_ids = rows
  //     .map((r: any) => r.customer_id)
  //     .filter((id: any) => id !== null);

  
  //   const uniqueCustomerIds = [...new Set(customer_ids)];

  //   const customer = rows[0];
  //   return {
  //     success: true,
  //     customer: {
  //       //customer_id: customer.customer_id,
  //       customer_ids: uniqueCustomerIds,
  //       customer_name: customer.customer_name,
  //       customer_phone: customer.customer_phone,
  //       customer_address: customer.customer_address,
  //       customer_email_id: customer.customer_email_id,
  //       customers_additional_notes:
  //         customer.customers_additional_notes ||
  //         customer.customers_addional_notes ||
  //         "",
  //     },
  //   };
  // },

  getCustomerInfo: async (user_login_id: number) => {
  try {
    console.log("getCustomerInfo called with:", user_login_id);

    const [resultSets]: any = await database.execute(
      "CALL new_cleanroom_db.CustomerInfoDetail(?)",
      [user_login_id]
    );

    const rows = resultSets[0];

    console.log("RAW STORED PROC ROWS:", rows);

    if (!rows || rows.length === 0) {
      console.log("No customer data found");
      return { success: false, message: "Customer profile not found" };
    }

   
    const customers = rows.map((c: any) => ({
      customer_id: c.customer_id,
      customer_name: c.customer_name,
      customer_phone: c.customer_phone,
      customer_address: c.customer_address,
      customer_email_id: c.customer_email_id,
      customers_additional_notes:
        c.customers_additional_notes ||
        c.customers_addional_notes ||
        "",
    }));

    console.log("FINAL CUSTOMER ARRAY:", customers);

    return {
      success: true,
      customers, 
    };

  } catch (error) {
    console.error(" getCustomerInfo ERROR:", error);
    throw error;
  }
}
};
