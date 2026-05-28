import { NextRequest, NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';
import { seedDemo } from '@/lib/seed';

export async function GET(req: NextRequest) {
  try {
    await initDB();
    await seedDemo();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'cuidador' | 'veterinario' | null
    const name = searchParams.get('name');

    let sql = `
      SELECT u.id, u.name, u.email, u.role, u.phone, u.city, u.state, u.avatar,
             p.bio, p.experience_years, p.crmv, p.crmv_state, p.graduation,
             p.specialties, p.certifications, p.services, p.availability,
             p.rating, p.total_reviews, p.total_appointments
      FROM users u
      JOIN professionals p ON p.user_id = u.id
      WHERE 1=1
    `;
    const args: any[] = [];

    if (type) {
      sql += ' AND u.role = ?';
      args.push(type);
    } else {
      sql += " AND u.role IN ('cuidador', 'veterinario')";
    }

    if (name) {
      sql += ' AND u.name LIKE ?';
      args.push(`%${name}%`);
    }

    sql += ' ORDER BY p.rating DESC';

    const result = await db.execute({ sql, args });

    const professionals = result.rows.map((row: any) => ({
      ...row,
      services: row.services ? JSON.parse(row.services) : [],
      specialties: row.specialties ? JSON.parse(row.specialties) : [],
      availability: row.availability ? JSON.parse(row.availability) : {},
      certifications: row.certifications ? JSON.parse(row.certifications) : [],
    }));

    return NextResponse.json({ professionals });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
