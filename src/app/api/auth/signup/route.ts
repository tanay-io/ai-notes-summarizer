import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: 'Username already taken.' }, { status: 409 }); // 409 Conflict
    }

    const newUser = new User({ username, password });
    await newUser.save();

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    return NextResponse.json({ message: 'User registered successfully!', user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error('Error during user signup:', error);
    return NextResponse.json({ message: 'Failed to register user.' }, { status: 500 });
  }
}