import User from "@models/User";
import { connectToDB } from "@utils/database";

const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const getCartItems = async (line_items) => {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    line_items?.data?.forEach(async (item) => {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      cartItems.push({
        productId,
        title: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0],
      });

      if (cartItems.length === line_items?.data?.length) {
        resolve(cartItems);
      }
    });
  });
};

export const POST = async (req, res) => {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const line_Items = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const orderItems = await getCartItems(line_Items);
      const userId = session.client_reference_id;
      const amountPaid = session.amount_total / 100;
      const orderData = {
        id: session.payment_intent,
        user: userId,
        orderItems,
        amountPaid,
      };
      await connectToDB();
      const user = await User.findById(userId);
      user.cart = [];
      user.orders.push(orderData);
      await user.save();
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return new Response("Failed to create the order", { status: 500 });
  }
};
