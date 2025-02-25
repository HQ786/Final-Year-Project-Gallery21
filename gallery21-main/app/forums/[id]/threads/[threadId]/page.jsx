'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@utils/firebaseClient'; // Adjust the path based on your setup
import { ref, onValue, push, set } from 'firebase/database'; // Import push and set methods

const ThreadCommentsPage = ({ params }) => {
  const { id, threadId } = params; // Extract forum ID and thread ID
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && threadId) {
      // Fetch thread data
      const threadRef = ref(db, `forums/${id}/threads/${threadId}`);
      onValue(threadRef, (snapshot) => {
        const threadData = snapshot.val();
        if (threadData) {
          setThread(threadData);
        }
        setLoading(false);
      });

      // Fetch comments for the thread
      const commentsRef = ref(db, `forums/${id}/threads/${threadId}/comments`);
      onValue(commentsRef, (snapshot) => {
        const commentsData = snapshot.val();
        if (commentsData) {
          const commentsArray = Object.keys(commentsData).map((key) => ({
            id: key,
            ...commentsData[key],
          }));
          setComments(commentsArray);
        } else {
          setComments([]);
        }
      });
    }
  }, [id, threadId]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Reference to the comments section in the thread
      const newCommentRef = ref(db, `forums/${id}/threads/${threadId}/comments`);

      // Create a new comment entry
      const newCommentData = {
        content: newComment,
        createdAt: new Date().toISOString(),
        // You can add user info here (like user ID or name)
      };

      // Push new comment to the database
      const newCommentKey = push(newCommentRef).key; // This returns a unique key
      set(ref(db, `forums/${id}/threads/${threadId}/comments/${newCommentKey}`), newCommentData);

      // Clear the input after submission
      setNewComment('');
    }
  };

  if (loading) {
    return <p>Loading thread...</p>;
  }

  return (
    <div>
      <h2>{thread?.title}</h2>
      <p>{thread?.content}</p>

      <div>
        <h3>Comments</h3>
        {comments.length > 0 ? (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <p>{comment.content}</p>
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet</p>
        )}
      </div>

      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Post Comment</button>
      </div>

      <Link href={`/forums/${id}/`}>
        <button>Back to Thread List</button>
      </Link>
    </div>
  );
};

export default ThreadCommentsPage;
