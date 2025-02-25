import { connectToDB } from "@utils/database";
import User from "@models/User";

// This will handle PATCH requests to add items to the user's wishlist
export async function PATCH(req, { params }) {
  const { id, workid } = params;

  if (!id || !workid) {
    return new Response(JSON.stringify({ message: "Invalid user or work ID" }), {
      status: 400,
    });
  }

  const work = await req.json();

  try {
    await connectToDB();

    // Find the user by their ID
    const user = await User.findById(id);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Check if the item is already in the wishlist
    const isInWishlist = user.wishList.some((item) => item.workId === workid);
    if (!isInWishlist) {
      user.wishList.push(work); // Add work to wishlist
      await user.save();
    }

    return new Response(JSON.stringify(user.wishList), { status: 200 });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
