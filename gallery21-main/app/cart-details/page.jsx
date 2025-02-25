'use client'

import React, { useState } from "react";
import ArtworkDetails from "../artwork-details/page"; // Adjust the path as per your project structure
import Cart from "../cart/page"; // Adjust the path as per your project structure

const ParentComponent = () => {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (newItem) => {
    // Check if the item is already in the cart
    const isInCart = cartItems.some((item) => item.workId === newItem.workId);
    if (!isInCart) {
      setCartItems([...cartItems, newItem]); // Add item to cart
      alert("Item added to cart");
    } else {
      alert("Item is already in the cart");
    }
  };

  return (
    <div>
      {/* Pass handleAddToCart to ArtworkDetails */}
      <ArtworkDetails onAddToCart={handleAddToCart} />

      {/* Display the Cart */}
      <Cart cartItems={cartItems} setCartItems={setCartItems} />
    </div>
  );
};

export default ParentComponent;
