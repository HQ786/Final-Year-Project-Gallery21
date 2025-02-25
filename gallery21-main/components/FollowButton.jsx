import React, { useState, useEffect } from 'react';
import toggleFollow from '@lib/toggleFollow';

const FollowButton = ({ onTrigger, user, username, userId }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFollowState = async () => {
            if (username && userId) {
                await toggleFollow(true, username, userId, setIsFollowing, setIsLoading);
                
            } 
        };

        fetchFollowState();
    }, [username, userId]);

    const handleFollow = async () => {
        setIsLoading(true);
        const followers = await toggleFollow(false, username, userId, setIsFollowing, setIsLoading);
        user.followers = followers;
        onTrigger();
    };

    return (
        <button
            onClick={handleFollow}
            className={`outline outline-1 rounded px-4 py-1 mb-1 transition-all duration-300 ease-in-out  ${isFollowing?'font-bold bg-green-500 hover:bg-white hover:outline-green-500  text-white outline-green-500 hover:text-green-500':'bg-white hover:bg-blue-500  hover:outline-blue-500  text-blue-500 outline-blue-500 hover:text-white font-thin'}`}
        >
            {isLoading ? 'Loading..' : isFollowing ? 'Following' : 'Follow'}
        </button>
    );
};

export default FollowButton;
