import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, initDB } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { seedDemo } from '@/lib/seed';

export async function POST(req: NextRequest) {
  try {
    await initDB();
    await seedDemo();

    const { email, password } = await req.json();

    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email],
    });

    const user = result.rows[0] as any;
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
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
