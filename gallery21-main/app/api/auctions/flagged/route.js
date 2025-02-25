import Auction from "@models/Auction";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    // Fetch auctions where flags array is not empty
    const flaggedAuctions = await Auction.find({ "flags.0": { $exists: true } });

    return NextResponse.json(flaggedAuctions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch flagged auctions" },
      { status: 500 }
    );
  }
}
