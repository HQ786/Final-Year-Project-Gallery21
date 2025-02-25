// app/api/users/[id]/like-post/route.js

import Like from '@models/Like';
import Post from '@models/Post';
import { connectToDB } from '@utils/database';

// POST method: Like and Unlike
export const POST = async (request, { params }) => {
    const { id: userId } = params; // Get user ID from route parameters
    const { postId } = await request.json(); // Parse request body

    try {
      await connectToDB();
    
      // Check if a like already exists
      const existingLike = await Like.findOne({ userId, postId });
      let isLikedByUser = false;
      if (existingLike) {
        // If it exists, unlike (delete) it
        const [, updatedPost] = await Promise.all([
          Like.findByIdAndDelete(existingLike._id),
          Post.findByIdAndUpdate(
            postId,
            { $inc: { likes: -1 } }, // Decrease likes count by 1
            { new: true } // Return updated document
          )
        ]);       
        return new Response(JSON.stringify({ message: 'Unliked successfully' ,data: updatedPost, isLikedByUser}), { status: 200 });
      } else {
        // If it doesn't exist, like (create) it
        const [, updatedPost] = await Promise.all([
          Like.create({ userId, postId }),
          Post.findByIdAndUpdate(
            postId,
            { $inc: { likes: 1 } }, // Increase likes count by 1
            { new: true } // Return the updated document
          )
        ]);
        isLikedByUser = true;
        return new Response(JSON.stringify({ message: 'Liked successfully',data: updatedPost, isLikedByUser }), { status: 200 });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return new Response(JSON.stringify({ message: 'Failed to toggle like' }), { status: 500 });
    }
    
};
