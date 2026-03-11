const { Pool } = require("pg");

const buildPool = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  const ssl = process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : false;

  return new Pool({
    connectionString,
    ssl,
  });
};

const pool = buildPool();

const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query,
};
