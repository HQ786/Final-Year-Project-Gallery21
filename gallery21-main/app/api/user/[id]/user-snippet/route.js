import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database";// Replace with your DB connection utility
import User from "@/models/User"; // Import your User model
import Post from "@/models/Post"; // Import your Post model

// Connect to the database

export async function GET(req, { params }) {
  try {
    connectToDB();

    const { id: username } = params;

    // Find the user by username
    const user = await User.findOne({ username }).select("profileImagePath username");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log(user)
    // Find the posts by the user
    const posts = await Post.find({ userId: user._id, postType: 'art' })
      .sort({ createdAt: -1 }) // Sort posts by the latest
      .limit(6) // Limit to 6 posts for the grid
      // .select("images createdAt"); // Only fetch necessary fields
    const data = {username: user.username,
      profileImage: user.profileImagePath,
      posts}
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
