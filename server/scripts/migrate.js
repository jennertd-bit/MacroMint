const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const run = async () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Skipping migrations.");
    process.exit(1);
  }

  const ssl = process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : false;
  const pool = new Pool({ connectionString, ssl });

  try {
    const schemaPath = path.join(__dirname, "..", "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");
    await pool.query(sql);
    console.log("Database schema applied.");
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

run();
