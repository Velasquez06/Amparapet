import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const result = await db.execute({
      sql: `SELECT u.id, u.name, u.email, u.role, u.phone, u.city, u.state, u.avatar,
                   p.bio, p.experience_years, p.crmv, p.crmv_state, p.graduation,
                   p.specialties, p.certifications, p.services, p.availability,
                   p.rating, p.total_reviews, p.total_appointments
            FROM users u
            JOIN professionals p ON p.user_id = u.id
            WHERE u.id = ?`,
      args: [id],
    });

    if (!result.rows.length) {
      return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 });
    }

    const row = result.rows[0] as any;
    const professional = {
      ...row,
      services: row.services ? JSON.parse(row.services) : [],
      specialties: row.specialties ? JSON.parse(row.specialties) : [],
      availability: row.availability ? JSON.parse(row.availability) : {},
      certifications: row.certifications ? JSON.parse(row.certifications) : [],
    };

    // Get reviews
    const reviews = await db.execute({
      sql: `SELECT r.rating, r.comment, r.created_at, u.name as reviewer_name
            FROM reviews r JOIN users u ON u.id = r.reviewer_id
            WHERE r.professional_id = ? ORDER BY r.created_at DESC LIMIT 5`,
      args: [id],
    });

    return NextResponse.json({ professional, reviews: reviews.rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
