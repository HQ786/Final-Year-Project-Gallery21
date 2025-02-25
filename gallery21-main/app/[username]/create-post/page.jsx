'use client';
import Artpost from '@components/Artpost';
import CommunityPost from '@components/CommunityPost';
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import  toast, { Toaster } from 'react-hot-toast';
import Loader from '@components/Loader';
import { useImage } from '@context/ImageContext';

const Page = ({ updatePost, setUpdatePost, posts, setPosts, onTrigger }) => {
  const { data: session, status } = useSession();
  const [postType, setPostType] = useState('Art Post');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const {isExternalImage} = useImage();

  const openModal = () => {
    setIsModalOpen(true);

  }
  useEffect(() => {
    if (updatePost !== null) {
      const postTypeValue = updatePost.postType === 'art' ? 'Art Post' : 'Community Post';
      setPostType(postTypeValue); 
      setIsModalOpen(true); 
    }
    if (isExternalImage) {

      const postTypeValue = 'Art Post';
      setPostType(postTypeValue);
      setIsModalOpen(true);
    }
  }, [updatePost, isExternalImage]);
  
  const handleUnsavedChanges = (toggle) => {
    if (toggle && !hasUnsavedChanges) {
      setPostType(postType === 'Community Post' ? 'Art Post' : 'Community Post');
    }
    else {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="p-2">Any unsaved changes you might have made will be discarded..</p>
            <div className="flex space-x-4">
              <button
                onClick={(t) => {
                  handleDiscardChanges(toggle)
                  toast.dismiss(t.id);
                }}
                className="text-yellow-500 outline outline-1 px-2 py-1 outline-yellow-500 rounded hover:bg-yellow-500 hover:text-white"
              >
                Discard
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
          id: 'unsaved-changes-toast',
          position: 'bottom-center',
          duration: Infinity,
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          className: 'custom-toast',
        }
      ); 
    }
  }
  const closeModal = () => {
    if (hasUnsavedChanges) {
      handleUnsavedChanges()
      return;
    }

    setIsModalOpen(false);
  };

  const handleDiscardChanges = (toggle) => {
    if(toggle){
      setPostType(postType === 'Community Post' ? 'Art Post' : 'Community Post');
    }
    else{
      toast.dismiss();
      setIsModalOpen(false);
      if (updatePost) {
        setUpdatePost(null);
      }
    }

  };

  if (status === 'loading') {
    return <Loader />;
  }

  const userId = session?.user?.id;
  const derivedPostType = updatePost?(updatePost.postType === 'art' ? 'Art Post' : 'Community Post'):postType;

  return (
    <div className="bg-slate-100 dark:bg-nft-black-1 text-gray-900 p-4 rounded-lg shadow-lg max-w-2xl mx-auto mb-4">
      <div className="mb-4 space-y-2">
        <h1 className='dark:text-slate-300 text-center text-lg font-semibold text-gray-800'>Have something to say, <span className='capitalize'>{session?.user.username}?</span></h1>
        <input
          type="text"
          placeholder="Post to tell everyone what's happening.."
          className="w-full h-12 bg-gray-200 dark:bg-deviantBlack text-gray-900 p-4 rounded cursor-pointer outline-none"
          onClick={openModal}
          readOnly
        />
          <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 shadow-lg transform transition-all duration-300 ease-in-out ${isModalOpen? 'scale-100 opacity-100 visible': 'scale-95 opacity-0 invisible'}`}>
            <div className="bg-white dark:bg-nft-black-1 p-4 rounded-lg w-full max-w-3xl max-h-screen overflow-y-auto">
              <div className=" flex justify-between items-center ">
                <h2 className="dark:text-slate-300 text-xl font-bold mb-4">{updatePost ? 'Update post' : 'Create a post'}</h2>
                <button onClick={closeModal} className="text-gray-600 hover:text-gray-900">
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4">
                <div className={` bg-gray-200 dark:bg-slate-700 p-2 rounded-full text-center w-2/5 mb-2 ${updatePost && 'hidden'}`} >
                  <label className="inline-flex items-center cursor-pointer">
                    <span className="mr-2 text-gray-900 dark:text-slate-300 font-poppins text-sm">Community Post</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={postType === 'Art Post'}
                        onChange={() => handleUnsavedChanges(true)}
                      />
                      <div className="toggle-path text-sm bg-gray-300 w-14 h-6 rounded-full p-1 flex items-center justify-between transition-colors">
                        <span
                          className={`toggle-circle dark:bg-blue-600 bg-blue-400 w-4 h-4 rounded-full transition-transform transform ${postType === 'Community Post' ? 'translate-x-0' : 'translate-x-8'
                            }`}
                        ></span>
                      </div>
                    </div>
                    <span className="dark:text-slate-300 ml-2 text-gray-900 font-poppins text-sm">Art Post</span>
                  </label>
                </div>
                <div className="max-h-80 min-h-52 overflow-y-auto">
                  
                  {derivedPostType === 'Art Post' ? (
                    <Artpost key={updatePost ? updatePost.id : 'new'} updatePost={updatePost} setUpdatePost={setUpdatePost} setHasUnsavedChanges={setHasUnsavedChanges} userId={userId} posts={posts} setPosts={setPosts}
                    onTrigger={onTrigger} />
                  ) : (
                    <CommunityPost key={updatePost ? updatePost.id : 'new'} updatePost={updatePost} setUpdatePost={setUpdatePost} setHasUnsavedChanges={setHasUnsavedChanges} userId={userId} posts={posts} setPosts={setPosts} onTrigger={onTrigger} />
                  )}
                </div>
              </div>
            </div>
          </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Page;
