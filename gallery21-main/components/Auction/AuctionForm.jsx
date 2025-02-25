'use client'

import React, { useState, useEffect } from 'react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import ArtworkDropdown from './ArtworkDropdown';
import ReverseGeocoder from './ReverseGeocoder';
import  toast, { Toaster } from 'react-hot-toast';
import useUserTimeZone from '@lib/useUserTimeZone';
import { formatDateWithTimeZone } from '@lib/dateUtils';

const CreateAuctionForm = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [artworkId, setArtworkId] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [minimumIncrement, setMinimumIncrement] = useState('');
  const [location, setLocation] = useState({
    address: '',
    coordinates: { lat: null, lng: null },
  });
  const userTimeZone = useUserTimeZone();
  const [createLoading, setCreateLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userId) {
      if (location.address){
        setCreateLoading(true)
      
        const auction = {
          title,
          artist:userId,
          artworkId,
          startTime, 
          endTime,
          duration, 
          startingBid,
          minimumIncrement:minimumIncrement?minimumIncrement:null,
          location:location ? location:null,
        }
        try {
          const response = await fetch('/api/auction',{
            method: "POST",
            body: JSON.stringify(auction),
          });
          const body = await response.json();
          if ( body.status===201 ) {
            toast.success('Artwork has been scheduled for auction',{
              id: "auction-created-toast",
            });
          }
          if ( body.status===400 ) {
            toast.error('Artwork already scheduled for auction',{
              id: "already-scheduled-auction-toast",
            });
          }

        }
        catch( error ){
          console.error(error);
        }
        finally{
          setCreateLoading(false);
          clearFields();
        }
      }else {
        toast.error('Location is required', {
          id: "location-not-given-toast",
        });
      }
    }
  };

  const clearFields = () => {
    setTitle('');
    setStartTime(new Date());
    setEndTime('');
    setDuration('');
    setStartingBid('');
    setMinimumIncrement('');
  }
  const handleStartTimeChange = (newValue) => {
    if (newValue instanceof Date) {
      const utcStartTime = new Date(Date.UTC(
        newValue.getUTCFullYear(),
        newValue.getUTCMonth(),
        newValue.getUTCDate(),
        newValue.getUTCHours(),
        newValue.getUTCMinutes(),
        newValue.getUTCSeconds()
      ));
      
      setStartTime(utcStartTime);
  
      // Calculate the end time in UTC
      const utcEndTime = new Date(utcStartTime.getTime() + duration * 60 * 60 * 1000);
  
      setEndTime(utcEndTime);
    }
  };
  

  const handleTitleChange = (e) => {
    const enteredTitle = String(e.target.value);
    if (enteredTitle === '' || (enteredTitle.length >= 1 && enteredTitle.length <= 65)) {
      setTitle(enteredTitle)
    }
  }

  const handleDurationChange = (e) => {
    const selectedDuration = Number(e.target.value);
    if (selectedDuration === '' || (selectedDuration >= 1 && selectedDuration <= 48)) {
      setDuration(selectedDuration);
      const calculatedEndTime = new Date(startTime);
      calculatedEndTime.setHours(calculatedEndTime.getHours() + selectedDuration);
      setEndTime(calculatedEndTime);
    };
  };

  const handleMinStartingBid = (e) => {
    const selectedStartingBid = Number(e.target.value);
    if (selectedStartingBid === '' || (selectedStartingBid >= 10 && selectedStartingBid <= 10000)) {
      setStartingBid(selectedStartingBid);
    };
  };

  const handleMinIncrement = (e) => {
    const selectedMinIncrement = Number(e.target.value);
    if (selectedMinIncrement === '' || (selectedMinIncrement >= 5 && selectedMinIncrement <= 1000)) {
      setMinimumIncrement(selectedMinIncrement);
    };
  };


  return (
    <div className="flex flex-col p-10 h-full items-center border-2 ">
      <h2 className="text-3xl font-semibold mb-4 text-blue-950">CREATE AUCTION</h2>
      <form onSubmit={handleSubmit} className="flex w-full space-x-4 space-y-4 bg-[#e2e3ed] p-2 rounded-lg shadow-lg">
        <div className='space-y-4 w-full lg:w-1/2 mt-4 mx-6'>
            <div>
                <label className="block text-lg font-medium text-blue-950" htmlFor="title">
                    Title <span className="text-blue-950">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    placeholder='Enter title of the auction'
                    onChange={handleTitleChange}
                    required
                    className="mt-1 block w-11/12 p-3 border border-gray-300 rounded-md focus:outline-none "
                />
            </div>

            <div>
                <label className="block text-lg font-medium text-blue-950" htmlFor="artwork">
                    Artwork <span className="text-blue-950">*</span>
                </label>
                <ArtworkDropdown userId={userId} artworkId={artworkId} setArtworkId={setArtworkId} />
            </div>

            <div>
        <label className="block text-lg font-medium text-blue-950">
          Start Time <span className="text-blue-950">*</span>
        </label>
        <DateTimePicker
          onChange={handleStartTimeChange}
          value={startTime}
          maxDate={maxDate}
          minDate={new Date()}
          disableClock={false}
          clearIcon={null}
          calendarIcon={null}
          format="y-MM-dd h:mm a"
          className="mt-1 block w-11/12 p-3 border bg-white border-gray-300 rounded-md focus:outline-none"
        />
      </div>

      {/* Duration */}
      <div>
        <label className="block text-lg font-medium text-blue-950" htmlFor="duration">
          Duration (in hours) <span className="text-blue-950">*</span>
        </label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={handleDurationChange}
          required
          min="1"
          max="48"
          step='1'
          placeholder="Enter duration in hours"
          className="mt-1 block w-11/12 p-3 border border-gray-300 rounded-md focus:outline-none"
        />
      </div>

      {/* Computed End Time */}
      <div>
        <label className="block text-lg font-medium text-blue-950">End Time</label>
        <p className="mt-1 p-2 border w-11/12 min-h-8 text-gray-800 border-gray-200 rounded-md bg-gray-50">
        {userTimeZone && endTime &&
            formatDateWithTimeZone(endTime, userTimeZone) 
         }
          </p>
      </div>
    </div>
        <div className='space-y-4 w-full lg:w-1/2'>
            <div>
                <label className="block text-lg font-medium text-blue-950 mr-4" htmlFor="startingBid">
                    Starting Bid <span className="text-blue-950">*</span>
                </label>
                <input
                    type="number"
                    placeholder='$ USD'
                    id="startingBid"
                    min="10"
                    max="10000"
                    step="1"
                    value={startingBid}
                    onChange={handleMinStartingBid}
                    required
                    className="mt-1 block p-3 border border-gray-300 rounded-md focus:outline-none w-11/12"
                />
            </div>

            <div>
                <label className="block text-lg font-medium text-blue-950" htmlFor="minimumIncrement">
                    Minimum Increment 
                </label>
                <input
                    type="number"
                    placeholder='$ USD'
                    id="minimumIncrement"
                    min="5"
                    max="1000"
                    value={minimumIncrement}
                    onChange={handleMinIncrement}
                    className="mt-1 block w-11/12 p-3 border border-gray-300 rounded-md focus:outline-none "
                />
            </div>

            < ReverseGeocoder setLocation={setLocation} locationLoading={locationLoading} setLocationLoading={setLocationLoading} />

           <div className='flex justify-center gap-x-10'>
                <button
                    type="clear"
                    className={`text-lg outline outline-1 rounded px-4 py-1 mb-1 transition-all duration-300 ease-in-out  bg-white hover:bg-green-800  hover:outline-green-900  text-green-800 outline-green-900 hover:text-white font-bold`}
                    onClick={clearFields}
                    >
                  Clear
                </button>
                <button
                disabled={locationLoading||createLoading}
                type="submit"
                className={`text-lg outline outline-1 rounded px-4 py-1 mb-1 transition-all duration-300 ease-in-out  bg-white hover:bg-blue-950  hover:outline-blue-950  text-blue-950 outline-blue-950 hover:text-white font-bold`}

                >
                {createLoading?'Creating':'Create Auction'}
                </button>
            </div>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default CreateAuctionForm;
