// src/backend/db.ts
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log('[DB CONNECTION] Checking environment variables...');
console.log('[DB CONNECTION] DB_HOST:', process.env.DB_HOST ? ' Set' : ' Missing');
console.log('[DB CONNECTION] DB_USER:', process.env.DB_USER ? ' Set' : ' Missing');
console.log('[DB CONNECTION] DB_PASSWORD:', process.env.DB_PASSWORD ? ' Set' : ' Missing');
console.log('[DB CONNECTION] DB_NAME:', process.env.DB_NAME ? ' Set' : ' Missing');
console.log('[DB CONNECTION] DB_PORT:', process.env.DB_PORT ? ' Set' : ' Missing');

export const database = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

database.getConnection()
  .then((conn) => {
    console.log('[DB CONNECTION]  Successfully connected to database!');
    conn.release();
  })
  .catch((err) => {
    console.error('[DB CONNECTION]  Failed to connect to database:', err.message);
  });
