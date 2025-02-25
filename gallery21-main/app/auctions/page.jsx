'use client'
import React, { useEffect } from 'react'
import { useState } from 'react';
import WorkCard from '@components/WorkCard';

const page = () => {
    const [ongoingAuctions, setOngoingAuctions] = useState([]);
    const [scheduledAuctions, setScheduledAuctions] = useState([]);
    const [completedAuctions, setCompletedAuctions] = useState([]);
    const [loading, setLoading] = useState(true)
    
    useEffect(()=>{
        const getOngoingAuctions = async () => {
            const response = await fetch(`/api/auction?status=Ongoing`);
            const data = await response.json();
            if (data.status === 200) {
            setOngoingAuctions(data.body);
            setLoading(false);
            }
        };
        const getScheduledAuctions = async () => {
          const response = await fetch(`/api/auction?status=Scheduled`);
          const data = await response.json();
          if (data.status === 200) {
          setScheduledAuctions(data.body);
          setLoading(false);
          }
      };
      const getCompletedAuctions = async () => {
        const response = await fetch(`/api/auction?status=Completed`);
        const data = await response.json();
        if (data.status === 200) {
        setCompletedAuctions(data.body);
        setLoading(false);
        }
    };
        getOngoingAuctions();
        getScheduledAuctions();
        getCompletedAuctions();
    },[])

  return (
    <div className='p-4'>
        <h1 className='text-2xl font-semibold text-[#E30014] dark:text-slate-300'>Auction Dashboard</h1>
        {ongoingAuctions?.length>0 && <div className='my-4 space-y-2'>
          <h1 className='text-lg font-semibold text-[#E30014] dark:text-slate-300'>Ongoing Auctions</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ongoingAuctions?.map((auction) => (
                  <WorkCard key={auction?._id} work={auction} type="auction" />
              ))}
          </div>
        </div>}
        {scheduledAuctions?.length>0 && <div className='my-4 space-y-2'>
          <h1 className='text-lg font-semibold text-[#E30014] dark:text-slate-300'>Scheduled Auctions</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {scheduledAuctions?.map((auction) => (
                  <WorkCard key={auction?._id} work={auction} type="auction" />
              ))}
          </div>
        </div>}
        {completedAuctions?.length>0 && <div className='my-4 space-y-2'>
          <h1 className='text-lg font-semibold text-gray-900'>Completed Auctions</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {completedAuctions?.map((auction) => (
                  <WorkCard key={auction?._id} work={auction} type="auction" />
              ))}
          </div>
        </div>}
    </div>
  )
}

export default page

