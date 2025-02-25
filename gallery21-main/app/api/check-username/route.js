// File: /api/check-username.js

import User from "@models/User";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  try {
    const { username } = await request.json();
    console.log("request",username);
    // Connect to the database
    await connectToDB();

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return new Response(JSON.stringify({ exists: true }), { status: 200 });
    }
    
    return new Response(JSON.stringify({ exists: false }), { status: 200 });
  } catch (error) {
    console.error('Error checking username:', error);
    return new Response(JSON.stringify({ message: 'Failed to check username' }), { status: 500 });
  }
};
