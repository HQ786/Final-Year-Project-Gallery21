import User from "@models/User";
import { connectToDB } from "@utils/database";
import bcrypt from 'bcryptjs';

export const POST = async (request) => {
  try {
    await connectToDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Compare password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Provided Password:", password);
    console.log("Stored Hash:", user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: 'Invalid password' }), { status: 401 });
    }

    // Return success login
    return new Response(JSON.stringify({ message: 'Login successful', user }), { status: 200 });
  } catch (error) {
    console.error('Error logging in user:', error);
    return new Response(JSON.stringify({ message: 'Failed to log in user' }), { status: 500 });
  }
};
