'use client'
import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove, update } from 'firebase/database';
import { db } from "@utils/firebaseClient";
import { Trash2 } from 'lucide-react';

const Comment = ({ 
    artworkId, 
    postId, 
    parentId = null, 
    userId, 
    username,
    isNestedReply = false 
  }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
  
    const targetPath = parentId 
      ? `comments/${artworkId || postId}/${parentId}/replies`
      : `comments/${artworkId || postId}`;
  
    useEffect(() => {
      if (!isNestedReply) {
        const commentsRef = ref(db, targetPath);
        const unsubscribe = onValue(commentsRef, (snapshot) => {
          const data = snapshot.val() || {};
          const transformedComments = Object.entries(data).map(([id, comment]) => ({
            id,
            ...comment,
            replies: comment.replies 
              ? Object.entries(comment.replies).map(([replyId, reply]) => ({
                  id: replyId,
                  ...reply
                })) 
              : []
          }));
          setComments(transformedComments);
        });
  
        return () => unsubscribe();
      }
    }, [targetPath, isNestedReply]);
  
    const handleAddComment = () => {
      if (!newComment.trim()) return;
  
      const newCommentRef = push(ref(db, targetPath));
      
      const commentData = {
        text: newComment,
        userId,
        username,
        timestamp: Date.now(),
        deleted: false
      };
  
      set(newCommentRef, commentData)
        .then(() => {
          setNewComment("");
        })
        .catch((error) => {
          console.error("Error adding comment:", error);
        });
    };
  
    const handleDeleteComment = async(commentId, isReply = false, parentCommentId = null) => {
      let deletePath;
      
      if (isReply) {
        // For nested replies, construct the precise path
        deletePath = `comments/${artworkId || postId}/${parentCommentId}/replies/${commentId}`;
      } else {
        deletePath = `comments/${artworkId || postId}/${commentId}`;
        // For top-level comments
        // await update(ref(db, deletePath), {
        //     text: "This comment was deleted.",
        //     deleted: true
        // });
        // deletePath = null;
      }
      
      if (deletePath)
        remove(ref(db, deletePath))
        .catch((error) => {
          console.error("Error deleting comment:", error);
        });
      
    };
  
    return (
      <div className={`mt-6 ${isNestedReply ? 'ml-4' : ''}`}>
        {/* Top-level comment input */}
        {!isNestedReply && (
          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="outline-blue-600 text-gray-800 dark:text-gray-200 dark:border-gray-800  dark:bg-nft-black-1 w-full p-3 border block rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-gray-700"
            />
            <button
              onClick={handleAddComment}
              className="mt-2 px-3 py-1 bg-blue-600 dark:bg-blue-900 text-white rounded-md hover:bg-blue-700 transition"
            >
              Post
            </button>
          </div>
        )}
  
        {/* Top-level comments rendering */}
        {!isNestedReply && (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-2 border rounded-md bg-gray-100 dark:border-gray-800   dark:bg-nft-black-2">
                <div className="text-gray-700 dark:text-gray-200">
                  <span className="text-sm text-blue-600"><strong>@</strong>{comment.username}</span> <br />
                  <span className={comment.deleted ? "text-gray-500 italic" : ""}>
                    {comment.deleted ? "This comment was deleted." : comment.text}
                  </span>
                </div>
  
                <div className="flex text-sm text-gray-500 gap-x-4 items-center">
                  {new Date(comment.timestamp).toLocaleString()}
                  {!comment.deleted && comment.userId === userId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded-md"
                    >
                      <Trash2 width={18} />
                    </button>
                  )}
                </div>
  
                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-4 mt-4 border-l-2 border-gray-300 dark:border-gray-500  pl-4">
                    {comment.replies.map((reply) => (
                      <div 
                        key={reply.id} 
                        className="p-2 border rounded-md bg-gray-50 dark:border-gray-800  mt-2 dark:bg-deviantBlack"
                      >
                        <div className="text-gray-700 dark:text-gray-200 ">
                          <span className="text-sm text-blue-600"><strong>@</strong>{reply.username}</span> <br />
                          <span className={reply.deleted ? "text-gray-500 italic" : ""}>
                            {reply.deleted ? "This reply was deleted." : reply.text}
                          </span>
                        </div>
                        <div className="flex text-sm text-gray-500 gap-x-4 items-center">
                          {new Date(reply.timestamp).toLocaleString()}
                          {!reply.deleted && reply.userId === userId && (
                            <button
                              onClick={() => handleDeleteComment(reply.id, true, comment.id)}
                              className="text-red-600 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded-md"
                            >
                              <Trash2 width={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
  
                {/* Reply Input */}
                <Comment
                  artworkId={artworkId}
                  postId={postId}
                  parentId={comment.id}
                  userId={userId}
                  username={username}
                  isNestedReply={true}
                />
              </div>
            ))}
          </div>
        )}
  
        {/* Nested reply input */}
        {isNestedReply && (
          <div className="mt-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-2 text-sm border rounded-lg border-gray-300 dark:border-gray-800 dark:text-gray-200 dark:bg-nft-black-1 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-gray-700"
            />
            <button
              onClick={handleAddComment}
              className="mt-1 px-2 py-1 text-sm bg-blue-600 dark:bg-blue-900 text-white rounded-md hover:bg-blue-700"
            >
              Reply
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default Comment;