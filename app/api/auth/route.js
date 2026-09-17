import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/serverDb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kissan_bazar_secret_key_2026';

export async function POST(request) {
  try {
    const { action, name, email, password, role, phone, location } = await request.json();
    const db = await getDb();

    if (action === 'register') {
      if (!name || !email || !password || !role) {
        return NextResponse.json({ error: 'Name, email, password, and role are required.' }, { status: 400 });
      }

      // Check existing email
      const existingUser = await db.get('SELECT * FROM server_users WHERE email = ?', [email.toLowerCase()]);
      if (existingUser) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
      }

      const hash = await bcrypt.hash(password, 10);
      const result = await db.run(
        `INSERT INTO server_users (name, email, password_hash, role, phone, location) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email.toLowerCase(), hash, role, phone || '', location || '']
      );

      const newUser = {
        id: result.lastID,
        name,
        email: email.toLowerCase(),
        role,
        phone,
        location
      };

      const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: '7d' });

      return NextResponse.json({
        message: 'Account created successfully!',
        user: newUser,
        token
      });
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
      }

      const user = await db.get('SELECT * FROM server_users WHERE email = ?', [email.toLowerCase()]);
      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location
      };

      const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });

      return NextResponse.json({
        message: 'Login successful!',
        user: userData,
        token
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });

  } catch (error) {
    console.error('Server Auth Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
