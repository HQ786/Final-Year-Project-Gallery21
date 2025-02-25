import Artwork from "@models/Artwork";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    // Fetch artworks where flags array is not empty
    const flaggedArtworks = await Artwork.find({ "flags.0": { $exists: true } });

    return NextResponse.json(flaggedArtworks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch flagged artworks" },
      { status: 500 }
    );
  }
}
