import pg from "pg";

const { Pool } = pg;
let pool;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!isDatabaseConfigured()) return null;
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    const explicitSslMode = process.env.DATABASE_SSL;
    const usesSsl = explicitSslMode
      ? explicitSslMode !== "disable"
      : connectionString.includes("sslmode=require") || process.env.NODE_ENV === "production";
    pool = new Pool({
      connectionString,
      max: Number(process.env.DATABASE_POOL_SIZE || 4),
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
      allowExitOnIdle: true,
      ssl: usesSsl ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

export async function query(text, values = []) {
  const database = getPool();
  if (!database) throw new Error("DATABASE_NOT_CONFIGURED");
  return database.query(text, values);
}

export async function transaction(callback) {
  const database = getPool();
  if (!database) throw new Error("DATABASE_NOT_CONFIGURED");
  const client = await database.connect();
  try {
    await client.query("begin");
    const result = await callback(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
