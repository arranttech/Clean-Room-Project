import { database } from "../dbConnection/connections";

export const screenRepository = {
	getScreens: async () => {
		try {
			const [rows] = await database.execute(
				`SELECT * FROM tSystemScreens ORDER BY screen_id ASC`
			);
			return rows;
		} catch (err) {
			// Fast fail if table missing
			if ((err as any).code === "ER_NO_SUCH_TABLE") {
				console.warn(
					"Table tScreens missing. Ensure database initialization is correct."
				);
				return [];
			}
			console.error("Error in getScreens:", err);
			throw err;
		}
	},

	createScreen: async (payload: any) => {
		try {
			const [result] = await database.execute(
				`INSERT INTO tSystemScreens (screen_name) VALUES (?)`,
				[payload.name]
			);
			return (result as any).insertId;
		} catch (err) {
			console.error("Error in createScreen:", err);
			throw err;
		}
	},

	updateScreen: async (id: number, payload: any) => {
		try {
			const [result]: any = await database.execute(
				`UPDATE tSystemScreens SET screen_status = ? WHERE screen_id = ?`,
				[payload.status, id]
			);
			return result.affectedRows > 0;
		} catch (err) {
			console.error("Error in updateScreen:", err);
			throw err;
		}
	},
};
