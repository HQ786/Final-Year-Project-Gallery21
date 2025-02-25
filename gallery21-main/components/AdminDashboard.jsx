'use client'

import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [flaggedAuctions, setFlaggedAuctions] = useState([]);
  const [flaggedArtworks, setFlaggedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlaggedItems = async () => {
      try {
        setLoading(true);

        const [postsRes, , ] = await Promise.all([
          fetch("/api/posts/flagged"),
        ]);

        if (!postsRes.ok || !auctionsRes.ok || !artworksRes.ok) {
          throw new Error("Failed to fetch flagged items");
        }

        const [postsData, auctionsData, artworksData] = await Promise.all([
          postsRes.json(),
          auctionsRes.json(),
          artworksRes.json(),
        ]);

        setFlaggedPosts(postsData);
        setFlaggedAuctions(auctionsData);
        setFlaggedArtworks(artworksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if(!flaggedPosts)
        fetchFlaggedItems();
  }, []);

  const renderFlaggedItems = (items, type) => (
    <div className="dark:bg-nft-black-3 bg-gray-100 rounded-lg shadow p-4 mb-6">
      <h3 className="dark:text-slate-300 text-lg font-bold mb-4">{`Flagged ${type}`}</h3>
      {items.length > 0 ? (
        items.map((item) => (
          <div
            key={item._id}
            className="border-b border-gray-300 pb-4 mb-4 dark:border-slate-600"
          >
            <h4 className="text-md font-semibold dark:text-slate-300">
              {type === "Posts"
                ? item.title
                : type === "Auctions"
                ? item.name
                : item.artworkTitle}
            </h4>
            <ul className="ml-4 mt-2">
              {item?.flags?.map((flag, index) => (
                <li key={index} className="dark:text-slate-400 text-sm">
                  <p>
                    <span className="font-bold dark:text-slate-300">Reason:</span>{" "}
                    {flag.reason}
                  </p>
                  <p>
  <span className="font-bold dark:text-slate-300">Flagged By:</span>{" "}
  {flag?.username}
</p>

                  <p>
                    <span className="font-bold dark:text-slate-300">At:</span>{" "}
                    {new Date(flag.flaggedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="dark:text-slate-300 text-sm">No flagged {type}.</p>
      )}
    </div>
  );

  if (loading) {
    return <div className="text-center">Loading flagged items...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      <h2 className="dark:text-slate-300 text-2xl font-bold mb-4">Admin Dashboard</h2>
      {renderFlaggedItems(flaggedPosts, "Posts")}
      {renderFlaggedItems(flaggedAuctions, "Auctions")}
      {renderFlaggedItems(flaggedArtworks, "Artworks")}
    </div>
  );
};

export default AdminDashboard;
