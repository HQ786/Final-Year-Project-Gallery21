import mongoose from 'mongoose';
import Post from '@models/Post';
import { connectToDB } from '@utils/database';

export const GET = async (request, { params }) => {
    const { id: userId } = params;
    const { postId } = params;

    try {
      await connectToDB();
  
      if(mongoose.isValidObjectId(userId)){
        const post = await Post.aggregate([
          { $match: { _id: new mongoose.Types.ObjectId(postId) } },
          { $sort: { createdAt: -1 } },
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
                      { $eq: ['$userId', new mongoose.Types.ObjectId(userId) ] }
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
          $project: {
            userLikeStatus: 0
          }
        }
        ]);
        if ( !post[0] )
          return new Response(
            JSON.stringify({ message: 'Post not found', error: error.message }),
            { status: 404 }
          );
        console.log(post[0])
        return new Response(JSON.stringify(post[0]), { status: 200 });
        
      }
      const post = await Post.findById(postId);
      return new Response(JSON.stringify(post), { status: 200 });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to fetch post', error: error.message }),
        { status: 500 }
      );
    }
  };