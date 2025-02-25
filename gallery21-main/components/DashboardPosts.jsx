import React from 'react';
import Like from '@components/Like';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import { useContext } from "react";
import { PostContext } from "@context/PostContext";
import { encodeUserId } from '@lib/encodeUserId';

const Post = ({ Posts, setPosts, userId }) => {
  const { setSelectedPost } = useContext(PostContext);
  const router = useRouter();
   
  const handlePostClick = (post) => {
    setSelectedPost(post);
    const id = encodeUserId(userId)
    const pid = encodeUserId(post._id)
    router.push(`/${post.username}/art/${id}?type=post&post=${pid}`);
  }
  return (
    <>
      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
        {Posts?.slice(0, 8).map((post) => (
          <div key={post._id} className="rounded overflow-hidden">
            {/* Image Container */}
            <div className="relative group" onClick={()=>handlePostClick(post)}>
              <img
                src={post.images [ 0 ].src}
                alt={post.title || 'Unsplash Art'}
                className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105 cursor-pointer"
              />

              {/* Overlay with Title */}
              <div className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-20 -mb-2 text-gray-100 p-2 cursor-pointer font-medium">
              <p className="capitalize text-center">
                  {post.title
                    ? post.title.length > 22
                      ? `${post.title.slice(0, 22)}...` 
                      : post.title
                    : 'Untitled Art'}
                </p>
                <div className='py-1'>
                  <span className="flex justify-between" onClick={(e) => e.stopPropagation()}>
                    <Link className="flex gap-x-1 items-center cursor-pointer hover:scale-110" href={`/${post?.username}`} >
                      <img
                        src={post.profileImagePath || '/assets/nft5.png'}
                        alt="Profile"
                        className="rounded-full w-6 h-6 border-0 border-white "
                      />
                      <p className="text-sm font-normal">{post.username || 'Anonymous'}</p>
                    </Link>
                    <Like userId={userId} postId={post._id} Posts = {Posts} setPosts = {setPosts} textColor="white"/>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Post;
