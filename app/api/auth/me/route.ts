import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db, initDB } from '@/lib/db';
import { seedDemo } from '@/lib/seed';

export async function GET() {
  try {
    await initDB();
    await seedDemo();
    const session = await getSession();
    if (!session) return NextResponse.json({ user: null });

    const result = await db.execute({
      sql: 'SELECT id, name, email, role, phone, city, state, avatar FROM users WHERE id = ?',
      args: [session.id],
    });

    return NextResponse.json({ user: result.rows[0] || null });
  } catch {
    return NextResponse.json({ user: null });
  }
}
