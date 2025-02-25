'use client';

import React, { useState, useEffect } from 'react';
import { Edit, Image as ImageIcon, X } from 'lucide-react';
import { removeImageFromArray } from '@lib/removeImageFromArray';
import { toast } from 'react-hot-toast';
import { useImage } from '@context/ImageContext';
import { useParams, useRouter } from 'next/navigation';

const Artpost = ({ updatePost, setUpdatePost, setHasUnsavedChanges, userId, posts, setPosts, onTrigger }) => {
  const [title, setTitle] = useState(''); // State for post title
  const [loading, setLoading] = useState(false); // To handle loading state
  const [content, setContent] = useState(''); // State for post content
  const { image, setImage, setOriginalFileName, isExternalImage, setIsExternalImage } = useImage();
  const { pageData, setPageData, artPostImages, setArtPostImages } = useImage();
  const router= useRouter();
  const params = useParams();
  const username = params.username;

  useEffect(() => {

    if (updatePost !== null && updatePost.status === true) {
      setArtPostImages(updatePost.images);
      setContent(updatePost.content);
      setTitle(updatePost.title)
    }
    if (pageData) {
      setTitle(pageData.title);
      setContent(pageData.content);
      const index = pageData.imageIndex;
      if (isExternalImage){
        console.log("pagedata",pageData)
        if(artPostImages[index])
          artPostImages[index].src = image;
      }
      setImage(null);
      setPageData(null);
      setIsExternalImage(false);
    }

  },[]);
  useEffect(() => {
    setHasUnsavedChanges(title || artPostImages.length > 0 || content); // Update unsaved changes status
  }, [artPostImages, title, content, setHasUnsavedChanges]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Directly set the file for later upload
      setArtPostImages((prev) => [
        ...prev,
        { src:file, description: '' }
      ]);
    }
  };

  const handleEditImage = (file, index) => {
    if (file) {
      console.log(updatePost);
      if (file instanceof Blob) {
        // If it's a Blob/File, use FileReader
        const reader = new FileReader();
        reader.onload = () => {
          const imageDataUrl = reader.result;
          setOriginalFileName(file.name ? file.name.split(".").slice(0, -1).join(".") : 'image');
          setImage(imageDataUrl);
          const data = {
            title: title,
            content: content,
            imageIndex: index,
            username:username,
            update: updatePost?updatePost:false
          }
          setPageData(data);
          setIsExternalImage(true);
          router.push('/canvas');
        };
        reader.readAsDataURL(file);
      } else if (typeof file === 'string') {
        // If it's a string (URL or base64), use it directly
        setOriginalFileName(file.split('/').pop().split('.')[0] || 'image');
        setImage(file);
        const data = {
          title: title,
          content: content,
          imageIndex: index,
          username:username,
          update: updatePost?updatePost:false
        }
        setPageData(data);
        setIsExternalImage(true);
        router.push('/canvas');
      } else {
        console.error('Unsupported image type');
      }
    } else {
      console.error('no image');
    }
  };
  

  const handleDescriptionChange = (index, description) => {
    const updatedImages = artPostImages.map((img, i) => (i === index ? { ...img, description } : img));
    setArtPostImages(updatedImages);
  };

  const handlePostSubmit = () => {
    if (updatePost !== null) {
      return handleUpdatePost();
    }
    handleCreatePost();
  };
 
  const handleCreatePost = async () => {
    if (artPostImages.length === 0) {
      toast.error("For an art post, you have to upload at least one image", {
        id: "atleast-one-image-toast",
      });
      console.warn("Art post must have at least one image!");
      return;
    }
    if (!content) {
      toast.error("You need to atleast provide main description", {
        id: "atleast-one-description-toast",
      });
      console.warn("You need to atleast provide main description");
      return;
    }
  
    setLoading(true); // Start loading
  
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('postType', 'art');
      artPostImages.forEach((image, index) => {
        formData.append(`images[${index}][src]`, image.src); // File object
        formData.append(`images[${index}][description]`, image.description); // Description
      });
      // Send the new post to your API
      const response = await fetch(`/api/user/${userId}/posts`, {
        method: "POST",
        body: formData, // Send FormData directly
      });
  
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
  
      const result = await response.json();
      posts.unshift(result);
      setArtPostImages([]); // Clear the images after posting
      setTitle(""); // Clear the title
      setContent(""); // Clear content
      setHasUnsavedChanges(false); // No unsaved changes after submission
      onTrigger();
    } catch (error) {
      toast.error("Error creating post\nPlease check your internet connection", {
        id: "error-creating-post-toast",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  const handleUpdatePost = async () => {

    if (artPostImages.length > 0 && title && content && updatePost) { // Ensure there is content to update
      
      setLoading(true);
      const formData = new FormData();
      formData.append('postId', updatePost.postId)
      formData.append('title', title);
      formData.append('content', content);
      formData.append('postType', 'art');
      artPostImages.forEach((image, index) => {
        formData.append(`images[${index}][src]`, image.src); // File object
        formData.append(`images[${index}][description]`, image.description); // Description
      });
      
      setTitle('')
      setArtPostImages([]);
      setContent('')
   
      try {
        const response = await fetch(`/api/user/${userId}/posts`, {
          method: 'PATCH',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to update post');
        }

        const updatedPost = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedPost._id ? updatedPost : post
          )
        );
        setUpdatePost(null);
        setHasUnsavedChanges(false);
        onTrigger()
        toast.success("Post updated.")

      } catch (error) {
        toast.error("Error updating post\nPlease check your internet connection", {
          id: "error-updating-post-toast",
        });
      } finally {
        setLoading(false);

      }
    } else {
      return toast.error("Can not upload empty post", {
        id: "cannot-upload-empty-art-toast",
      });
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border dark:bg-slate-800 dark:text-slate-300  dark:border-gray-600 outline-none hover:outline-none focus:outline-none rounded mb-4"
      />

      <textarea
        placeholder="Art post description"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="dark:bg-slate-800 dark:text-slate-300 w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 outline-none hover:outline-none focus:outline-none"
      />

      <div className="dark:text-slate-300 flex items-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="flex gap-1 p-2 items-center dark:hover:bg-slate-600 hover:bg-gray-200 rounded cursor-pointer">
          <ImageIcon size={24} />
          <span className="text-sm">Upload Image</span>
        </label>
      </div>

      {artPostImages.map((img, index) => (
        <div key={index} className="flex mb-4 items-center flex-col">
            <div className="relative w-5/6">
            {/* Image */}
            <img
              src={img.src instanceof File || img.src instanceof Blob
                ? URL.createObjectURL(img.src)
                : img.src}
              alt={`Art Image ${index + 1}`}
              className="rounded w-full"
            />
            
            <button
              onClick={()=>handleEditImage(img.src, index)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 bg-white rounded-full p-1 shadow"
            >
              <Edit size={24} />
            </button>
            {/* Close Button */}
            <button
              onClick={()=>removeImageFromArray(index, setArtPostImages)}
              className="absolute top-2 right-12 text-gray-600 hover:text-gray-900 bg-white rounded-full p-1 shadow"
            >
              <X size={24} />
            </button>
          </div>`
          <textarea
            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-800 dark:text-slate-300  dark:border-gray-600 outline-none hover:outline-none focus:outline-none"
            placeholder="Add a description for this image"
            value={img.description}
            onChange={(e) => handleDescriptionChange(index, e.target.value)}
          />
        </div>
      ))}

      <div className="flex justify-end space-x-2 mx-3">
        {!updatePost && <button
          onClick={() => {
            setArtPostImages([]);
            setTitle(''); // Clear title when images are cleared
            setContent(''); // Clear content when images are cleared
            setHasUnsavedChanges(false); // Clear unsaved changes when images are cleared
          }}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-300"
        >
          Clear
        </button>}
        <button
          onClick={handlePostSubmit}
          className="dark:bg-purple-700 dark:hover:bg-purple-800 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading} // Disable button while loading
        >
          {(updatePost !== null) ? (loading) ? 'Updating...' : 'Update' : loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default Artpost;
