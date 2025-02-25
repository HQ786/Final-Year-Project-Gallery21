import Post from "@models/Post";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    // Fetch posts where flags array is not empty
    const flaggedPosts = await Post.find({ "flags.0": { $exists: true } }).populate(
 "userId")
    console.log(flaggedPosts[0])
    return NextResponse.json(flaggedPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch flagged posts" },
      { status: 500 }
    );
  }
}
