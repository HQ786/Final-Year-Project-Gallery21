'use client'
import React, { useEffect } from 'react'
import { useState } from 'react';
import Card from './Card';
import MiniLoader from '../MiniLoader';

const Artworks = ({ id }) => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true)
    
    useEffect(()=>{
        const getArtWorks = async () => {
            const response = await fetch(`/api/artwork/list?username=${id}`);
            const data = await response.json();
            if (data.status === 200) {
                setArtworks(data.body);
                setLoading(false);
            }
        };
        getArtWorks();
    },[])

    
  return (
    <div className='flex items-center justify-center'>
    {loading ? (
      <div className='w-full flex justify-center py-5'>
        <MiniLoader text='Loading Artworks..' />
      </div>
    ) : (
      <div className='flex'>
        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artworks.map((artwork) => (
              <Card key={artwork?._id} work={artwork} username={id} />
            ))}
          </div>
        ) : (
          <div className='w-full flex justify-center py-5'>
            <p className='text-2xl font-extrabold text-gray-800 p-4 text-center'>
              No Artworks created yet.
            </p>
          </div>
        )}
      </div>
    )}
</div>


  )
}


export default Artworks;
