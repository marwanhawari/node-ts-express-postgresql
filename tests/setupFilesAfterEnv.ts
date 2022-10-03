import { pool } from "../src/db/postgresql";

global.afterAll(async () => {
    await pool.end();
});
