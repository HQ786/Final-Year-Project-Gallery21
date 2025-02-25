import { getSession } from "next-auth/react";
import User from "@/models/User"; 
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    // Get the session
    const session = await getSession({ req });

    // Check if the user is logged in
    if (!session) {
      return NextResponse.json({
        status: 401,
        body: { message: "Unauthorized" },
      });
    }

    // Extract user ID from session
    const userId = session.user.id;

    // Retrieve user information from the database
    const user = await User.findById(userId).select("email username lastUsernameChanged");

    if (!user) {
      return NextResponse.json({
        status: 404,
        body: { message: "User not found" },
      });
    }

    // Return the user's information
    return NextResponse.json({
      status: 200,
      body: {
        email: user.email,
        username: user.username,
        lastUsernameChanged: user.lastUsernameChanged,
      },
    });
  } catch (error) {
    console.error("Error fetching user information:", error);
    return NextResponse.json({
      status: 500,
      body: { message: "Internal server error" },
    });
  }
};
