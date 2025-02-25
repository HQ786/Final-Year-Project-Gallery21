
import mongoose from 'mongoose';
import Post from '@models/Post';
import User from '@models/User';
import { connectToDB } from '@utils/database';

export const POST = async (request, { params }) => {
    const { id: userId } = params;
    const { username } = await request.json();

    if( !username ){
        return new Response(
            JSON.stringify({ message: 'Username not provided.'}),
            { status: 400 }
        );
    }

    try {
        await connectToDB();
        const user = await User.findOne({username:username});
        if (!user){
            return new Response(
                JSON.stringify({ message: 'User not found.'}),
                { status: 400 }
            );
        }

        const posts = await Post.aggregate([
            
            { $match: { userId: new mongoose.Types.ObjectId(user._id) } },
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
                $project: {
                    userLikeStatus: 0
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
