import { Pool } from "pg";

export const db = new Pool({
  connectionString: process.env.library_pi_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});