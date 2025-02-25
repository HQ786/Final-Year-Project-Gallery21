import Post from '@models/Post';
import { connectToDB } from '@utils/database';

// GET method: Fetch posts based on postType
export const POST = async (request) => {
  
  const { type } = await request.json(); // Destructure to get the post type

  const query = type ? { postType: type } : {}; // If no type, return all posts
    try {
      await connectToDB();
      // Fetch posts based on the query, sorted by newest first
      const posts = await Post.find(query).sort({ createdAt: -1 });
      
      return new Response(JSON.stringify(posts), { status: 200 });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to fetch posts' }),
        { status: 500 }
      );
    }
  };
  