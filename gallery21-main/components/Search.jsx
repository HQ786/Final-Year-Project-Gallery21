'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

const Search = ({setData}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all'); // Default to "all"

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      // Construct the query parameters
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.set('search', searchTerm);
      }
      if (searchType) {
        queryParams.set('type', searchType);
      }
  
      // Send the GET request to the search API route
      const response = await fetch(`/api/search-results?${queryParams.toString()}`, {
        method: 'GET', // Specify the method
      });
  
      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      // Parse the JSON response
      const data = await response.json();
      if(data){
        setData(data)
      }
      // Here you can handle the search results, e.g., update state, navigate, etc.
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    router.push('/search')

  };

  return (
    <div className="relative flex-grow">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <select
          className="bg-[#ee4f5d] dark:bg-purple-600 text-white rounded-xl p-1"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)} // Update search type
          aria-label="Select search type"
        >
          <option value="all">All</option>
          <option value="post">Post</option>
          <option value="auction">Auction</option>
          <option value="artwork">Artwork</option>
        </select>

        <div className="relative flex-grow"> {/* Make the input's parent a relative container */}
          <input
            title="Search"
            type="text"
            className="p-1 pl-8 pr-4 text-white rounded-xl bg-[#ee4f5d] dark:bg-purple-600 placeholder:text-white text-sm font-thin border-2 border-transparent focus:outline-none w-44 transition-all duration-300 focus:w-52 shadow-lg"
            placeholder="Search"
            spellCheck={false}
            maxLength={64}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            aria-label="Search input" // Improved accessibility
          />
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white">
            <SearchIcon width={20} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Search;
