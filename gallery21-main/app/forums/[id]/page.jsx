// /app/forums/[id]/page.js
'use client';
import { db } from '@utils/firebaseClient';
import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import Link from 'next/link';

const ForumPage = ({ params }) => {
  const [forum, setForum] = useState(null);
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState('');
  const { id } = params;

  useEffect(() => {
    if (id) {
      // Get the forum data
      const forumRef = ref(db, `forums/${id}`);
      const forumListener = onValue(forumRef, (snapshot) => {
        setForum(snapshot.val());
      });

      // Get the threads data
      const threadsRef = ref(db, `forums/${id}/threads`);
      const threadsListener = onValue(threadsRef, (snapshot) => {
        const threadsData = snapshot.val();
        if (threadsData) {
          const threadsArray = Object.keys(threadsData).map((key) => ({
            id: key,
            ...threadsData[key],
          }));
          setThreads(threadsArray);
        }
      });

      // Cleanup listeners when the component unmounts or id changes
      return () => {
        off(forumRef, 'value', forumListener);
        off(threadsRef, 'value', threadsListener);
      };
    }
  }, [id]);

  const handleCreateThread = () => {
    if (newThread && id) {
      fetch(`/api/forums/${id}/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newThread,
          content: 'This is a new thread.',
          createdBy: 'User', // Ideally, this should be the authenticated user's ID
        }),
      });
      setNewThread('');
    }
  };

  return (
    <div>
      {forum && (
        <>
          <h2>{forum.name}</h2>
          <p>{forum.description}</p>

          <input
            type="text"
            value={newThread}
            onChange={(e) => setNewThread(e.target.value)}
            placeholder="New thread title"
          />
          <button onClick={handleCreateThread}>Create Thread</button>

          <h3>Threads</h3>
          <ul>
            {threads.length > 0 ? (
              threads.map((thread) => (
                <li key={thread.id}>
                  <h4>{thread.title}</h4>
                  <p>{thread.content}</p>
                  <Link href={`/forums/${id}/threads/${thread.id}`}>View Comments</Link>
                </li>
              ))
            ) : (
              <p>No threads yet</p>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default ForumPage;
