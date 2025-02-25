// app/work-details/page.jsx
"use client";
import { useState, useEffect, Suspense } from "react";
import { ShoppingCart } from "@mui/icons-material";
import "@styles/WorkDetails.scss";
import Navbar from "@components/Navbar";
import { useSearchParams } from "next/navigation";
import Loader from "@components/Loader";
import {
  ArrowBackIosNew,
  ArrowForwardIos,

} from "@mui/icons-material";

const WorkDetailsContent = ({ onAddToCart }) => {
  const [loading, setLoading] = useState(true);
  const [work, setWork] = useState({});
  const searchParams = useSearchParams();
  const workId = searchParams.get("id");

  const goToPrevSlide = (e) => {
    if (currentIndex === 0) {
      setCurrentIndex(work.workPhotoPaths.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNextSlide = (e) => {
    if (currentIndex === work.workPhotoPaths.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Fetch work details
  useEffect(() => {
    const getWorkDetails = async () => {
      const response = await fetch(`/api/artwork/${workId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setWork(data.body);
      setLoading(false);
    };
    if (workId) {
      getWorkDetails();
    }
  }, [workId]);

  // Handle Add to Cart (Local State Update)
  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    const newCartItem = {
      workId,
      image: work.workPhotoPaths[0],
      title: work.title,
      category: work.category,
      price: work.price,
      quantity: 1,
    };

    // Check if the item is already in the cart
    const isInCart = cartItems.some((item) => item.workId === workId);
    if (!isInCart) {
      const updatedCart = [...cartItems, newCartItem];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      alert("Item added to cart");
    } else {
      alert("Item is already in the cart");
    }
  };

  return (
    <>
      <Navbar />
      <div className="work-details">
        <div className="title">
          <h1 className="text-center font-extrabold text-3xl capitalize">Title: {work.title}</h1>
        </div>

<div className="rounded-md w-96 items-center">
      {work?.workPhotoPaths?.map((photo, index) => (
        <div key={index} className="w-full flex-shrink-0 relative">
          <img 
            src={photo} 
            alt={work.title} 
            className="w-full h-full object-cover"
          />
          <button 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-1 hover:bg-white/75"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevSlide(e);
            }}
          >
            <ArrowBackIosNew className="text-sm" />
          </button>
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-1 hover:bg-white/75"
            onClick={(e) => {
              e.stopPropagation();
              goToNextSlide(e);
            }}
          >
            <ArrowForwardIos className="text-sm" />
          </button>
        </div>
      ))}</div>
        <hr />
        <h3 className="text-xl font-bold">About this product</h3>
        <p className="font-poppins">{work.description}</p>
        <h3 className="text-xl font-bold">Price of this Artwork</h3>
        <p className="font-poppins">Rs. {work.price}</p>
        <button className="w-52" type="submit" onClick={handleAddToCart}>
          <ShoppingCart />
          ADD TO CART
        </button>
      </div>
    </>
  );
};

const WorkDetails = () => {
  return (
    <Suspense fallback = {<Loader/>}>
      <WorkDetailsContent />
    </Suspense>
  )
};

export default WorkDetails;
