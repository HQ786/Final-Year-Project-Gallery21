'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { ChevronLeft, ChevronRight, Ellipsis, MessageSquareTextIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PostContext } from '@context/PostContext';
import { encodeUserId } from '@lib/encodeUserId';
import { useRouter } from 'next/navigation';
import Like from '@components/Like';
import renderContent from '@lib/renderContent';
import Timestamp from './Timestamp';
import { useParams } from 'next/navigation';
import { togglePinPost } from '@lib/togglePinPost';

const Post = ({ isPinnedPost, setUpdatePost, user, post, Posts, setPosts, isOwnProfile, onTrigger }) => {

  const router = useRouter();
  const { setSelectedPost, pinnedPosts, setPinnedPosts } = useContext(PostContext);
  const {
    _id: postId,
    title,
    content,
    createdAt: date,
    postType,
    images,
    gifs,
    communityImages,
    userId,
    lastUpdated,
    isPinned
  } = post;
  const params = useParams();
  const username = params.username;
  const dropdownRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLongPost, setIsLongPost] = useState(false);
  const contentRef = useRef(null);
  const imagesRef = useRef(null);
  const gifsRef = useRef(null);
  const [isPostPinned, setIsPostPinned] = useState(isPinned);

  useEffect(() => {
    // Check if the combined height of content and images exceeds the threshold
    const threshold = 256;
    let contentHeight = 0;
    if (contentRef.current) {
      contentHeight = contentRef.current.scrollHeight;
    }
    if (imagesRef.current) {
      contentHeight += imagesRef.current.scrollHeight;
    }
    if (gifsRef.current) {
      contentHeight += gifsRef.current.scrollHeight;
    }

    setIsLongPost(contentHeight > threshold);
  }, [content, communityImages]);

  useEffect(() => {
    // Function to handle clicks outside of the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOptionOpen(false);
      }
    };
    // Attach event listener on mount
    document.addEventListener("mousedown", handleClickOutside);

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const gotoPrevious = (e)=> {
    e.stopPropagation();
    setCurrentImageIndex(prev => Math.max(0, prev - 1))
  }
  const gotoNext = (e)=> {
    e.stopPropagation();
    setCurrentImageIndex(prev => Math.min(images.length - 1, prev + 1))
  }
  const handlePostClick = ( ) => {
    if (postType==='art'){
      setSelectedPost(post);
      const id = encodeUserId(userId)
      const pid = encodeUserId(postId)
      router.push(`/${username}/art/${id}?&type=post&post=${pid}`);
    }
  }

  const toggleOptionMenu = (e) => {
    e.stopPropagation();
    setIsOptionOpen(prev => !prev);
  }


  const handleUpdate = () => {
    if (isPinned){
      toast.error('Unpin post before updating', {id:'unpin-before-update-toast'})
    }
    else {
      const status = true;
      const postToUpdate = {
        title,
        content,
        images,
        date,
        userId,
        postId,
        postType,
        status,
        communityImages,
        gifs,
        isPinned,
      }

      setUpdatePost(postToUpdate);
    }
    
  }

  const handlePinToggle = async () => {
    try {
      const action = isPostPinned ? "unpin" : "pin";
  
      // Call the API to toggle pin/unpin
      const status = await togglePinPost(postId, action, userId);
  
      if (status === 200) {
        const newPinnedStatus = !isPostPinned;
  
        // Locate the post in the `posts` array and update it
        const targetPost = Posts.find((p) => p._id === postId);
        if (targetPost) {
          targetPost.isPinned = newPinnedStatus;
        }
  
        // Update the pinnedPosts array
        if (newPinnedStatus) {
          // Add to pinnedPosts if it's not already there
          if (!pinnedPosts.some((pinnedPost) => pinnedPost._id === postId)) {
            pinnedPosts.push(targetPost); // Add the reference to the same object
          }
        } else {
          // Remove from pinnedPosts if unpinned
          const newArray = pinnedPosts.filter((pinnedPost) => pinnedPost._id !== postId);
          setPinnedPosts(newArray);
        }
  
        // Update the UI state for the pinned status
        setIsPostPinned(newPinnedStatus);
  
        // Trigger additional updates
        onTrigger();
      } else {
        console.warn("Failed to update the pinned status in the API.");
      }
    } catch (error) {
      console.error("Failed to toggle pin status:", error);
    }
  };
  
  
  const handleDelete = () => {
    const deleteToastId = "delete-toast";
    toast(
      (t) => (
        <div className="flex flex-col items-center">
          <p className="p-2">This post will be permanently deleted.</p>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                deletePost(); // Call your delete function here
                toast.dismiss(t.id); // Dismiss the toast after the delete action
              }}
              className="text-red-500 outline outline-1 px-2 py-1 outline-red-500 rounded hover:bg-red-500 hover:text-white"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)} // Dismiss the toast without doing anything
              className="text-gray-500 outline outline-1 px-2 py-1 outline-gray-500 rounded hover:bg-gray-200 hover:text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        id: deleteToastId, // Ensure only one instance of this toast appears
        position: 'bottom-center', // Position of the toast
        duration: Infinity, // The toast will stay visible until dismissed manually
        autoClose: false, // Prevent auto-closing
        closeOnClick: false, // Disable auto-close when clicked
        draggable: false, // Disable dragging
        icon: <Trash2Icon className="text-red-500" size={24} />, // Add custom icon
        className: 'custom-toast', // Optional custom styling
      }
    );
  };

  const deletePost = async () => {
    toast.dismiss();
    const postID = postId;
    try {
      const response = await fetch(`/api/user/${userId}/posts`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postID,
        })
      });
      const deletedPost = await response.json();
      if (response.ok) {
        // Remove the deleted post from the state
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== deletedPost._id));
        onTrigger();
        toast.success("Post deleted.")
      } else {
        console.error('Failed to delete post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }



  return (
    <div className='dark:bg-nft-black-1 dark:border-deviantBlack  bg-slate-100 w-11/12 p-4 shadow-md rounded-lg mb-4 relative border-2 cursor-pointer'
    onClick={()=>{handlePostClick()}}
    >
      <div
        className="absolute text-gray-600 right-0 mx-2 cursor-pointer rounded-md hover:bg-slate-200 active:bg-slate-50 dark:hover:bg-nft-black-1 dark:hover:text-blue-600 hover:text-blue-700"
        onClick={(e)=>toggleOptionMenu(e)}
        ref={dropdownRef}
        role="button"
        tabIndex={0} // Makes it focusable
      >
        {
          isOwnProfile && !isPinnedPost && <div><Ellipsis />
            <div
              className={`dark:bg-deviantBlack w-24 p-1 absolute right-4 top-6 bg-white shadow-xl rounded-lg z-30 overflow-hidden transform transition-all duration-300 ease-in-out origin-top-right select-none ${isOptionOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                }`}
            >
              <div className="flex flex-col">
                <button onClick={handlePinToggle} className="rounded-sm p-1 text-sm text-gray-600 dark:text-slate-300 dark:hover:bg-slate-800 hover:bg-slate-200">{isPostPinned ? "Unpin" : "Pin"}</button>
                <button onClick={handleUpdate} className="rounded-sm p-1 text-sm dark:text-slate-300 text-gray-600 dark:hover:bg-slate-800 hover:bg-slate-200">Edit</button>
                <button onClick={handleDelete} className="rounded-sm p-1 text-sm dark:text-slate-300 text-gray-600 dark:hover:bg-slate-800 hover:bg-slate-200">Delete</button>
              </div>
            </div>
          </div>}
      </div>

      {postType === 'art' ? (
        <div className="space-y-4" >
          <p className="dark:text-slate-400 text-gray-500 text-xs max-w-2xl">
            {new Date(date).toLocaleDateString()}
          </p>
          <div className="text-xl font-bold text-center rounded dark:text-slate-300 text-gray-800">{title}</div>
          <div className="relative flex justify-center items-center">
            <div className="flex flex-col items-center w-full overflow-hidden">
              <div
                className="bg-black flex justify-center items-center w-full h-72 overflow-hidden relative"
                ref={imagesRef}
              >
                <div
                  className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                >
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="w-full flex-shrink-0 flex justify-center items-center"
                    >
                      <img
                        src={image.src}
                        alt={`Art Image ${index + 1}`}
                        className="h-full w-auto object-contain p-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                className="w-full text-sm font-poppins mt-2 text-gray-900 transition-opacity duration-500"
              >
                {images[currentImageIndex].description}
              </div>
            </div>

            {images.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={(e) => gotoPrevious(e)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-white z-10 bg-black/50 rounded-full"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}
                {currentImageIndex < images.length - 1 && (
                  <button
                    onClick={(e) => gotoNext(e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white z-10 bg-black/50 rounded-full"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className={`relative transition-all duration-300 break-words ${isExpanded ? 'max-h-auto' : 'max-h-64 overflow-hidden'
          }`}>

          <p className="dark:text-slate-400 text-gray-500 text-xs max-w-2xl mb-6">
            {new Date(date).toLocaleDateString()}
          </p>
          <div ref={contentRef} className='dark:text-slate-300 text-gray-700 '>{renderContent(content)}</div>
          {communityImages?.length > 0 && (
            <div ref={imagesRef} className="items-center">
              {communityImages.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Community Image ${index + 1}`}
                    className="w-10/12 h-auto object-cover p-4"
                  />
                </div>
              ))}
            </div>
          )}
          {gifs?.length > 0 && (
            <div ref={gifsRef} className="items-center">
              {gifs.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Gif ${index + 1}`}
                    className="w-10/12 h-auto object-cover p-4"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      )}
      {(isLongPost) &&
        <button
          className="dark:text-slate-400 dark:hover:text-slate-500 text-gray-500 text-xs font-extrabold hover:text-black"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev)
          }}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      }
      <div className="flex gap-x-3 justify-end text-gray-500 items-end">
        <div>
          <Timestamp date={date} />
          {lastUpdated && <Timestamp date={lastUpdated} text={'updated'} />}
        </div>
        <Like userId={user} postId={postId} Posts={Posts} setPosts={setPosts} />
        <MessageSquareTextIcon
          width={20}
          className="hover:text-green-500 cursor-pointer"
          absoluteStrokeWidth={true}
        />
      </div>
    </div>
  );
};

export default Post;