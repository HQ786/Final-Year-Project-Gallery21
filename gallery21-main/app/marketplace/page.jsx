"use client";
import Feed from "@components/Feed";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer"; // Importing Footer component
import { Suspense } from "react";

const Home = () => {
  return (
    <>
      <Suspense>
        <Feed />
      </Suspense>
    </>
  );
};

export default Home;
