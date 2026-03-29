import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config();
const db = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });
async function main() {
  const res = await db.execute(`
    SELECT team_name, channel_id, lang, fail_count, last_failed_at
    FROM slack_workspaces
    ORDER BY fail_count DESC
  `);
  res.rows.forEach(r => console.log(`  [${r.channel_id?.toString().startsWith('D') ? 'DM' : '  '}] ${r.team_name} — 실패: ${r.fail_count}, 마지막실패: ${r.last_failed_at ?? '-'}`));
}
main().catch(console.error);
