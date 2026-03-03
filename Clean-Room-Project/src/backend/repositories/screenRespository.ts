import { database } from "../dbConnection/connections";

export const screenRepository = {
	getScreens: async (payload?: { screen_id?: number }) => {
		let query = `SELECT * FROM tSystemScreens`;
		const params: any[] = [];

		if (payload?.screen_id) {
			query += ` WHERE screen_id = ?`;
			params.push(payload.screen_id);
		}

		query += ` ORDER BY screen_id ASC`;

		const [result]: any = await database.execute(query, params);
		return result.map((r: any) => ({
			...r,
			screen_status: (r.screen_status === "A" || r.screen_status === "Active") ? "Active" : "Inactive"
		}));
	},

	createScreen: async (payload: any) => {
		const status = payload.screen_status === "Active" ? "A" : "I";
		const [result] = await database.execute(
			`INSERT INTO tSystemScreens (screen_name, screen_status) VALUES (?, ?)`,
			[payload.screen_name, status]
		);
		return (result as any).insertId;
	},

	updateScreen: async (screen_id: number, payload: any) => {
		const status = payload.screen_status === "Active" ? "A" : "I";
		const [result]: any = await database.execute(
			`UPDATE tSystemScreens SET screen_status = ? WHERE screen_id = ?`,
			[status, screen_id]
		);
		return result.affectedRows > 0;
	},
};
