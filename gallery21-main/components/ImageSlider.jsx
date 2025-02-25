import React, { useState, useRef, useEffect } from 'react';
import Like from './Like';
import MiniLoader from './MiniLoader';
import Link from 'next/link';
import useUserTimeZone from '@lib/useUserTimeZone';
import { formatDateWithTimeZone } from '@lib/dateUtils';
import BidModal from './Auction/BidModal';
import Comment from './Comment';
import { buyArtwork } from '@lib/buyArtwork';
import FlagPost from './FlagPost';

const ImageSlider = ({ selectedPost, setSelectedPost, userId, Posts, setPosts, type, postUsername, loggedUsername }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const contentRef = useRef(null);
  const [isLongPost, setIsLongPost] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [imagesArray, setImagesArray] = useState([]);
  const [enableShowMore, setEnableShowMore] = useState(true);
  const userTimeZone = useUserTimeZone();
  const [isBidModalOpen, setBidModalOpen] = useState(false);

  useEffect(() => {
    if (imagesArray?.length === 0 && selectedPost) {
      if (type === 'post') {
        setImagesArray(selectedPost?.images);
      } else if (type === 'artwork') {
        setImagesArray(selectedPost?.workPhotoPaths);
      }
      else if (type === 'auction'){
        setImagesArray(selectedPost?.artwork?.workPhotoPaths)
      }
    }
  }, [imagesArray, selectedPost, type]);

  useEffect(() => {
    const threshold = 48;
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setIsLongPost(contentHeight > threshold);
    }
    if (threshold<56){
      setEnableShowMore(false);
    }
  }, [selectedPost]);

  const nextSlide = () => {
    setCurrentIndex((current) => 
      current === (imagesArray?.length || 0) - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((current) => 
      current === 0 ? (imagesArray?.length || 0) - 1 : current - 1
    );
  };


  const refreshAuctionData = async (auctionId) => {
    try {
        const response = await fetch(`/api/auction/${auctionId}`);
        const updatedAuction = await response.json();
        // Update your state with the new auction data
        setSelectedPost(updatedAuction);
    } catch (error) {
        console.error('Error fetching auction data:', error);
    }
};

  const handleBuy = async(userId, artwork) => {
    if (userId && artwork){
      const item = {
        artwork: artwork,
        quantity: 1
      }
      await buyArtwork(userId, item)
    }
  }

  return (
    <div className="relative w-full bg-slate-100 dark:bg-deviantBlack rounded-b-lg shadow-lg">
      <div className="relative overflow-hidden " >
        <div className="w-auto h-[66.6667vh] relative flex justify-center items-center bg-customBlack "
        >
          <p className="text-sm absolute top-2 left-2 p-2 text-gray-400  z-10">
            { selectedPost && currentIndex + 1+" of "+imagesArray?.length }
          </p>
          {selectedPost&&type==='post' && <span>
            <FlagPost userId={userId} postId={selectedPost?._id}/>
          </span>}
          <div className="flex justify-center items-center w-full h-[60vh]" >
            {selectedPost?(type==='post'?(
              <img
              src={selectedPost?.images[currentIndex]?.src}
              alt={selectedPost?.images[currentIndex]?.description || 'Art Image'}
              className="h-full object-contain "
              
            />
            ):(type==='auction'?(
              selectedPost?.artwork?.workPhotoPaths &&
              <img
              src={selectedPost?.artwork?.workPhotoPaths[currentIndex]}
              alt={selectedPost?.artwork?.title|| 'Art Image'}
              className="h-full object-contain "
              
            />
            ):
            (
              selectedPost?.workPhotoPaths &&
              <img
              src={selectedPost?.workPhotoPaths[currentIndex]}
              alt={selectedPost?.title|| 'Art Image'}
              className="h-full object-contain "
              
            />
            )
            )):<MiniLoader />}
          </div>
        </div>
        { imagesArray &&
            <>
            {imagesArray?.length > 1 && (
              <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 hover:text-gray-400 -translate-y-1/2 text-white p-2 transition-colors"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 hover:text-gray-400 -translate-y-1/2 text-white p-2 transition-colors"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
            )}
            </>
        }
      </div>

      {imagesArray && 

      <div className="pt-2">
        {/* Dot Indicators */}
        {imagesArray?.length > 1 && (
          <div className="flex justify-center gap-2">
            {imagesArray.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-900 w-2.5 h-2.5' : 'bg-gray-400 '
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
    <div className="float-right relative w-fit flex justify-end items-center px-4 gap-x-2 ">
           {type==='artwork' ?
            (
              loggedUsername!==postUsername && selectedPost && <>
                <button className={`outline outline-1 rounded px-6 py-1 mb-1 transition-all duration-300 ease-in-out font-bold bg-green-500 hover:bg-white hover:outline-green-500 text-white outline-green-500 hover:text-green-500`} onClick={()=>{handleBuy(userId,selectedPost)}}>
                    Buy
                </button>
                <span className='self-start text-gray-800 font-bold text-xl'>{selectedPost?.price}<span className='text-lg px-1 text-gray-600'>$</span></span>
              </>
            )
           :
           (type==='post'?
            (
              <Like
              className="m-2"
              userId={userId}
              postId={selectedPost?._id}
              Posts={Posts}
              setPosts={setPosts}
            />
            ):(selectedPost?.status==='Completed'?
              (<div className='font-bold text-gray-900 '>
                {selectedPost?.bids &&
                'Total bids placed: '+ (selectedPost?.bids?.length || 0)
                }
              </div>) :
              (selectedPost?.status==='Scheduled'?<button className={`outline outline-1 rounded px-3 py-1 mb-1 transition-all duration-300 ease-in-out font-bold bg-purple-600 hover:bg-white hover:outline-purple-600 text-white outline-purple-600 hover:text-purple-600`}>
              Interested?
            </button>:(
              <div className='flex items-center space-x-2'>
                {selectedPost?.bids &&  <div className='font-semibold text-gray-900 dark:text-gray-400 '>
                
                Total bids <span className='self-end text-lg font-bold text-gray-700 dark:text-gray-200'>{selectedPost?.bids?.length || 0}</span>
                
              </div>}
                <button className={`outline outline-1 rounded px-3 py-1 mb-1 transition-all duration-300 ease-in-out font-bold bg-purple-600 hover:bg-white hover:outline-purple-600 dark:hover:bg-purple-800 dark:hover:text-gray-200 text-white outline-purple-600 hover:text-purple-600`}
                onClick={() => setBidModalOpen(true)}>
                  Place a Bid
               </button>
                  <BidModal
                    isOpen={isBidModalOpen}
                    onClose={() => setBidModalOpen(false)}
                    auction={selectedPost}
                    userId={userId}
                    refreshAuctionData={refreshAuctionData}
                />
              </div>
            ))))}
        </div>
      </div>
      }
      {selectedPost &&
      <div className={`text-gray-900 dark:text-gray-300 mb-2 px-5 ${isExpanded ? 'h-auto' : 'h-12'}`} ref={contentRef}>
      <span className="text-2xl font-extrabold dark:font-bold block">{selectedPost.title}</span>
      <div >by <Link href={`/${postUsername}`} className='hover:underline font-bold capitalize'>{postUsername}</Link></div>
      {type === 'post' && selectedPost.images[currentIndex]?.description && (
        <div className="my-6">
          <span className="font-bold line">Image Description</span>
          <br />
          <span className="font-poppins text-sm whitespace-pre-line word-break flex-wrap">
            {selectedPost.images[currentIndex]?.description}
          </span>
        </div>
      )}

      {type!=='auction' ? (type==='post'?(
        <div className="mt-6 ">
        <span className="text-lg font-bold">Details</span>
        <br />
        <span className="text-sm font-poppins whitespace-pre-line word-break flex-wrap">
          {selectedPost.content}
        </span>
      </div>
      ):(
        <div className="mt-6 ">
        <span className="text-lg font-bold">Details</span>
        <br />
        <span className="text-sm font-poppins whitespace-pre-line word-break flex-wrap">
          {selectedPost.description}
        </span>
        <div className="mt-6">
          Category: {selectedPost.category}
        </div>
      </div>
      )):(selectedPost?.status !=='Ongoing' ?
        (
          <div className='mt-6'>
            <div className='font-bold'>Status: <span className='font-normal'>{selectedPost?.status}</span></div><br/>
            <div className='font-bold'>Start Time: <br/><span className='font-normal'>{selectedPost?.startTime && userTimeZone &&
            formatDateWithTimeZone(selectedPost?.startTime, userTimeZone)}</span></div><br/>
            <div className='font-bold'>End Time: <br/><span className='font-normal'>{selectedPost?.endTime && userTimeZone &&
            formatDateWithTimeZone(selectedPost?.endTime, userTimeZone)}</span></div><br />
            <div className='font-bold'>Auction Duration: <span className='font-normal'>{selectedPost?.duration} hr{selectedPost?.duration>1 && 's'}</span></div>
        </div>
        ):(
          (
            <div className='mt-6'>
                <div className='font-bold'>Status: <span className='font-normal'>{selectedPost?.status}</span></div><br/>
            <div className='font-bold'>Start Time: <br/><span className='font-normal'>{selectedPost?.startTime && userTimeZone &&
            formatDateWithTimeZone(selectedPost?.startTime, userTimeZone)}</span></div><br/>
            <div className='font-bold'>End Time: <br/><span className='font-normal'>{selectedPost?.endTime && userTimeZone &&
            formatDateWithTimeZone(selectedPost?.endTime, userTimeZone)}</span></div><br />
            <div className='font-bold'>Auction Duration: <span className='font-normal'>{selectedPost?.duration} hr{selectedPost?.duration>1 && 's'}</span></div>
            </div>
          )
        )
      )
    }
    </div>
    }
      {isLongPost && (
        <button
          className="text-gray-700 dark:text-gray-400 dark:hover:text-gray-500 text-xs hover:text-gray-900 px-4"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
      {(type!=='auction') && <div className="dark:bg-deviantBlack dark:text-gray-200 text-gray-900 relative bg-slate-100 py-2 px-4">
        <span className="font-extrabold text-lg">Comments</span>
        {(type==='artwork')?<Comment artworkId={selectedPost?._id} userId={userId} username={loggedUsername} />:<Comment postId={selectedPost?._id} userId={userId} username={loggedUsername} />}
      </div>}
    </div>
  );
};

export default ImageSlider;
