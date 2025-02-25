"use client";
import React, { useState } from 'react';
import Search from '@components/Search';
import Post from '@components/DashboardPosts';

const SearchPage = () => {
const [data, setData] = useState(null)
  const handleBack = () => {
    window.location.href = '/'; // Redirect back to stripe-marketplace
  };

  return (
    <>
    <Search setData={setData}/>
      <div>
        <button onClick={handleBack}>Back to Home</button>
        {data && <Post Posts={data.posts} setPosts={setData} />}
      </div>
    </>
  );
};

export default SearchPage;
