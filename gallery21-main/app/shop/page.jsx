"use client";
import React, { useState, useEffect } from "react";
import Form from "@components/Form";
import Navbar from "@components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CreateWork = () => {
  const [work, setWork] = useState({
    creator: "",
    category: "All",
    title: "",
    description: "",
    price: "",
    photos: [],
  });

  const mockUser = {
    _id: "64ddae3cfb3126fcd3a3b5e9", // Mock user ID
  };

  const { data: session } = useSession();
  const router = useRouter();

  // Use useEffect to set the creator either from session or mockUser
  useEffect(() => {
    const userId = session?.user?._id || mockUser._id; // Use session if available, otherwise mock user
    setWork((prevWork) => ({ ...prevWork, creator: userId }));
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWork((prevWork) => ({
      ...prevWork,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the price is negative
    if (work.price < 0) {
      alert("Price cannot be negative. Please enter a valid price.");
      return; // Stop the submission
    }

    try {
      const newWorkForm = new FormData();
      for (let key in work) {
        newWorkForm.append(key, work[key]);
      }
      work.photos.forEach((photo) => {
        newWorkForm.append("workPhotoPaths", photo);
      });

      const response = await fetch("/api/artwork/new", {
        method: "POST",
        body: newWorkForm,
      });

      if (response.ok) {
        // Redirect to /stripe-marketplace after successful work creation
        router.push("/stripe-marketplace");
      } else {
        console.error(`Failed to publish work: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Publish work failed: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <Form
        type="Create"
        work={work}
        setWork={setWork}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default CreateWork;
