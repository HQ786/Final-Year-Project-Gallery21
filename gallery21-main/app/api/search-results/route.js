// Import necessary modules
import { NextResponse } from 'next/server';
import Post from '@/models/Post'; 
import Auction from '@/models/Auction';
import Artwork from '@/models/Artwork';
import { connectToDB } from '@utils/database';

// Search Route
export async function GET(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Parse query parameters
    const { search, type, artist, auction, title } = Object.fromEntries(new URL(req.url).searchParams.entries());

    // Prepare to hold results
    const results = {
      posts: [],
      auctions: [],
      artworks: [],
    };

    // Build dynamic query based on type
    if (type) {
      if (type === 'post' || type === 'all') {
        // Query for Posts
        const postQuery = {};
        if (title) postQuery.title = { $regex: title, $options: 'i' };
        if (search) {
          postQuery.$or = [
            { title: { $regex: search, $options: 'i' } },
            { artist: { $regex: search, $options: 'i' } },
          ];
        }
        results.posts = await Post.find(postQuery).exec();
      }

      if (type === 'auction' || type === 'all') {
        // Query for Auctions
        const auctionQuery = {};
        if (auction) auctionQuery.title = auction; // Adjust this according to your auction model
        if (search) {
          auctionQuery.$or = [];
          if (artist) {
            auctionQuery.$or.push({ 'artist.username': { $regex: artist, $options: 'i' } }); // Search by artist's username
          }
          auctionQuery.$or.push(
            { title: { $regex: search, $options: 'i' } }
          );
        }
        results.auctions = await Auction.find(auctionQuery)
          .populate('artist', 'username') // Populate the artist field with username
          .exec();
      }

      if (type === 'artwork' || type === 'all') {
        // Query for Artworks
        const artworkQuery = {};
        if (title) artworkQuery.title = { $regex: title, $options: 'i' };
        if (artist) {
          artworkQuery.artist = { $regex: artist, $options: 'i' }; // Assuming you still want to support string search here
        }
        if (search) {
          artworkQuery.$or = [
            { title: { $regex: search, $options: 'i' } },
          ];
        }
        results.artworks = await Artwork.find(artworkQuery)
          .populate('creator', 'username') // Populate the artist field with username
          .exec();
      }
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
