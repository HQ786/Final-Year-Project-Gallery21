"use client";
import React, { useState, useEffect } from "react";
import Form from "@components/Form";
import Navbar from "@components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CreateWork = () => {
  const [work, setWork] = useState({
    creator: "",
    category: "All",
    title: "",
    description: "",
    price: "",
    photos: [],
  });

  const [submitLoading, setSubmitLoading] =  useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Use useEffect to set the creator from session
  useEffect(() => {
    const userId = session?.user?.id;
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
    const userId = session?.user?.id;
  
    // Validation checks
    if (!userId) {
      toast.error("Please log in before creating artwork.", { id: "login-before-creation-toast" });
      return;
    }
  
    if (work.price < 0) {
      toast.error("Price cannot be negative. Please enter a valid price.", { id: "toast-negative-image-error" });
      return;
    }
  
    if (work.photos.length === 0) {
      toast.error("Please upload at least one image for the artwork.", { id: "toast-upload-image-error" });
      return;
    }
  
    // Ensure all photos are valid File objects
    const invalidPhotos = work.photos.some(
      (photo) => !(photo instanceof File || typeof photo === "string")
    );
    if (invalidPhotos) {
      toast.error("Invalid image format. Please upload valid image files.", { id: "toast-invalid-image-error" });
      return;
    }
  
    if (!work.title || !work.description || !work.category) {
      toast.error("Please fill in all required fields before submitting.", { id: "toast-missing-fields-error" });
      return;
    }
  
    // Start submission
    setSubmitLoading(true);
    try {
      const newWorkForm = new FormData();
      newWorkForm.append("creator", userId);
      newWorkForm.append("title", work.title);
      newWorkForm.append("description", work.description);
      newWorkForm.append("category", work.category);
      newWorkForm.append("price", work.price);
  
      // Append photos
      work.photos.forEach((photo, index) => {
        newWorkForm.append("workPhotoPaths", photo instanceof File ? photo : photo); // Allow for uploaded URLs
        console.log(`Photo ${index + 1} appended:`, photo);
      });
  
      const response = await fetch("/api/artwork/new", {
        method: "POST",
        body: newWorkForm,
      });
  
      if (response.ok) {
        toast.success("Artwork created successfully!", { id: "toast-success-artwork" });
      } else {
        const errorText = await response.text();
        toast.error(`Failed to publish artwork: ${errorText}`, { id: "toast-publish-failed" });
      }
    } catch (error) {
      console.error(`Publish work failed: ${error.message}`);
      toast.error("An unexpected error occurred. Please try again.", { id: "toast-unexpected-error" });
    } finally {
      setSubmitLoading(false);
      setWork({
        creator: "",
        category: "All",
        title: "",
        description: "",
        price: "",
        photos: [],
      });
    }
  };
  
  

  return (
    <>
      {/* <Navbar /> */}
      <Form
        type="Create"
        work={work}
        setWork={setWork}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submitLoading={submitLoading}
      />
    </>
  );
};

export default CreateWork;
