import { connectToDB } from "@utils/database";
import Auction from "@models/Auction";
import admin from "@utils/firebaseAdmin";
import { NextResponse } from "next/server";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = params; // Auction ID from params
    const { userId, bidAmount } = await req.json(); 

    // Fetch the auction from MongoDB
    const auction = await Auction.findById(id);
    if (!auction) {
      return NextResponse.json({
        status: 404,
        body: {
          message: "Auction not found!",
        },
      });
    }

    const now = new Date();
    if (now < auction.startTime || now > auction.endTime) {
      return NextResponse.json({
        status: 400,
        body: {
          message: "Bidding is not allowed outside the auction timeframe.",
        },
      });
    }

    // Fetch existing bids from Firebase
    const bidsSnapshot = await admin.database().ref(`bids/${id}`).once('value');
    const existingBids = bidsSnapshot.val() || {};
    const highestBid = Object.values(existingBids).length
      ? Math.max(...Object.values(existingBids).map(bid => bid.bidAmount))
      : auction.startingBid-auction?.minimumIncrement-1;

    const minimumRequiredBid = highestBid + auction?.minimumIncrement;

    console.log('minimumRequiredBid',minimumRequiredBid)

    if (bidAmount < minimumRequiredBid) {
      return NextResponse.json({
        status: 400,
        body: {
          message: `Your bid must be at least $${minimumRequiredBid}.`,
        },
      });
    }

    // Create the bid entry in Firebase
    const newBidId = Date.now().toString(); // Use timestamp as unique ID
    const newBid = {
      userId,
      bidAmount,
      timestamp: admin.database.ServerValue.TIMESTAMP,
    };

    await admin.database().ref(`bids/${id}/${newBidId}`).set(newBid);

    // Update auction's maxBid and totalBids in Firebase
    const totalBids = Object.keys(existingBids).length + 1; // Increment total bids count
    const maxBid = Math.max(highestBid, bidAmount); // Update maxBid if necessary

    await admin.database().ref(`auctions/${id}`).update({
      totalBids,
      maxBid,
    });

    // Also push the new bid reference ID into the MongoDB auction's bids array
    await Auction.findByIdAndUpdate(
      id,
      { $push: { bids: newBidId } }, // Push the new bid ID into the bids array
      { new: true }
    );

    return NextResponse.json({
      status: 201,
      body: {
        message: "Bid placed successfully.",
        bid: newBid,
      },
    });

  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json({
      status: 500,
      body: {
        message: "Failed to place bid!",
      },
    });
  }
};

  



// import { connectToDB } from "@utils/database";
// import Auction from "@models/Auction";
// import Bid from "@models/Bid";
// import { NextResponse } from "next/server";

// export const POST = async (req, { params }) => {
//   try {
//     await connectToDB();

//     const { id } = params; // Auction ID from params
//     const { userId, bidAmount } = await req.json(); // Extract payload

//     const auction = await Auction.findById(id);

//     if (!auction) {
//       return NextResponse.json({
//         status: 404,
//         body: {
//           message: "Auction not found!",
//         },
//       });
//     }

//     const now = new Date();
//     if (now < auction.startTime || now > auction.endTime) {
//       return NextResponse.json({
//         status: 400,
//         body: {
//           message: "Bidding is not allowed outside the auction timeframe.",
//         },
//       });
//     }

//     const highestBid = auction.bids.length
//       ? Math.max(...auction.bids.map(bid => bid.bidAmount))
//       : auction.startingBid - auction.minimumIncrement;

//     const minimumRequiredBid = highestBid + auction.minimumIncrement;

//     if (bidAmount < minimumRequiredBid) {
//       return NextResponse.json({
//         status: 400,
//         body: {
//           message: `Your bid must be at least $${minimumRequiredBid}.`,
//         },
//       });
//     }

//     const newBid = await Bid.create({ auction: id, bidder: userId, bidAmount });
//     const updatedAuction = await Auction.findOneAndUpdate(
//       { _id: auction._id },
//       { $push: { bids: newBid._id } },
//       { new: true }
//   );

//     return NextResponse.json({
//       status: 201,
//       body: {
//         message: "Bid placed successfully.",
//         bid: newBid, updatedAuction
//       },
//     });

//   } catch (error) {
//     console.error("Error placing bid:", error);
//     return NextResponse.json({
//       status: 500,
//       body: {
//         message: "Failed to place bid!",
//       },
//     });
//   }
// };
