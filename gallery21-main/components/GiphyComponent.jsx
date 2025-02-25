'use client'
import dynamic from 'next/dynamic';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY);

const GiphyComponent = ({setShowGiphPicker, selectedGifs, setSelectedGifs}) => {
  const gifRef = useRef(null);
  const GiphyGrid = dynamic(() => import('@giphy/react-components').then(mod => mod.Grid), { ssr: false });
  const [query, setQuery] = useState('');
  
  const fetchGifs = (offset) => gf.search(query, { sort: 'relevant', lang: 'es', offset, limit: 10 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gifRef.current && !gifRef.current.contains(event.target)) {
        setShowGiphPicker(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowGiphPicker]);
  
  const handleGifClick = (gif, e) => {
    e.preventDefault();
    if (selectedGifs.length === 3) {
      return toast.error("You can use only 3 Gifs per post", {
        id: "max-giphs-toast",
      });
    }
    const g = gif.images.original.url;
    if (g) {
      setSelectedGifs((prevGifs) => [...prevGifs, g]);
      setShowGiphPicker(false);
    }
  };

  // Function to handle input changes
  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className='absolute z-10 flex dark:bg-slate-600 bg-slate-200 rounded-md justify-center flex-col' ref={gifRef}>
      <input 
        type="text" 
        placeholder="Search GIFs..." 
        value={query}
        onChange={handleSearchInputChange}
        className="rounded-xl p-1 outline-none focus:border-gray-700 border-2 m-2 text-sm" 
        />
        <div className='flex overflow-y-scroll h-fit items-center justify-center'>
          {query?<GiphyGrid width={400} columns={2} fetchGifs={fetchGifs} onGifClick={handleGifClick}/>: <p className='bg-white dark:bg-slate-700 dark:text-slate-200 rounded-lg shadow-lg p-2 text-gray-800 font-extrabold block m-4 text-2xl max-w-60'>Write something to get Gifs!</p>}
        </div>
    </div>
  );
};

export default GiphyComponent;

