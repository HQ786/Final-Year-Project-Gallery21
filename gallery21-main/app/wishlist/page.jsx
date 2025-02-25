"use client";
import Navbar from "@components/Navbar";
import WorkList from "@components/WorkList";
import "@styles/Wishlist.scss";

// Mock user data
const mockUser = {
  profileImagePath: "/assets/nft5.png",
  cart: [],
  wishList: [],
  _id: "64ddae3cfb3126fcd3a3b5e9",
};

const WishList = () => {
  const wishList = mockUser.wishList; // Use mock user's wishlist

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Wish List</h1>
      {wishList.length === 0 ? (
        <p>No items in your wishlist</p>
      ) : (
        <WorkList data={wishList} />
      )}
    </>
  );
};

export default WishList;
