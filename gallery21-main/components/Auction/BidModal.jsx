'use client'

import React, { useState, useEffect } from 'react';
import toast, {Toaster} from 'react-hot-toast';
import { db } from '@utils/firebaseClient';
import { ref, onValue, get } from 'firebase/database';

const BidModal = ({ isOpen, onClose, auction, userId, refreshAuctionData }) => {
    const [bidAmount, setBidAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const auctionId = auction?._id;
    const [currentMaxBid, setCurrentMaxBid] = useState(0);
    const [totalBids, setTotalBids] = useState(0);
    useEffect(() => {
        const bidsRef = ref(db, `bids/${auctionId}`);

        // Fetch existing bids on mount
        get(bidsRef).then((snapshot) => {
            const existingBids = snapshot.val() || {};
            const bidsArray = Object.values(existingBids);
            const highestBid = bidsArray.length
                ? Math.max(...bidsArray.map(bid => bid.bidAmount))
                : auction.startingBid; // Use auction.startingBid if no bids exist
            setCurrentMaxBid(highestBid);
            setTotalBids(bidsArray.length);
        }).catch((error) => {
            console.error("Error fetching bids:", error);
        });

        // Listen for new bids
        const unsubscribe = onValue(bidsRef, (snapshot) => {
            const newBids = snapshot.val() || {};
            const bidsArray = Object.values(newBids);
            const highestBid = bidsArray.length
                ? Math.max(...bidsArray.map(bid => bid.bidAmount))
                : auction?.startingBid; // Use auction.startingBid if no bids exist
            setCurrentMaxBid(highestBid);
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    }, [auctionId, auction]);

    const handlePlaceBid = async (event) => {
        event.preventDefault();
        let bidLimit= currentMaxBid-1;
        if (totalBids>0)
            bidLimit = currentMaxBid +((auction?.minimumIncrement)?(auction?.minimumIncrement-1): 0 );
        console.log('bidLimit',bidLimit);
        const parsedBidAmount = parseFloat(bidAmount);
        if (isNaN(parsedBidAmount) || parsedBidAmount <= 0) {
            console.error("Invalid bid amount:", bidAmount);
            return;
        }

        if (bidAmount <= bidLimit) {
            (auction?.minimumIncrement)?
            toast.error(`Your bid must be higher than the current highest bid of $${currentMaxBid} + ${auction?.minimumIncrement}`,{id: "low-bid-increment-toast",}):
            toast.error(`Your bid must be higher than the current highest bid of $${currentMaxBid}.`,{id: "low-bid-value-toast",});

            return;
        }

        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/auction/${auctionId}/bid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, bidAmount }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Bid placed successfully!');
            } else {
                toast.error(result.message || 'Failed to place bid',{id: "bid-submission-failed-toast",});
            }
        } catch (error) {
            toast.error('An error occurred while placing the bid. Please try again.',{
                id: "location-not-given-toast",
              });
              console.log(error)
        }
        finally{
            setIsSubmitting(false)
            refreshAuctionData(auctionId);
        }
    };


    // Prevent rendering if modal is not open
    if (!isOpen) return null;
    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                    <h2 className="text-lg font-bold mb-4">Place Your Bid</h2>
                    {currentMaxBid &&<p>{totalBids>0?'Current Highest Bid: ':'Minimum Starting Bid: '}<strong>{currentMaxBid}</strong></p>}
                    <input
                        type="number"
                        placeholder={`Place a bid at least ${totalBids>0?(currentMaxBid?(currentMaxBid + auction?.minimumIncrement || 0):(auction?.startingBid)|| '1'):
                        (currentMaxBid?(currentMaxBid):(auction?.startingBid)|| '1')
                        }`}
                        className="w-full p-2 border rounded mb-4"
                        value={bidAmount}
                        step={auction?.minimumIncrement || '1'}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={currentMaxBid?(currentMaxBid + auction?.minimumIncrement || 1):(auction?.startingBid)|| '1'}
                        max={1000}
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ${
                                isSubmitting && 'opacity-50 cursor-not-allowed'
                            }`}
                            onClick={handlePlaceBid}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Placing...' : 'Place Bid'}
                        </button>
                    </div>
                </div>
                <Toaster/>
            </div>
        )
    );
};

export default BidModal;
