import { Pool } from "pg";

const PSQL_URI = process.env.PSQL_URI ?? "";

export const pool = new Pool({
    connectionString: PSQL_URI,
});
