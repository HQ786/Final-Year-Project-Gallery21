'use client';

import { db } from '@utils/firebaseClient';
import { ref, onValue } from 'firebase/database';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const ForumList = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const forumsRef = ref(db, 'forums');
    const unsubscribe = onValue(forumsRef, (snapshot) => {
      const forumsData = snapshot.val();
      console.log('forumsData',forumsData)
      if (forumsData) {
        const forumsArray = Object.keys(forumsData).map((key) => ({
          id: key,
          ...forumsData[key],
        }));
        setForums(forumsArray);
      } else {
        setForums([]);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  if (loading) {
    return <p>Loading forums...</p>;
  }

  return (
    <div>
      <h2>Forums</h2>
      <ul>
        {forums.length > 0 ? (
          forums.map((forum) => (
            <li key={forum.id}>
              <h3>{forum.name}</h3>
              <p>{forum.description}</p>
              <Link href={`/forums/${forum.id}`}>View Threads</Link>
            </li>
          ))
        ) : (
          <p>No forums joined yet</p>
        )}
      </ul>
    </div>
  );
};

export default ForumList;
