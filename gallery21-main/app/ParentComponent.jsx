import React, { useState } from "react";
import WorkDetails from "./WorkDetails"; // Update the path as necessary
import Cart from "./Cart"; // Update the path as necessary

const ParentComponent = () => {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (newItem) => {
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
      <WorkDetails onAddToCart={handleAddToCart} />
      <Cart cartItems={cartItems} setCartItems={setCartItems} />
    </div>
  );
};

export default ParentComponent;
