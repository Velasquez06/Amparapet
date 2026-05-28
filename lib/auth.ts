import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'amparapet_secret_2024';

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: 'tutor' | 'cuidador' | 'veterinario';
}

export function signToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function roleLabel(role: string) {
  const labels: Record<string, string> = {
    tutor: 'Tutor de Pet',
    cuidador: 'Cuidador',
    veterinario: 'Médico Veterinário',
  };
  return labels[role] || role;
}
