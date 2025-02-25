import Stripe from "stripe";
import User from "@models/User"; // Import your User model
import { connectToDB } from "@utils/database"; // Adjust this import according to your database connection utility

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not defined");
    }

    const { item, userId } = await req.json();

    if (!item || !userId || !item.artwork || !item.artwork.title || !item.artwork.price || !item.quantity) {
      return new Response(JSON.stringify({ error: "Invalid request payload" }), { status: 400 });
    }

    // Connect to the database
    await connectToDB();

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    console.log(item.price)
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: item.artwork.currency || "cad",
            product_data: {
              name: item.artwork.title,
              images: [isValidUrl(item.artwork.workPhotoPaths[0]) ? item.artwork.workPhotoPaths[0] : "https://via.placeholder.com/150"],
              metadata: { productId: item.artwork._id },
            },
            unit_amount: item.artwork.price * 100, // Convert price to smallest currency unit (e.g., cents)
        },
        quantity: item.quantity,
      }],
      client_reference_id: userId,
      success_url: `${req.headers.get("origin")}/success`,
      cancel_url: `${req.headers.get("origin")}/canceled`,
    };

    const session = await stripe.checkout.sessions.create(params);

    return new Response(JSON.stringify(session), { status: 200 });
  } catch (error) {
    console.error("Stripe Error:", error.stack || error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

// Utility function to check if the URL is valid
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};
