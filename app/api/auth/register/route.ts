import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, initDB } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { seedDemo } from '@/lib/seed';

export async function POST(req: NextRequest) {
  try {
    await initDB();
    await seedDemo();

    const body = await req.json();
    const { name, email, password, role, phone, city, state, street, cep, cpf, crmv, crmv_state, graduation, bio, experience_years, services, specialties } = body;

    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email],
    });
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await db.execute({
      sql: `INSERT INTO users (name, email, password, role, phone, city, state, street, cep, cpf)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [name, email, hash, role, phone || null, city || null, state || null, street || null, cep || null, cpf || null],
    });

    const userId = Number(result.lastInsertRowid);

    if (role === 'cuidador' || role === 'veterinario') {
      await db.execute({
        sql: `INSERT INTO professionals (user_id, bio, experience_years, crmv, crmv_state, graduation, specialties, services, availability, rating, total_reviews, total_appointments)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0)`,
        args: [
          userId,
          bio || null,
          experience_years || 0,
          crmv || null,
          crmv_state || null,
          graduation || null,
          JSON.stringify(specialties || []),
          JSON.stringify(services || []),
          JSON.stringify({}),
        ],
      });
    }

    const token = signToken({ id: userId, email, name, role });

    const response = NextResponse.json({
      user: { id: userId, name, email, role },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
