import User from "@models/User";
import { connectToDB } from "@utils/database";
import { generateAuthToken } from "@utils/auth";
import { serialize } from 'cookie';

export const POST = async (request) => {
  try {
    const { username, email, password } = await request.json();

    // Validate that all required fields are provided
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    // Connect to the database
    await connectToDB();

    // Check if the email or username is already registered
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Email or username already exists' }), { status: 400 });
    }

    // Create a new user (password will be hashed automatically)
    const newUser = new User({ username, email, password });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token for the user
    const token = generateAuthToken(newUser._id);

    // Set the token as a cookie in the response
    const serializedCookie = serialize('authToken', token, {
      httpOnly: true,  // Prevent access to the token via JavaScript
      secure: process.env.NODE_ENV === 'production',  // Use Secure only in production
      sameSite: 'strict',  // Helps prevent CSRF attacks
      maxAge: 60 * 60,  // 1 hour
      path: '/',  // Cookie is accessible across the entire site
    });

    // Return a success response with the user object, set cookie in headers
    return new Response(JSON.stringify({ user: newUser }), {
      status: 200,
      headers: { 'Set-Cookie': serializedCookie },
    });
  } catch (error) {
    // Handle errors
    console.error('Error signing up user:', error);
    return new Response(JSON.stringify({ message: 'Failed to sign up user' }), { status: 500 });
  }
};
