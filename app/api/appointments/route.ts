import { NextRequest, NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await initDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    let sql: string;
    const args: any[] = [session.id];

    if (session.role === 'tutor') {
      sql = `SELECT a.*, 
             u.name as professional_name, u.role as professional_role, u.avatar as professional_avatar,
             p.name as pet_name
             FROM appointments a
             JOIN users u ON u.id = a.professional_id
             LEFT JOIN pets p ON p.id = a.pet_id
             WHERE a.client_id = ?
             ORDER BY a.date DESC, a.time DESC`;
    } else {
      sql = `SELECT a.*,
             u.name as client_name, u.avatar as client_avatar,
             p.name as pet_name, p.species as pet_species, p.breed as pet_breed
             FROM appointments a
             JOIN users u ON u.id = a.client_id
             LEFT JOIN pets p ON p.id = a.pet_id
             WHERE a.professional_id = ?
             ORDER BY a.date DESC, a.time DESC`;
    }

    const result = await db.execute({ sql, args });
    return NextResponse.json({ appointments: result.rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const body = await req.json();
    const { professional_id, pet_id, service_type, description, date, time, location, notes } = body;

// Verifica se o horário já está ocupado para esse profissional
const conflict = await db.execute({
  sql: `SELECT id FROM appointments 
        WHERE professional_id = ? AND date = ? AND time = ? 
        AND status NOT IN ('cancelado')`,
  args: [professional_id, date, time],
});

if (conflict.rows.length > 0) {
  return NextResponse.json({ error: 'Este horário já está ocupado. Escolha outro horário.' }, { status: 409 });
}

const result = await db.execute({
  sql: `INSERT INTO appointments (client_id, professional_id, pet_id, service_type, description, date, time, location, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  args: [session.id, professional_id, pet_id || null, service_type, description || null, date, time, location || 'em_casa', notes || null],
});

return NextResponse.json({ id: Number(result.lastInsertRowid) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
