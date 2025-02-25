// app/api/users/[id]/posts/route.js

import mongoose from 'mongoose';
import Post from '@models/Post';
import { connectToDB } from '@utils/database';
import { uploadToCloudinary }  from "@utils/cloudinary";
import cloudinary from 'cloudinary';

// GET method: Fetch posts for a user and check if they are liked by the user
export const GET = async (request, { params }) => {
  const { id: userId } = params;

  try {
    await connectToDB();

    const posts = await Post.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch posts', error: error.message }),
      { status: 500 }
    );
  }
};

const handleImageUploads = async (objectAray, folder, postType) => {
  if (postType==='art')  {
    return await Promise.all(
      objectAray.map(async (object) => {
        let result;
       console.log(typeof object.src, object.src);
       if (typeof object.src === 'string' && object.src.includes('res.cloudinary.com')) {
          result = object.src;
       }
        else {
          const bytes = await object.src.arrayBuffer();
          const buffer = Buffer.from(bytes);
          result = await uploadToCloudinary(buffer, {
          folder,
          publicId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique public ID
        });
          result = result.secure_url;
        }
        return { src: result, description: object.description }; // Use file name as description
      }
    )
    );
   }
   else  {
    return await Promise.all(
      objectAray.map(async (object) => {
        let result;
        console.log(typeof object, object);
        if (typeof object === 'string' && object.includes('res.cloudinary.com')) {
            result = object;
        }
        else {
          const bytes = await object.arrayBuffer();
          const buffer = Buffer.from(bytes);
          result = await uploadToCloudinary(buffer, {
          folder,
          publicId: `${Date.now()}`, // Ensure unique public ID
        });
          result = result.secure_url;
        }
        return result ; // Use file name as description
      }
    )
    );
   }
 };



// POST method: Create a new post
export const POST = async (request, { params }) => {
  const { id } = params; // Get user ID from route parameters
  const formData = await request.formData(); // Parse FormData from request

  const title = formData.get('title');
  const content = formData.get('content');
  const postType = formData.get('postType');

  try {
    await connectToDB();

    let uploadedImages = [];
    const Gifs = [];

    if (postType === "art") {
      const images = [];

      for (const [key, value] of formData.entries()) {
        const match = key.match(/images\[(\d+)\]\[(.+)\]/);
        if (match) {
          const [, index, src] = match;
          if (!images[index]) images[index] = {};
          images[index][src] = value;
      }
    }
      uploadedImages = await handleImageUploads(images, "posts/art", "art");
    }
    
    if (postType === "community") {

      const images = [];
      for (const [key, value] of formData.entries()) {
        const match = key.match(/communityImages\[(\d+)\]/);
        if (match) {
          const [, index] = match;
          images[index] = value;
        }
      }
    
      // Call `handleImageUploads` after the loop
      uploadedImages = await handleImageUploads(images, "posts/community", "community");

      for (const [key, value] of formData.entries()) {
        const match = key.match(/Gifs\[(\d+)\]/);
        if (match) {
          const [, index] = match;
          Gifs[index] = value;
          console.log(value)
        }
      }
    }
    
    console.log("uploadedImages",uploadedImages)
    // Create the new post object
    const newPost = new Post({
      title,
      content,
      userId: id, // Associate post with user
      postType, // Set post type (art or community)
      images: postType === "art" ? uploadedImages : undefined,
      communityImages: postType === "community" ? uploadedImages : undefined,
      createdAt: new Date(), // Set createdAt timestamp
      gifs: postType === "community" ? Gifs : undefined,
    });

    // // Save the post to the database
    await newPost.save();

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(
      JSON.stringify({ message: "Failed to create post" }),
      { status: 500 }
    );
  }
};

