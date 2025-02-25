import { connectToDB } from "@utils/database";
import Auction from "@models/Auction";
import Bid from "@models/Bid";
import Artwork from "@models/Artwork";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (req) => {
  
  const url = new URL(req.url);
  const urlParams = new URLSearchParams(url.search);

  const status = urlParams.get('status') || ''; 

  try {
    await connectToDB();
    let auctions;
    if (status === '') {
        auctions = await Auction.find().populate('artwork artist bids');
    }
    
    else {
      auctions = await Auction.find({status: status}).populate('artwork artist bids');
    }

    return NextResponse.json({
      status: 200,
      body: auctions,
    });
  } catch (error) {
    console.error("Error getting auctions:", error);
    return NextResponse.json({
      status: 500,
      body: {
        message: "Failed to get auctions",
      },
    });
  }
};


export const POST = async (req) => {
  
  try {
  
    await connectToDB();
    
    const {
      title,
      artist,
      artworkId,
      startTime,
      endTime,
      duration,
      location,
      startingBid,
      minimumIncrement,
    } = await req.json();

    const artwork = mongoose.Types.ObjectId.isValid(artworkId) 
    ? (artworkId) 
    : null;

    
    if (!artwork) {
      return NextResponse.json({
        status: 400,
        body: {
          message: "Invalid artwork ID",
        },
      });
    }
    const auction = await Auction.findOne({ artwork, status: 'Scheduled' });

    if (auction) {
      return NextResponse.json({
        status: 400,
        body: {
          message: "Artwork already scheduled!",
        },
      });
    }
    
    const newAuction = await Auction.create({
      title,
      artist,
      artwork,
      duration,
      startTime,
      endTime,
      location,
      startingBid,
      minimumIncrement,
    });

    return NextResponse.json({
      status: 201,
      body: newAuction,
    });
  } catch (error) {
    console.error("Error creating auction:", error);
    return NextResponse.json({
      status: 500,
      body: {
        message: "Failed to create auction!",
      },
    });
  }
};
