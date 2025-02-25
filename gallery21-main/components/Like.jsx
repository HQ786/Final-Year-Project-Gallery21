'use client';

import { HeartIcon } from 'lucide-react';
import { handleLikes } from "@lib/handleLikes";
import toast from 'react-hot-toast';

const Like = ({ userId, postId, Posts, setPosts, textColor }) => {
    
    let post;
    if(Posts)
        post = Posts.find((p)=>p._id===postId);
    let iconWidth = 40;
    let size = 'text-md';
    let color = 'text-gray-900'
    if(textColor==='white'){
        color = 'text-gray-300';
        iconWidth = 20
        size = 'text-sm';
    }

    return (
        <div className="flex gap-1 text-gray-500">
            {post?
            <>
                <HeartIcon 
                width = { iconWidth } 
                className = {`hover:text-red-700 outline-none cursor-pointer text-[${color}] ${post.isLikedByUser? 'text-red-700 fill-current':''}`}
                onClick = { (e) => {
                    e.stopPropagation();
                    handleLikes ( userId, postId, post.isLikedByUser, post.likes, Posts, setPosts );
                }}
                />
                {post.likes>0&&<span className={`dark:text-slate-300 text-md ${color} ${size}`}>{post.likes}</span>}
            </>
            :<div>
                <HeartIcon 
                width = { iconWidth } 
                className = {`hover:text-red-700 outline-none cursor-pointer ${color} ${size} `}
                onClick = { () => toast.error('Log in to interact with the post')}
                />
            </div>
            }
        </div>
    );
}

export default Like;