
'use client'

import { useState } from 'react';
import { MapPin } from 'lucide-react';

const LocationInput = ({ setLocation, locationLoading, setLocationLoading}) => {
  const [tempLocation, setTempLocation] = useState({
    address: '',
    coordinates: [null, null], // [longitude, latitude]
  });

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Set temporary coordinates
        setTempLocation((prev) => ({
          ...prev,
          coordinates: [longitude, latitude],
        }));

        // Reverse geocode to get the address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.address) {
            // Extract city and country from the address
            const city = data.address.city || data.address.state || data.address.town || data.address.village || '';
            const country = data.address.country || '';
  
            // Combine city and country for the address
            const limitedAddress = `${city}, ${country}`.trim();
  
            setTempLocation((prev) => ({
              ...prev,
              address: limitedAddress,
            }));

            // Update the final location
            setLocation({
              type: 'Point',
              coordinates: [longitude, latitude],
              address: limitedAddress,
            });
          } else {
            console.error('Unable to fetch address.');
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
        }

        setLocationLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error.message);
        setLocationLoading(false);
      }
    );
  };

  return (
    <div>
      <label className="block text-lg font-medium text-blue-950" htmlFor="address">
        Location Address <span className="text-blue-950">*</span>
      </label>
      <div className="relative flex items-center">
        <MapPin className="absolute text-gray-400 left-3 w-5 h-5" />
        <input
          type="text"
          id="address"
          disabled={true}
          value={tempLocation.address}
          onChange={(e) =>
            setTempLocation((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
          onBlur={() =>
            setLocation((prev) => ({
              ...prev,
              type: 'Point',
              coordinates: tempLocation.coordinates,
              address: tempLocation.address,
            }))
          }
          placeholder="Enter address"
          required
          className="pl-10 mt-1 w-11/12 p-3 border border-gray-300 rounded-md focus:outline-none"
        />
      </div>
      <button
        type="button"
        onClick={handleDetectLocation}
        className="bg-blue-800 hover:bg-slate-500 text-sm font-bold text-white mt-3 p-2 rounded-md"
        disabled={locationLoading}
      >
        {locationLoading ? 'Detecting...' : 'Detect Location'}
      </button>
    </div>
  );
};

export default LocationInput;
