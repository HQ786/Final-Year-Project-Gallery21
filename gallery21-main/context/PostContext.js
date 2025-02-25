import { createContext, useState } from "react";

// Create the context
export const PostContext = createContext();

// Create a provider component
export const PostProvider = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState(null);
  const [userPosts, setUserPosts] = useState(null);
  const [pinnedPosts, setPinnedPosts] = useState([]);

  return (
    <PostContext.Provider value={{ selectedPost, setSelectedPost, posts, setPosts, userPosts, setUserPosts,pinnedPosts, setPinnedPosts }}>
      {children}
    </PostContext.Provider>
  );
};
