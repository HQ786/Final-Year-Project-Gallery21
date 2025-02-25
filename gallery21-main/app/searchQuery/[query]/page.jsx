"use client";
import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import WorkList from "@components/WorkList";
import { useRouter } from "next/navigation"; // Correct import for using router in Next.js
import React, { useEffect, useState } from "react";
import "@styles/Search.scss";

const SearchPage = () => {
  const router = useRouter(); // Use useRouter
  const { query } = router; // Access the router's query object

  const [loading, setLoading] = useState(true);
  const [workList, setWorkList] = useState([]);

  useEffect(() => {
    // Only proceed if router is ready and query is defined
    if (router.isReady && query) {
      const getWorkList = async () => {
        try {
          const response = await fetch(`/api/work/search/${query}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          console.log(`search data`, data);
          setWorkList(data);
          setLoading(false);
        } catch (e) {
          console.error(e);
        }
      };
      getWorkList();
    }
  }, [router.isReady, query]); // Effect dependency on router and query

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">
        {query ? `${query} result(s)` : "No query provided"}
      </h1>
      <WorkList data={workList} />
    </>
  );
};

export default SearchPage;
