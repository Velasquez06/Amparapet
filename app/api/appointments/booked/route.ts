import { NextRequest, NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await initDB();
    const { searchParams } = new URL(req.url);
    const professional_id = searchParams.get('professional_id');
    const date = searchParams.get('date');

    if (!professional_id || !date) {
      return NextResponse.json({ times: [] });
    }

    const result = await db.execute({
      sql: `SELECT time FROM appointments 
            WHERE professional_id = ? AND date = ? 
            AND status NOT IN ('cancelado')`,
      args: [professional_id, date],
    });

    const times = result.rows.map(r => r.time as string);
    return NextResponse.json({ times });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ times: [] });
  }
}