import { database } from "../dbConnection/connections";
import bcrypt from "bcrypt";

export const userRepository = {
  createUser: async (payload: any) => {
    const connection = await database.getConnection();
    try {
      console.log("ENTER createUser()");
      await connection.beginTransaction();

      const [result]: any = await connection.execute(
        `INSERT INTO tUsers (
          user_first_name, user_last_name, user_id, user_email_id,
          user_address, user_phone_home, user_phone_work,
          created_by, updated_by, user_admin_flag, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payload.user_first_name,
          payload.user_last_name,
          payload.user_id,
          payload.user_email_id,
          payload.user_address || "",
          payload.user_phone_home || "",
          payload.user_phone_work || "",
          payload.created_by || "admin",
          payload.updated_by || "admin",
          payload.user_admin_flag === "Yes" ? "Y" : "N",
          payload.status || "A",
        ]
      );

      const userId = result.insertId;

      const customerIds = payload.customer_ids || [];
      for (const customerId of customerIds) {
        await connection.execute(
          `INSERT INTO tCustomerUsers (user_login_id, customer_id) VALUES (?, ?)`,
          [userId, customerId]
        );
      }

      await connection.commit();
      return userId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  updateUser: async (user_login_id: number, payload: any) => {
    const fields: string[] = [];
    const values: any[] = [];

    if (payload.user_first_name !== undefined) {
      fields.push("user_first_name = ?");
      values.push(payload.user_first_name);
    }
    if (payload.user_last_name !== undefined) {
      fields.push("user_last_name = ?");
      values.push(payload.user_last_name);
    }
    if (payload.user_email_id !== undefined) {
      fields.push("user_email_id = ?");
      values.push(payload.user_email_id);
    }
    if (payload.user_address !== undefined) {
      fields.push("user_address = ?");
      values.push(payload.user_address);
    }
    if (payload.user_phone_home !== undefined) {
      fields.push("user_phone_home = ?");
      values.push(payload.user_phone_home);
    }
    if (payload.user_phone_work !== undefined) {
      fields.push("user_phone_work = ?");
      values.push(payload.user_phone_work);
    }
    if (payload.user_admin_flag !== undefined) {
      fields.push("user_admin_flag = ?");
      values.push(payload.user_admin_flag === "Yes" ? "Y" : "N");
    }
    if (payload.status !== undefined) {
      fields.push("status = ?");
      values.push(payload.status);
    }

    fields.push("updated_by = ?");
    values.push(payload.updated_by || "admin");

    if (fields.length <= 1) return;

    values.push(user_login_id);

    await database.execute(
      `UPDATE tUsers SET ${fields.join(", ")} WHERE user_login_id = ?`,
      values
    );

    if (payload.customer_ids && Array.isArray(payload.customer_ids)) {
      await database.execute(
        `DELETE FROM tCustomerUsers WHERE user_login_id = ?`,
        [user_login_id]
      );
      for (const customerId of payload.customer_ids) {
        await database.execute(
          `INSERT INTO tCustomerUsers (user_login_id, customer_id) VALUES (?, ?)`,
          [user_login_id, customerId]
        );
      }
    }
  },

  updatePassword: async (
    user_login_id: number,
    current_password: string,
    new_password: string
  ) => {
    console.log("updatePassword called for user_login_id:", user_login_id);

    const [rows]: any = await database.execute(
      `SELECT user_password_id, user_password
       FROM tUserPassword
       WHERE user_login_id = ?
       ORDER BY created_date DESC LIMIT 1`,
      [user_login_id]
    );

    console.log("Password rows found:", rows?.length);

    if (!rows || rows.length === 0) {
      console.log("No password row found");
      return false;
    }

    const storedHash = rows[0].user_password;
    const passwordId = rows[0].user_password_id;

    const isMatch = await bcrypt.compare(current_password, storedHash);
    console.log("Password match:", isMatch);

    if (!isMatch) return false;

    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    await database.execute(
      `UPDATE tUserPassword
       SET user_password = ?, updated_date = NOW(), updated_by = 'user'
       WHERE user_password_id = ? AND user_login_id = ?`,
      [hashedNewPassword, passwordId, user_login_id]
    );

    console.log("Password updated successfully for user:", user_login_id);
    return true;
  },

  getUserById: async (user_login_id: number) => {
    console.log("getUserById called with:", user_login_id);
    const [rows]: any = await database.execute(
      `SELECT
        u.user_login_id,
        u.user_id,
        cu.customer_id,
        u.user_first_name,
        u.user_last_name,
        u.user_email_id,
        u.user_address,
        u.user_phone_home,
        u.user_phone_work,
        u.user_admin_flag,
        u.created_by,
        u.updated_by,
        u.created_date,
        u.updated_date,
        CASE WHEN u.status IS NULL OR u.status = '' THEN 'A' ELSE u.status END AS status
      FROM tUsers u
      LEFT JOIN tCustomerUsers cu ON u.user_login_id = cu.user_login_id
      WHERE u.user_login_id = ?`,
      [user_login_id]
    );

    if (!rows || rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    const customer_ids = rows
      .map((r: any) => r.customer_id)
      .filter((id: any) => id !== null);

    const { customer_id, ...rest } = rows[0];
    return { success: true, user: { ...rest, customer_ids } };
  },

  getUsers: async () => {
    const [rows] = await database.execute(`SELECT * FROM tUsers`);
    return rows;
  },

  deleteUser: async (user_login_id: number) => {
    const [result] = await database.execute(
      "UPDATE tUsers SET status = 'I' WHERE user_login_id = ?",
      [user_login_id]
    );
    return (result as any).affectedRows;
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
