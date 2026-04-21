import { database } from "../dbConnection/connections";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { resetPasswordEmailTemplate } from "../emailTemplate/emailTemplate";

// Gmail transporter using .env GMAIL_USER and GMAIL_PASS
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Verify Gmail on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("=== GMAIL CONNECTION ERROR ===", error);
  } else {
    console.log("=== GMAIL READY TO SEND EMAILS ===", success);
  }
});

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

  // Updates tUserPassword with bcrypt hashed password
  // Called from Header sidebar change password
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

    if (!rows || rows.length === 0) return false;

    // bcrypt.compare verifies current password against stored hash
    const isMatch = await bcrypt.compare(
      current_password,
      rows[0].user_password
    );
    if (!isMatch) return false;

    // Hash new password before storing
    const hashedNewPassword = await bcrypt.hash(new_password, 10);
    await database.execute(
      `UPDATE tUserPassword
       SET user_password = ?, updated_date = NOW(), updated_by = 'user'
       WHERE user_password_id = ? AND user_login_id = ?`,
      [hashedNewPassword, rows[0].user_password_id, user_login_id]
    );

    return true;
  },

  // forgot password flow
  // Checks tUsers for email, generates token, stores hashed token in tPasswordResetTokens
  // Sends raw token in email link via Gmail
  sendPasswordResetLink: async (email: string) => {
    console.log("=== sendPasswordResetLink called with:", email);

    // Check if email exists in tUsers with status A (active)
    const [rows]: any = await database.execute(
      `SELECT user_login_id, user_first_name
       FROM tUsers
       WHERE user_email_id = ? AND status = 'A'
       LIMIT 1`,
      [email]
    );

    console.log("DB rows found:", rows?.length);

    // If not found return false — route returns 404 to frontend
    if (!rows || rows.length === 0) {
      console.log("NO USER FOUND — email not in DB or status not A");
      return false;
    }

    const user = rows[0];

    // Generate raw token (sent in email URL)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing in DB (security)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 15minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Store hashed token in tPasswordResetTokens
    // ON DUPLICATE KEY UPDATE replaces old token (one token per user)
    await database.execute(
      `INSERT INTO tPasswordResetTokens (user_login_id, token, expires_at, created_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE token = ?, expires_at = ?`,
      [user.user_login_id, hashedToken, expiresAt, hashedToken, expiresAt]
    );

    // Raw token goes in URL — user clicks this link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    console.log("Reset link:", resetLink);
    console.log("Sending to:", email);

    try {
      // Send email using Gmail via nodemailer
      // HTML template from emailTemplate.ts
      await transporter.sendMail({
        from: `"STERI Clean Air (Arrant Dynamics)" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Reset Your Password — STERI Clean Air (Arrant Dynamics)",
        html: resetPasswordEmailTemplate(user.user_first_name, resetLink),
      });
      console.log("=== EMAIL SENT SUCCESSFULLY to:", email);
    } catch (emailErr) {
      console.error("=== EMAIL SEND FAILED ===", emailErr);
      throw emailErr;
    }

    return true;
  },

  // Step 2 of forgot password flow
  // Called when /reset-password page loads to verify token is valid
  // Hashes incoming raw token and looks up in tPasswordResetTokens
  verifyResetToken: async (token: string) => {
    // Hash incoming raw token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [rows]: any = await database.execute(
      `SELECT user_login_id, expires_at
       FROM tPasswordResetTokens
       WHERE token = ? LIMIT 1`,
      [hashedToken]
    );

    // Token not found
    if (!rows || rows.length === 0) {
      return { valid: false, message: "Invalid reset link." };
    }

    // Token expired — delete it
    if (new Date() > new Date(rows[0].expires_at)) {
      await database.execute(
        `DELETE FROM tPasswordResetTokens WHERE token = ?`,
        [hashedToken]
      );
      return {
        valid: false,
        message: "Reset link has expired. Please request a new one.",
      };
    }

    return { valid: true };
  },

  // Step 3 of forgot password flow
  // Verifies token again, hashes new password, updates tUserPassword
  // Deletes token so it cannot be reused
  resetPassword: async (token: string, new_password: string) => {
    // Hash incoming raw token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [rows]: any = await database.execute(
      `SELECT user_login_id, expires_at
       FROM tPasswordResetTokens
       WHERE token = ? LIMIT 1`,
      [hashedToken]
    );

    // Token not found
    if (!rows || rows.length === 0) {
      return { success: false, message: "Invalid or expired reset link." };
    }

    // Token expired — delete it
    if (new Date() > new Date(rows[0].expires_at)) {
      await database.execute(
        `DELETE FROM tPasswordResetTokens WHERE token = ?`,
        [hashedToken]
      );
      return {
        success: false,
        message: "Reset link has expired. Please request a new one.",
      };
    }

    const { user_login_id } = rows[0];

    // Fetch current password to check if new password is the same
    const [pwdRows]: any = await database.execute(
      `SELECT user_password
       FROM tUserPassword
       WHERE user_login_id = ?
       ORDER BY created_date DESC LIMIT 1`,
      [user_login_id]
    );

    if (pwdRows && pwdRows.length > 0) {
      const isSamePassword = await bcrypt.compare(new_password, pwdRows[0].user_password);
      if (isSamePassword) {
        return { success: false, message: "New password cannot be the same as your current password." };
      }
    }

    // Hash new password with bcrypt before storing in tUserPassword
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update tUserPassword for this user only (WHERE user_login_id = ?)
    await database.execute(
      `UPDATE tUserPassword
       SET user_password = ?,
           updated_date = NOW(),
           updated_by = 'user'
       WHERE user_login_id = ?`,
      [hashedPassword, user_login_id]
    );

    // Delete token — cannot be reused after successful reset
    await database.execute(`DELETE FROM tPasswordResetTokens WHERE token = ?`, [
      hashedToken,
    ]);

    return { success: true, message: "Password reset successfully." };
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
