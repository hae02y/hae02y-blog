import 'server-only';
import { asc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/db';

export async function getPublishedApps() {
  return getDb().select().from(schema.apps)
    .where(eq(schema.apps.published, true))
    .orderBy(asc(schema.apps.sortOrder), asc(schema.apps.id));
}
