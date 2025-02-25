import User from "@models/User";
import { connectToDB } from "@utils/database";
import bcrypt from 'bcryptjs'; 
import mongoose from "mongoose";

export const GET = async (request, { params }) => {

  const { id: identifier } = params; // Get user ID from route parameters

  try {
    console.log('identifier',identifier)
    await connectToDB();
    let user;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier);
    } else {
      // If not a valid ObjectId, search by username
      user = await User.findOne({ username: identifier });
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404 });
    }
    // Exclude sensitive information before sending the response
    const { password: userPassword, ...userData } = user.toObject();
    return new Response(
      JSON.stringify(userData),
      { status: 200 }
    );
    

  } catch (error) {
    console.error('Error handling user profile:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to process request' }),
      { status: 500 }
    );
  }
};

export const PATCH = async (request, { params }) => {
  const { id } = params; // Get user ID from route parameters

  try {
    await connectToDB(); // Ensure you have the database connection established

    const body = await request.json(); // Access the JSON body
    const { username, email, password } = body; // Destructure username, email, and password from the body

    // Fetching the user to update
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    // Update username if provided and allowed
    if (username) {
      const currentTime = new Date();
      const lastUsernameChange = userToUpdate.lastUsernameChange; // Assume you have this field in your User model

      // Check if the username change is allowed (once per week)
      const timeSinceLastChange = (currentTime - lastUsernameChange) / (1000 * 60 * 60 * 24); // in days
      if (timeSinceLastChange < 7) {
        return new Response(
          JSON.stringify({ message: 'You can only change your username once per week.' }),
          { status: 400 }
        );
      }
      userToUpdate.username = username; // Update username
      userToUpdate.lastUsernameChange = currentTime; // Update last username change timestamp
    }

    // Update email if provided
    if (email) {
      userToUpdate.email = email; // Update email
    }

    // Update password if provided
    if (password) {
      userToUpdate.password = password;
    }

    // Save the updated user
    await userToUpdate.save();

    return new Response(
      JSON.stringify({ message: 'User profile updated successfully', user: userToUpdate }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to process request' }),
      { status: 500 }
    );
  }
};


export const DELETE = async (request, { params }) => {
  const { id } = params; // Get user ID from route parameters

  try {
    await connectToDB();

    // First, find and delete all artworks created by the user
    await Artwork.deleteMany({ creator: id });

    // Next, find and delete all posts created by the user
    await Post.deleteMany({ userId: id });

    // Finally, find and delete all ongoing or scheduled auctions for the user's artworks
    const auctionsToDelete = await Auction.find({ artist: id });
    if (auctionsToDelete)
      await Auction.deleteMany({ artist: id });

    // After deleting related data, delete the user profile
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'User profile and related data deleted successfully' }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting user profile and related data:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to process request' }),
      { status: 500 }
    );
  }
};