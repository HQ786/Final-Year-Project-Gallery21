"use client";
import { categories } from "../data";
import WorkList from "./WorkList";
import { useEffect, useState } from "react";
import Loader from "./Loader/Loader";

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [workList, setWorkList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWorkList = async () => {
      const response = await fetch(`/api/artwork/list/${selectedCategory}`);
      const data = await response.json();
      if (data.status === 200) {
        setWorkList(data.body);
        setLoading(false);
      }
    };
    getWorkList();
  }, [selectedCategory]);

  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col m-3">
      <div className="flex flex-wrap gap-x-2 mb-4"> {/* Adjusted margin here */}
        {categories?.map((item, index) => (
          <p
            key={index}
            onClick={() => setSelectedCategory(item)}
            className={`cursor-pointer px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
              item === selectedCategory
                ? "bg-[#ee4f5d] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {item}
          </p>
        ))}
      </div>
     {workList?.length>0 ?  <WorkList data={workList} />:
     <p className='dark:text-slate-300 text-2xl font-extrabold text-[#E30014]'>No Artworks.</p>
     }
    </div>
  );
};

export default Feed;