const deleteOldPostImages = async( images, postType ) => {
  // Extract public IDs from the image URLs
  let publicIds;
  if(postType==='art') {
    publicIds = images.map(image => {
      console.log("image.src",image.src);
      const urlParts = image.src.split('/'); // Split the URL by '/'
      const folderPath = urlParts.slice(-3, -1).join('/'); // Get the last 2 folder parts (adjust based on your folder depth)
      const publicIdWithExtension = urlParts[urlParts.length - 1]; // Get the last part (filename with extension)
      const publicId = publicIdWithExtension.split('.')[0]; // Remove the file extension
    return `${folderPath}/${publicId}`; // Combine folder path and public ID
  });
}
  else {
    publicIds = images.map(image => {
      console.log(image);
      const urlParts = image.split('/');
      const folderPath = urlParts.slice(-3, -1).join('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split('.')[0];
    return `${folderPath}/${publicId}`;
    });
  }
 console.log('publicIds',publicIds)

  // Delete images from Cloudinary
  const deletePromises = publicIds.map(async publicId => {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
      console.log(`Deletion result for ${publicId}:`, result);
      return result;
    } catch (error) {
      console.error(`Failed to delete ${publicId}:`, error);
      throw error;
    }
  });

  // Wait for all deletions to complete
  await Promise.all(deletePromises);

}

// PATCH method: Update an existing post
export const PATCH = async (request, { params }) => {
  const { id } = params; // Presumably the user ID

  const formData = await request.formData(); // Parse FormData from request
  const postId = formData.get('postId');
  const title = formData.get('title');
  const content = formData.get('content');
  const postType = formData.get('postType');


  try {
    await connectToDB();
    
    // Find the post by ID to check existence
    const post = await Post.findById(postId);
    if (!post) {
      return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
    }
    
    let uploadedImages = [];
    const Gifs = [];

    if (postType === "art") {
      const images = []; // Initialize images array
    
      // Populate the `images` array from formData
      for (const [key, value] of formData.entries()) {
        const match = key.match(/images\[(\d+)\]\[(.+)\]/);
        if (match) {
          const [, index, src] = match;
          if (!images[index]) images[index] = {};
          images[index][src] = value; // No need for `src === 'file'` check, just assign
        }
      }
      uploadedImages = await handleImageUploads(images, "posts/art", "art");
      if(post.images.length>0)
        deleteOldPostImages(post.images, "art");
    }  
    
    if (postType === "community") {

      const images = [];
      for (const [key, value] of formData.entries()) {
        const match = key.match(/communityImages\[(\d+)\]/);
        if (match) {
          const [, index] = match;
          images[index] = value;
        }
      }
    
      // Call `handleImageUploads` after the loop
      uploadedImages = await handleImageUploads(images, "posts/community", "community");
      if(post.communityImages.length>0)
        deleteOldPostImages(post.communityImages, "community");

      for (const [key, value] of formData.entries()) {
        const match = key.match(/Gifs\[(\d+)\]/);
        if (match) {
          const [, index] = match;
          Gifs[index] = value;
        }
      }
      console.log(Gifs)
    }


    // Build the updatedData object
    const updatedData = {
      content,
      postType,
      ...(postType === 'art' && { title, images: uploadedImages }), // Add title and images if postType is 'art'
      ...(postType === 'community' && { communityImages: uploadedImages, gifs:Gifs }), // Add communityImages if postType is 'community'
      lastUpdated: new Date(), // Add or update the `lastUpdated` field with the current timestamp
    };
    console.log(updatedData);
    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: updatedData },
      { new: true, runValidators: true, strict: false }
    );

    return new Response(JSON.stringify(updatedPost), { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return new Response(JSON.stringify({ message: 'Failed to update post' }), { status: 500 });
  }
};



// DELETE method: Delete a post
export const DELETE = async (request, { params }) => {
  const { postID } = await request.json(); // Parse request body
  console.log(postID);
  try {
    await connectToDB();

    // Find the post and delete it
    const post = await Post.findById(postID);
    if(!post){
      return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
    }
    if(post.postType==='art'){
      if(post.images.length>0)
        deleteOldPostImages(post.images, "art");
    }
    else{
      if(post.communityImages.length>0){
        deleteOldPostImages(post.communityImages, "community");
      }
    }
    
    const deletedPost = await Post.findByIdAndDelete(postID);
    
    return new Response(JSON.stringify(deletedPost), { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete post' }), { status: 500 });
  }
};
