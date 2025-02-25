import {
    ArrowBackIosNew,
    ArrowForwardIos,
    Delete,
    Favorite,
    FavoriteBorder,
  } from "@mui/icons-material";
  import { useSession } from "next-auth/react";
  import { useRouter } from "next/navigation";
  import { useState, useContext } from "react";
  import { PostContext } from "@context/PostContext";
  import { encodeUserId } from "@lib/encodeUserId";
   

  const Card = ({ work, username }) => {
    // slider for photos
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();
    const { data: session, update } = useSession();
    const loggedInUserId = session?.user?.id;
    const { setSelectedPost } = useContext(PostContext);
  
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
  
    const handleArtworkClick = () => {
      setSelectedPost(work);
      const id = encodeUserId(loggedInUserId);
      const wid = encodeUserId(work._id);
      router.push(`/${username}/art/${id}?&type=artwork&post=${wid}`);
    }

    // delete work
    const deleteWork = async (e) => {
      e.stopPropagation();
      const hasConfirmed = confirm("Are you sure you want to delete this work?");
      if (hasConfirmed) {
        try {
          const res = await fetch(`/api/artwork/${work._id}`, {
            method: "DELETE",
          });
          if (res.status === 200) {
            window.location.reload();
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
  
    // Add to wish list
    const currentWishList = session?.user?.wishList;
    const isLiked = currentWishList?.find((item) => item?._id === work?._id);
  
    const addToWishList = async (e) => {
      e.stopPropagation();
      try {
        const response = await fetch(
          `/api/user/${loggedInUserId}/wishlist/${work._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        const data = await response.json();
        update({ user: { wishList: data.wishList } });
      } catch (error) {
        console.error(error);
      }
    };
    

    return (
      <div 
    className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
    onClick={handleArtworkClick}
  >
  <div 
    className="relative w-full h-52 min-w-72 overflow-hidden group"
  >
    <div 
      className="flex transition-transform duration-300" 
      style={{ transform: `translateX(-${currentIndex * 100}%)` }}
    >
      {work?.workPhotoPaths?.map((photo, index) => (
        <div key={index} className="w-full flex-shrink-0 relative h-60">
          <img 
            src={photo} 
            alt={work.title} 
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Show previous arrow only if not on the first slide */}
          {currentIndex > 0 && (
            <button 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-1 hover:bg-white/75 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevSlide(e);
              }}
            >
              <ArrowBackIosNew className="text-sm" />
            </button>
          )}
          
          {/* Show next arrow only if not on the last slide */}
          {currentIndex < work.workPhotoPaths.length - 1 && (
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-1 hover:bg-white/75 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                goToNextSlide(e);
              }}
            >
              <ArrowForwardIos className="text-sm" />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
  
  
    <div className="p-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold">{work?.title}</h3>
        </div>
        <div className="font-semibold">
          <span className="text-gray-500">$</span>
          {work?.price}
        </div>
      </div>
    </div>
  
    {loggedInUserId === work?.creator ? (
      <button 
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
        onClick={(e) => deleteWork(e)}
      >
        <Delete className="text-xl" />
      </button>
    ) : (
      <button 
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
        onClick={(e) => addToWishList(e)}
      >
        {isLiked ? (
          <Favorite className="text-xl text-red-500" />
        ) : (
          <FavoriteBorder className="text-xl" />
        )}
      </button>
    )}
  </div>
  
    );
  };
  
  export default Card;
  