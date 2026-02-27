import { database } from "../dbConnection/connections";

export const userRepository = {
	createUser: async (payload: any) => {
		const [result] = await database.execute(
			`INSERT INTO tUsers (
        user_first_name,
        user_last_name,
        user_id,
        user_email_id,
        user_address,
        user_phone_home,
        user_phone_work,
        created_by,
        updated_by,
        user_admin_flag,
        customer_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				payload.user_first_name,
				payload.user_last_name,
				payload.user_id || null,
				payload.user_email_id,
				payload.user_address || null,
				payload.user_phone_home || null,
				payload.user_phone_work || null,
				payload.created_by || "admin",
				payload.updated_by || "admin",
				payload.user_admin_flag || "No",
				payload.customer_id || null,
			]
		);

		return (result as any).insertId;
	},

	getUsers: async () => {
		const [rows] = await database.execute(`SELECT * FROM tUsers`);
		return rows;
	},

	deleteUser: async (user_login_id: number) => {
		await database.execute(
			`DELETE FROM tUserPassword WHERE user_login_id = ?`,
			[user_login_id]
		);

		const [result]: any = await database.execute(
			`DELETE FROM tUsers WHERE user_login_id = ?`,
			[user_login_id]
		);

		return result.affectedRows > 0;
	},

	getUserDetails: async (payload?: { admin_id?: string }) => {
		let query = `SELECT * FROM tUsers`;
		const params: any[] = [];

		if (payload?.admin_id) {
			query += ` WHERE admin_id = ?`;
			params.push(payload.admin_id);
		}

		const [result] = await database.execute(query, params);
		return result;
	},
};
