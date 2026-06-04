import { createClient } from '@libsql/client';
import path from 'path';

const dbPath = path.join(process.cwd(), 'amparapet.db');

export const db = createClient({
  url: `file:${dbPath}`,
});

export async function initDB() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('tutor', 'cuidador', 'veterinario')),
      phone TEXT,
      city TEXT,
      state TEXT,
      street TEXT,
      cep TEXT,
      cpf TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS professionals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      bio TEXT,
      experience_years INTEGER DEFAULT 0,
      crmv TEXT,
      crmv_state TEXT,
      graduation TEXT,
      graduation_year TEXT,
      specialties TEXT,
      certifications TEXT,
      services TEXT,
      availability TEXT,
      rating REAL DEFAULT 0,
      total_reviews INTEGER DEFAULT 0,
      total_appointments INTEGER DEFAULT 0,
      diploma_file TEXT,
      crmv_file TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      species TEXT,
      breed TEXT,
      birth_date TEXT,
      weight TEXT,
      size TEXT,
      color TEXT,
      sex TEXT,
      microchip TEXT,
      castrated INTEGER DEFAULT 0,
      vaccinated INTEGER DEFAULT 0,
      conditions TEXT,
      allergies TEXT,
      medications TEXT,
      energy_level TEXT,
      behavior_tags TEXT,
      gets_along_pets TEXT,
      gets_along_kids TEXT,
      special_needs TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      professional_id INTEGER NOT NULL,
      pet_id INTEGER,
      service_type TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT DEFAULT 'em_casa',
      status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente','confirmado','concluido','cancelado')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(client_id) REFERENCES users(id),
      FOREIGN KEY(professional_id) REFERENCES users(id),
      FOREIGN KEY(pet_id) REFERENCES pets(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id INTEGER NOT NULL,
      reviewer_id INTEGER NOT NULL,
      professional_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(appointment_id) REFERENCES appointments(id),
      FOREIGN KEY(reviewer_id) REFERENCES users(id),
      FOREIGN KEY(professional_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(sender_id) REFERENCES users(id),
      FOREIGN KEY(receiver_id) REFERENCES users(id)
    );
  `);
}
