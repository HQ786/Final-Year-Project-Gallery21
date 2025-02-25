'use client';

import React, { useEffect, useState, useContext } from 'react';
import ImageSlider from '@components/ImageSlider';
import { PostContext } from "@context/PostContext";
import { useSearchParams } from 'next/navigation';
import { fetchAllArtPosts } from '@lib/fetchAllArtPosts';
import { useParams } from 'next/navigation'
import { decodeUserId } from '@lib/decodeUserId';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { encodeUserId } from '@lib/encodeUserId';
import { useRouter } from 'next/navigation';

const page = () => {
  const { selectedPost, setSelectedPost, posts, setPosts } = useContext(PostContext);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const params = useParams()
  const uid = params.id;
  const username = params.username;
  const postType = params.postType || '';
  const type = searchParams.get("type");
  const pid = searchParams.get("post");
  const [userId, setUserId] = useState(null);
  const [postId, setPostId] = useState(null);
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
  
        const response = await fetch(`/api/user/${username}/user-snippet`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
  
        const data = await response.json();
        setUserData(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  console.log(userData)
    // Fetch user data only if userData is not set
    if (userData===null) {
      fetchUserData();
    }
  }, [username, userData]);
  

  useEffect(() => {
    if (!userId) {
      if (uid)
        setUserId(decodeUserId(uid))

    }
    if (!postId) {
      if (pid)
        setPostId(decodeUserId(pid))
    }

  }, [uid, pid])

  useEffect(() => {
    const refreshPage = async () => {
      // Fetch all posts if not available
      if (!posts) {
        if (session?.user?.id === userId) {
          await fetchAllArtPosts(userId, null, setPosts, null, 'art');
        }
      }

      // Check if the selected post is not already set
      if (!selectedPost) {
        try {
          let response;
          if (type === 'post') {
            response = await fetch(`/api/user/${userId}/post/${postId}`);
          }
          else if (type === 'auction') {
            response = await fetch(`/api/auction/${postId}`);
          }
          else {
            response = await fetch(`/api/artwork/${postId}`);
          }
          if (!response.ok) {
            const errorMessage = await response.json();
            setError(errorMessage.message || 'Failed to fetch data');
            return;
          }
          const data = await response.json();
          if (data) {
            setSelectedPost(data);
          }

        } catch (err) {
          console.error("Error fetching post:", err);
          setError('Error fetching post data');
        }
      }
    };

    if (userId && postId) {
      refreshPage();
    }
  }, [posts, selectedPost, userId, postId, setPosts, setSelectedPost]);


  const smallPostClick = (post) => {
    if (post?._id) {
      const postid = encodeUserId(post._id);
        const targetUrl = `/${username}/art/${uid}`;
      const query = `?type=post&post=${postid}`;

      console.log("Navigating to:", targetUrl + query);
      setSelectedPost(post);

      // Update the URL with query parameters
      router.push(`${targetUrl}${query}`);
    }
  };
  if (error) {
    return notFound();
  }

  return (
    <div className="flex overflow-hidden">
      {/* {postType && postType==='community'?
      <div>

      </div>: */}
      <div className='flex sm:basis-full md:basis-3/5 lg:basis-full'>
        <div className="flex w-full">
          <ImageSlider selectedPost={selectedPost} setSelectedPost={setSelectedPost} userId={userId} Posts={posts} setPosts={setPosts} type={type} postUsername={username} loggedUsername={session?.user?.username} />
        </div>
      </div>
      {/* } */}
      <div className="flex basis-2/5 justify-center">
        <div className="m-2 w-full rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-x-2 mb-4">
            {userData &&<p className='dark:text-slate-300 self-start font-bold'>More posts by</p>}
            <div className='outline outline-1 outline-yellow-500 dark:bg-slate-800 rounded-lg p-1 shadow-lg'>
            <img
              src={userData?.profileImage || '/assets/nft5.png'}
              alt={`${userData?.username}'s Profile`}
              className="w-24 h-24 rounded-full shadow-md mb-2"
            />
            <h2 className="dark:text-slate-300 text-xl text-center font-bold">{userData?.username}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
          {userData?.posts?.length > 0 && userData.posts.slice(0, 6).map((post, index) => (
            <div key={index} onClick={()=>smallPostClick(post)} className="relative rounded-lg overflow-hidden shadow-md group cursor-pointer">
              <img
                src={post?.images[0]?.src || '/assets/nft5.png'}
                alt={'Image'}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black flex flex-col justify-end items-center opacity-0  group-hover:opacity-50 transition-opacity duration-200">
                <p className='text-white text-xs font-bold truncate py-2'>{post.title}</p>
              </div>
            </div>
          ))}
        </div>
        </div> 
      </div>
    </div>
  );
}

export default page;
