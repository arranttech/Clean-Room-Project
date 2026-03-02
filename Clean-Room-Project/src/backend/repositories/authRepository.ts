import { database } from "../dbConnection/connections";
import bcrypt from "bcrypt";

export const authRepository = {
	loginUser: async (identifier: string, password: string) => {
		const [resultSets]: any = await database.execute(
			"CALL new_cleanroom_db.UserLoginDetail(?)",
			[identifier]
		);

		const rows = resultSets[0];

		if (!rows?.length) {
			return { success: false, message: "Account does not exist" };
		}

		const user = rows[0];

		if (!user.user_password) {
			return { success: false, message: "Password not found" };
		}
		
		const valid = await bcrypt.compare(password, user.user_password);
		if (!valid) {
			return { success: false, message: "Invalid credentials" };
		}

		return {
			success: true,
			user: {
				user_login_id: user?.user_login_id,
				user_id: user?.user_id,
				name: `${user?.user_first_name || ""} ${
					user?.user_last_name || ""
				}`.trim(),
			},
		};
	},
// for admin use only for getting user details
    getUserById: async (user_login_id: number) => {
        const [resultSets]: any =
            await database.execute(
                "CALL new_cleanroom_db.GetUserDetail(?)",
                [user_login_id]
            );

        const rows = resultSets[0];

        if (!rows || rows.length === 0){
            return {
                success: false,
                message: "User not found"
			};
            }	

        return {
            success: true,
            user: rows[0]
        };
    },

	createUserPassword: async (payload: {
		user_login_id: number;
		password: string;
	}) => {
		const hashedPassword = await bcrypt.hash(payload?.password, 10);

		await database.execute(
			`INSERT INTO tUserPassword (
        user_password,
        user_login_id,
        created_by,
        updated_by
      ) VALUES (?, ?, ?, ?)`,
			[hashedPassword, payload?.user_login_id, "admin", "admin"]
		);
	},
};
