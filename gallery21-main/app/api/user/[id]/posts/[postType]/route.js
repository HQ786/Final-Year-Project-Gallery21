// app/api/users/[id]/posts/[postType]/route.js

import mongoose from 'mongoose';
import Post from '@models/Post';
import { connectToDB } from '@utils/database';

// GET method: Fetch posts for a user and check if they are liked by the user
export const GET = async (request, { params }) => {
  const { id: userId, postType } = params;
  const url = new URL(request.url); // Parse the full URL
  const urlParams = new URLSearchParams(url.search); // Get search parameters

  // Use default values if `page` or `limit` are not provided
  const page = parseInt(urlParams.get('page')) || 1; 
  const limit = parseInt(urlParams.get('limit')) || 10;
    
  try {
    await connectToDB();
    const posts = await Post.aggregate([
      { $match: { postType: postType } },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit }, // Skip based on the page
      { $limit: parseInt(limit) }, 
      {
        $lookup: {
          from: 'likes',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$postId', '$$postId'] },
                    { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            }
          ],
          as: 'userLikeStatus'
        }
      },
      {
        $addFields: {
          isLikedByUser: {
            $cond: {
              if: { $gt: [{ $size: '$userLikeStatus' }, 0] },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId', // field in the `posts` collection
          foreignField: '_id', // field in the `users` collection
          as: 'userDetails'
        }
      },
      {
        $addFields: {
          username: { $arrayElemAt: ['$userDetails.username', 0] },
          profileImagePath: { $arrayElemAt: ['$userDetails.profileImagePath', 0] }
        }
      },
      {
        $project: {
          userLikeStatus: 0, // Exclude the temporary field
          userDetails: 0 // Exclude the userDetails array
        }
      }
    ]);
    
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch posts', error: error.message }),
      { status: 500 }
    );
  }
};
