import Post from "@models/Post";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { postId, action } = await req.json(); 

    try {
        await connectToDB();

        const post = await Post.findById(postId);
        if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

        if (action === "pin") {
            // Check if the post is already pinned
            if (post.isPinned) {
                return NextResponse.json({ error: "Post is already pinned" }, { status: 400 });
            }

            // Pin the post
            post.isPinned = true; // Set the isPinned flag to true
            await post.save();
            return NextResponse.json({ message: "Post pinned successfully" }, { status: 200 });
        } else if (action === "unpin") {
            // Check if the post is already unpinned
            if (!post.isPinned) {
                return NextResponse.json({ error: "Post is already unpinned" }, { status: 400 });
            }

            // Unpin the post
            post.isPinned = false; // Set the isPinned flag to false
            await post.save();
            return NextResponse.json({ message: "Post unpinned successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Invalid action. Use 'pin' or 'unpin'." }, { status: 400 });
        }

    } catch (error) {
        console.error('Error toggling post pin status:', error); // Log the error for debugging
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
