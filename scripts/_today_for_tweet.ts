import { createClient } from '@libsql/client';
const db = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });
async function main() {
  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const dateStr = kstNow.toISOString().slice(0, 10);
  const rows = await db.execute({
    sql: `SELECT id, source, title, one_liner, how_to_apply FROM papers 
          WHERE DATE(datetime(collected_at, '+9 hours')) = ? 
          AND summarized_at IS NOT NULL
          ORDER BY collected_at DESC LIMIT 30`,
    args: [dateStr]
  });
  console.log(JSON.stringify({ date: dateStr, rows: rows.rows }, null, 2));
}
main().catch(console.error);
