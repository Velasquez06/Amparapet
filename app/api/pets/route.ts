import { NextRequest, NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await initDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const result = await db.execute({
      sql: 'SELECT * FROM pets WHERE owner_id = ? ORDER BY name',
      args: [session.id],
    });

    return NextResponse.json({ pets: result.rows });
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
    const { name, species, breed, birth_date, weight, size, sex, color, microchip,
            castrated, vaccinated, conditions, allergies, medications,
            energy_level, behavior_tags, gets_along_pets, gets_along_kids, special_needs } = body;

    const result = await db.execute({
      sql: `INSERT INTO pets (owner_id, name, species, breed, birth_date, weight, size, sex, color,
            microchip, castrated, vaccinated, conditions, allergies, medications,
            energy_level, behavior_tags, gets_along_pets, gets_along_kids, special_needs)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [session.id, name, species || null, breed || null, birth_date || null,
             weight || null, size || null, sex || null, color || null, microchip || null,
             castrated ? 1 : 0, vaccinated ? 1 : 0, conditions || null, allergies || null,
             medications || null, energy_level || null,
             behavior_tags ? JSON.stringify(behavior_tags) : null,
             gets_along_pets || null, gets_along_kids || null, special_needs || null],
    });

    return NextResponse.json({ id: Number(result.lastInsertRowid) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
