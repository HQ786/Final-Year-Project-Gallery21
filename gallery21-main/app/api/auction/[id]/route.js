import { connectToDB } from "@utils/database";
import Auction from "@models/Auction";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = params; 
    let auction;

    if (mongoose.Types.ObjectId.isValid(id)) {
      auction = await Auction.findById(id).populate("artwork artist");
    } else {
      auction = await Auction.find({ status: id }).populate("artwork artist");
    }

    if (!auction || (Array.isArray(auction) && auction.length === 0)) {
      return NextResponse.json({
        status: 404,
        body: {
          message: "Auction not found!",
        },
      });
    }

    return NextResponse.json( auction, { status: 200 });

  } catch (error) {
    console.error("Error fetching auction:", error);
    return NextResponse.json({
      status: 500,
      body: {
        message: "Failed to fetch auction!",
      },
    });
  }
};


export const PUT = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = params; // Get auction ID from params
    const updatedData = await req.json(); // Extract the payload

    const updatedAuction = await Auction.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
    });

    if (!updatedAuction) {
      return NextResponse.json({
        status: 404,
        body: {
          message: "Auction not found!",
        },
      });
    }

    return NextResponse.json({
      status: 200,
      body: updatedAuction,
    });
  } catch (error) {
    console.error("Error updating auction:", error);
    return NextResponse.json({
      status: 500,
      body: {
        message: "Failed to update auction!",
      },
    });
  }
};


export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = params; // Get auction ID from params

    const deletedAuction = await Auction.findByIdAndDelete(id);

    if (!deletedAuction) {
      return NextResponse.json({
        status: 404,
        body: {
          message: "Auction not found!",
        },
      });
    }

    return NextResponse.json({
      status: 200,
      body: {
        message: "Auction deleted successfully!",
      },
    });
  } catch (error) {
    console.error("Error deleting auction:", error);
    return NextResponse.json({
      status: 500,
      body: {
        message: "Failed to delete auction!",
      },
    });
  }
};
