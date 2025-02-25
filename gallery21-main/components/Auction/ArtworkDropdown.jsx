'use client';

import Select from 'react-select';
import { useEffect, useState } from 'react';

const ArtworkDropdown = ({ userId, artworkId, setArtworkId }) => {
  const [artworkList, setArtworkList] = useState([]);

  useEffect(() => {
    const populateArtworkList = async () => {
      try {
        const response = await fetch('/api/artwork/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setArtworkList(data.body);
        } else {
          console.error('Failed to fetch artwork list:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching artwork list:', error);
      }
    };

    if (userId) {
      populateArtworkList();
    }
  }, [userId]); 

  const handleChange = (selectedOption) => {
    setArtworkId(selectedOption.value);
  }
  const options =
    Array.isArray(artworkList) && artworkList.length > 0
      ? artworkList.map((artwork) => ({
          value: artwork._id,
          label: (
            <div className="flex text-sm items-center space-x-2">
              <img
                src={artwork.workPhotoPaths[0]}
                alt={artwork.title}
                className="w-6 h-6 object-cover rounded-sm"
              />
              <span>{artwork.title}</span>
            </div>
          ),
        }))
      : [];

  return (
    <Select
      options={options}
      value={options.find((option) => option.value === artworkId)}
      onChange={(selectedOption)=>handleChange(selectedOption)}
      placeholder="Select artwork for auction"
      className="mt-1 w-11/12 outline-none focus:outline-none"
      menuContainerStyle={{ zIndex: 9999 }}
      menuPortalTarget={document.body}
      styles={{
        menu: (base) => ({
          ...base,
          maxHeight: 200, 
          overflowY: 'auto',
          touchAction: 'pan-y',
        }),
      }}
    />
  );
};

export default ArtworkDropdown;
