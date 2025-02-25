import User from '@models/User';
import { connectToDB } from '@utils/database';

// POST method: Follow, Unfollow, and Check Follow Status based on the `check` query parameter
export const POST = async (request, { params, query }) => {
    const { id: userId } = params;
    const { targetUsername } = await request.json(); 
    const url = new URL(request.url); // Parse the full URL
    const urlParams = new URLSearchParams(url.search); // Get search parameters

    // Use default values if `page` or `limit` are not provided
    const check = urlParams.get('check') || false;

    try {
        await connectToDB();

        const user = await User.findById(userId);
        const targetUser = await User.findOne({ username: targetUsername });

        if (!user || !targetUser) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        if (check === 'true') {
            const isFollowing = user.following.includes(targetUser._id);
            return new Response(JSON.stringify({ isFollowing }), { status: 200 });
        }

        // Otherwise, toggle follow/unfollow status
        const isFollowing = user.following.includes(targetUser._id);

        if (isFollowing) {
            // If the user is already following, unfollow (remove from both users' arrays)
            user.following = user.following.filter(id => id.toString() !== targetUser._id.toString());
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId.toString());

            await user.save();
            await targetUser.save();

            return new Response(JSON.stringify({ message: 'Unfollowed successfully', isFollowing: false, followers:targetUser.followers }), { status: 200 });
        } else {
            // If not following, follow the target user (add to both users' arrays)
            user.following.push(targetUser._id);
            targetUser.followers.push(userId);

            await user.save();
            await targetUser.save();

            return new Response(JSON.stringify({ message: 'Followed successfully', isFollowing: true, followers:targetUser.followers }), { status: 200 });
        }
    } catch (error) {
        console.error('Error toggling follow status:', error);
        return new Response(JSON.stringify({ message: 'Failed to toggle follow status' }), { status: 500 });
    }
};
