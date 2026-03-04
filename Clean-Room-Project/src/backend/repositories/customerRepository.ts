import { database } from "../dbConnection/connections";

export const customerRepository = {
	getCustomerDetails: async (payload?: { admin_user_id?: string }) => {
		let query = `
			SELECT customer_unique_id, customer_id, admin_user_id, customer_name,
				customer_phone, customer_address, customer_email_id,
				customers_additional_notes, created_at, created_by,
				CASE WHEN status IS NULL OR status = '' THEN 'A' ELSE status END AS status
			FROM tCustomers
		`;
		const params: any[] = [];

		if (payload?.admin_user_id) {
			query += ` WHERE admin_user_id = ?`;
			params.push(payload.admin_user_id);
		}

		const [result] = await database.execute(query, params);
		return result;
	},

	createCustomer: async (payload: any) => {
		const adminUserId = "lnredd";
		const admin_user_id = payload.admin_user_id || adminUserId;
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
			[payload.customerName, payload.phoneNumber, payload.customerAddress, payload.emailAddress, payload.additionalNotes, status, customer_id]
		);
		return (result as any).affectedRows;
	},

	// Row is never deleted — only status updated to 'I' (Inactive)
	deleteCustomer: async (customer_id: number) => {
		const [result] = await database.execute(
			"UPDATE tCustomers SET status = 'I' WHERE customer_id = ?",
			[customer_id]
		);
		return (result as any).affectedRows;
	},

	getCustomerInfo: async (user_login_id: number) => {
		const [resultSets]: any = await database.execute(
			"CALL new_cleanroom_db.CustomerInfoDetail(?)",
			[user_login_id]
		);

		const rows = resultSets[0];

		if (!rows?.length) {
			return { success: false, message: "Customer profile not found" };
		}

		const customer = rows[0];

		return {
			success: true,
			customer: {
				customer_id: customer.customer_id,
				customer_name: customer.customer_name,
				customer_phone: customer.customer_phone,
				customer_address: customer.customer_address,
				customer_email_id: customer.customer_email_id,
				customers_addional_notes: customer.customers_addional_notes,
			},
		};
	},
};
