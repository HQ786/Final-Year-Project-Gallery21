import Post from "@models/Post";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";

export async function POST (req, { params }) {
    const { id } = params;
    const { postId, reason } = await req.json();

    try {
      await connectToDB();

      const post = await Post.findById(postId);
      if (!post) return NextResponse.json({ error: "Post not found" }, {status:404})


      // Check if the user already flagged this post
      const alreadyFlagged = post.flags.some((flag) => flag.userId.toString() === id);
      if (alreadyFlagged) {
        return NextResponse.json({ error: "You alreday flagged this post" }, {status:400})
      }

      // Add the flag
      post.flags.push({ userId: id, reason });
      await post.save();
      return NextResponse.json({ message: "Post flagged successfully" }, {status:200})

    } catch (error) {
        return NextResponse.json({ error: "Server error" }, {status:500})

    }
  
}
