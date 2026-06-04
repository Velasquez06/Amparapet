    import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getSession } from '@/lib/auth';
import { db, initDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const formData = await req.formData();
    const type = formData.get('type') as string; // 'avatar', 'diploma', 'crmv_file'
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });

    // Valida tipo do arquivo
    const allowedImages = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedDocs = ['application/pdf', 'image/jpeg', 'image/png'];

    if (type === 'avatar' && !allowedImages.includes(file.type)) {
      return NextResponse.json({ error: 'Foto deve ser JPG, PNG ou WEBP' }, { status: 400 });
    }
    if ((type === 'diploma' || type === 'crmv_file') && !allowedDocs.includes(file.type)) {
      return NextResponse.json({ error: 'Documento deve ser PDF, JPG ou PNG' }, { status: 400 });
    }

    // Cria pasta se não existir
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    await mkdir(uploadDir, { recursive: true });

    // Nome único para o arquivo
    const ext = file.name.split('.').pop();
    const filename = `${session.id}_${Date.now()}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Salva o arquivo
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const publicPath = `/uploads/${type}/${filename}`;

    // Atualiza o banco conforme o tipo
    if (type === 'avatar') {
      await db.execute({
        sql: `UPDATE users SET avatar = ? WHERE id = ?`,
        args: [publicPath, session.id],
      });
    } else if (type === 'diploma' || type === 'crmv_file') {
      await db.execute({
        sql: `UPDATE professionals SET ${type} = ? WHERE user_id = ?`,
        args: [publicPath, session.id],
      });
    }

    return NextResponse.json({ path: publicPath });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 });
  }
}