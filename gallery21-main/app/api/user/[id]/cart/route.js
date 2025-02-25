import { connectToDB } from "@utils/database";
import User from "@models/User";

// Define an async function for handling the API request
export async function POST(req, { params }) {
  const { id } = params; // Get the user ID from the request parameters
  const { cart } = await req.json(); // Get the updated cart from the request body

  try {
    // Connect to the database
    await connectToDB();

    // Find the user by their ID and update their cart
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { cart },
      { new: true } // Return the updated document
    );

    // Check if the user was successfully found and updated
    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Return the updated cart to the client
    return new Response(JSON.stringify(updatedUser.cart), {
      status: 200,
    });

  } catch (err) {
    // Log the error to the console and return a 500 response to the client
    console.error("Error updating cart:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
