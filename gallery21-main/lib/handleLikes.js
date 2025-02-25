export const handleLikes = async(userId, postId, isLikedByUser, likes, Posts, setPosts) => {
    
    if (Posts) {
      const updatedPosts = Posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: isLikedByUser ? post.likes - 1 : post.likes + 1,
              isLikedByUser: !post.isLikedByUser,
            }
          : post
      );
      setPosts(updatedPosts);
    }
    
  try {
    const response = await fetch(`/api/user/${userId}/like-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle like');
    }
    
    const data = await response.json();
    
    console.log(data)
    return data;
  } 
  catch (error) {
    console.error('Error toggling like:', error);
    if(Posts){
      const revertedPosts = Posts.map(post =>
        post._id === postId
          ? {
              ...post,
              likes: likes,
              isLikedByUser: isLikedByUser,
            }
          : post
      );
      setPosts(revertedPosts);
    }
    
    throw error;
  }
  
};