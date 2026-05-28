import { db } from './db';
import bcrypt from 'bcryptjs';

export async function seedDemo() {
  // Check if already seeded
  const existing = await db.execute('SELECT COUNT(*) as count FROM users');
  if ((existing.rows[0] as any).count > 0) return;

  const hash = await bcrypt.hash('123456', 10);

  // Tutor
  await db.execute({
    sql: `INSERT INTO users (name, email, password, role, phone, city, state, cpf)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ['Ana Carolina', 'tutor@demo.com', hash, 'tutor', '(61) 9 9999-0001', 'Brasília', 'DF', '000.000.000-01']
  });

  // Cuidador
  await db.execute({
    sql: `INSERT INTO users (name, email, password, role, phone, city, state, cpf)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ['Vinícius Coelho', 'cuidador@demo.com', hash, 'cuidador', '(61) 9 9999-0002', 'Brasília', 'DF', '000.000.000-02']
  });

  // Veterinário
  await db.execute({
    sql: `INSERT INTO users (name, email, password, role, phone, city, state, cpf)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ['Dra. Helena Andrade', 'vet@demo.com', hash, 'veterinario', '(61) 9 9999-0003', 'Brasília', 'DF', '000.000.000-03']
  });

  await db.execute({
    sql: `INSERT INTO users (name, email, password, role, phone, city, state, cpf)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ['Dr. Carlos Oliveira', 'vet2@demo.com', hash, 'veterinario', '(61) 9 9999-0004', 'Brasília', 'DF', '000.000.000-04']
  });

  // Professional profiles
  await db.execute({
    sql: `INSERT INTO professionals (user_id, bio, experience_years, services, availability, rating, total_reviews, total_appointments)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [2, 'Apaixonado por animais há mais de 5 anos, especializado em cuidados diários e passeios.', 5,
      JSON.stringify(['Passeios', 'Banho e Tosa', 'Hospedagem', 'Day Care']),
      JSON.stringify({Segunda: '08h-18h', Terça: '08h-18h', Quarta: '08h-18h', Quinta: '08h-18h', Sexta: '08h-18h', Sábado: '08h-14h'}),
      4.9, 189, 342]
  });

  await db.execute({
    sql: `INSERT INTO professionals (user_id, bio, experience_years, crmv, crmv_state, graduation, specialties, services, availability, rating, total_reviews, total_appointments)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [3, 'Veterinária especializada em ortopedia e clínica geral com mais de 8 anos de experiência.',
      8, '12345', 'DF', 'UnB - Medicina Veterinária',
      JSON.stringify(['Ortopedia', 'Clínica Geral']),
      JSON.stringify(['Consulta', 'Cirurgia', 'Ortopedia', 'Exames']),
      JSON.stringify({Segunda: '08h-18h', Terça: '08h-18h', Quarta: '08h-18h', Quinta: '08h-18h', Sexta: '08h-18h'}),
      4.8, 145, 520]
  });

  await db.execute({
    sql: `INSERT INTO professionals (user_id, bio, experience_years, crmv, crmv_state, graduation, specialties, services, availability, rating, total_reviews, total_appointments)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [4, 'Clínico geral com foco em medicina preventiva e bem-estar animal.',
      10, '67890', 'DF', 'UCB - Medicina Veterinária',
      JSON.stringify(['Clínica Geral', 'Cardiologia']),
      JSON.stringify(['Consulta', 'Vacinação', 'Cardiologia', 'Exames']),
      JSON.stringify({Segunda: '08h-18h', Terça: '08h-18h', Quarta: '08h-18h', Quinta: '08h-18h', Sexta: '08h-18h', Sábado: '08h-12h'}),
      4.9, 210, 680]
  });

  // Pet demo
  await db.execute({
    sql: `INSERT INTO pets (owner_id, name, species, breed, birth_date, weight, size, sex, color, castrated, vaccinated, energy_level)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [1, 'Rex', 'Cachorro', 'Labrador', '2020-03-15', '28kg', 'Grande', 'Macho', 'Caramelo', 1, 1, 'Alto']
  });

  await db.execute({
    sql: `INSERT INTO pets (owner_id, name, species, breed, birth_date, weight, size, sex, color, castrated, vaccinated, energy_level)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [1, 'Luna', 'Gato', 'Siamês', '2021-07-20', '4kg', 'Pequeno', 'Fêmea', 'Cinza e branco', 1, 1, 'Médio']
  });
}
