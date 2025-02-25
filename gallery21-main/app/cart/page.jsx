"use client";
import { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import { AddCircle, RemoveCircle, Delete, ArrowCircleLeft } from "@mui/icons-material";
import "@styles/Cart.scss";
import getStripe from "/lib/getStripe"; // Import Stripe helper function

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Retrieve cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Calculate total price
  const calcSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Increase quantity
  const increaseQty = (cartItem) => {
    const updatedCart = cart.map((item) =>
      item.workId === cartItem.workId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  // Decrease quantity
  const decreaseQty = (cartItem) => {
    const updatedCart = cart.map((item) =>
      item.workId === cartItem.workId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  // Remove from cart
  const removeFromCart = (cartItem) => {
    const updatedCart = cart.filter((item) => item.workId !== cartItem.workId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  const subTotal = calcSubtotal();

  // Handle Stripe checkout
  const handleCheckout = async () => {
    const stripe = await getStripe();
    const mockUser = { _id: "64ddae3cfb3126fcd3a3b5e9" }; // Mock user ID

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems: cart, userId: mockUser._id }),
    });

    if (response.ok) {
      const { id } = await response.json();
      stripe.redirectToCheckout({ sessionId: id });
    } else {
      alert("Failed to redirect to checkout");
    }
  };

  return (
    <>
      <Navbar />
      <div className="cart">
        <div className="details">
          <div className="top">
            <h1>Your Cart</h1>
            <h2>
              Subtotal: <span>Rs. {subTotal}</span>
            </h2>
          </div>

          {cart.length === 0 && <h3>Empty Cart</h3>}
          {cart.length > 0 && (
            <div className="all-items">
              {cart.map((item, index) => (
                <div className="item" key={index}>
                  <div className="item_info">
                    <img src={item.image} alt="product" />
                    <div className="text">
                      <h3>{item.title}</h3>
                      <p>Category: {item.category}</p>
                      <h4>Rs. {item.price}</h4>
                    </div>
                  </div>

                  <div className="quantity">
                    <AddCircle
                      sx={{ fontSize: "18px", color: "grey", cursor: "pointer" }}
                      onClick={() => increaseQty(item)}
                    />
                    <h3>{item.quantity}</h3>
                    <RemoveCircle
                      sx={{ fontSize: "18px", color: "grey", cursor: "pointer" }}
                      onClick={() => decreaseQty(item)}
                    />
                  </div>
                  <div className="price">
                    <h2>Rs. {item.quantity * item.price}</h2>
                    <p>Rs. {item.price} / each</p>
                  </div>
                  <div className="remove">
                    <Delete
                      sx={{ cursor: "pointer" }}
                      onClick={() => removeFromCart(item)}
                    />
                  </div>
                </div>
              ))}
              <div className="bottom">
                <a href="/">
                  <ArrowCircleLeft sx={{ fontSize: "18px", marginRight: "5px" }} />
                  Continue Shopping
                </a>
                <button onClick={handleCheckout}>CHECK OUT NOW</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
