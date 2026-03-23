import { db } from '../src/lib/db';
import { slackWorkspaces } from '../src/lib/db/schema';

async function main() {
  const rows = await db.select().from(slackWorkspaces);
  console.log('등록된 워크스페이스:', rows.length);
  rows.forEach(r => console.log('-', r.teamName, '|', r.teamId));
}
main().catch(console.error);
