"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import from 'next/navigation'

const CanceledPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect the user to /stripe-marketplace when they land on the canceled page
    router.push("/stripe-marketplace");
  }, [router]);

  return null; // Optionally, show a loader or a message before redirecting
};

export default CanceledPage;
