import app from "./api/app";
import { pool } from "./db/postgresql";
const PORT = process.env.PORT || 5050;

async function main() {
    await pool.connect();

    app.listen(PORT, () =>
        console.log(`Started API server at http://localhost:${PORT}`)
    );
}

main();
