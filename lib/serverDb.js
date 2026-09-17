import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  const dbPath = path.join(process.cwd(), 'kissan_bazar_server.db');

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Initialize Users Table
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS server_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Farmer',
      phone TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed Default Demo Accounts if empty
  const count = await dbInstance.get('SELECT COUNT(*) as cnt FROM server_users');
  if (count.cnt === 0) {
    const defaultPassword = await bcrypt.hash('password123', 10);

    await dbInstance.run(
      `INSERT INTO server_users (name, email, password_hash, role, phone, location) VALUES (?, ?, ?, ?, ?, ?)`,
      ['Ramesh Patil', 'ramesh@farmer.com', defaultPassword, 'Farmer', '+91 98230 12345', 'Nashik, Maharashtra']
    );

    await dbInstance.run(
      `INSERT INTO server_users (name, email, password_hash, role, phone, location) VALUES (?, ?, ?, ?, ?, ?)`,
      ['Aniket Sharma', 'aniket@buyer.com', defaultPassword, 'Buyer', '+91 99887 76655', 'Mumbai, Maharashtra']
    );

    console.log('Server SQLite DB seeded with default accounts!');
  }

  return dbInstance;
}
