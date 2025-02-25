import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Delete,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import "@styles/WorkCard.scss";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContext } from "react";
import { PostContext } from "@context/PostContext";
import { encodeUserId } from '@lib/encodeUserId';
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

const WorkCard = ({ work, type }) => {
  // slider for photos
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { data: session, update } = useSession();
  const loggedInUserId = session?.user?.id;
  const { setSelectedPost } = useContext(PostContext);
  const artwork = type==='auction' ? work.artwork : work;
  const creator = type==='auction' ? work.artist : artwork.creator;
  
  const goToPrevSlide = (e) => {
    if (currentIndex === 0) {
      setCurrentIndex(artwork.workPhotoPaths.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNextSlide = (e) => {
    if (currentIndex === artwork.workPhotoPaths.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDeleteWork = (e) => {
    e.stopPropagation();
  
    toast((t) => (
      <div>
        <p>Are you sure you want to delete this artwork?</p>
        <div className="flex justify-center">
        <button 
        className="bg-blue-500 text-white rounded p-2 m-2"
          onClick={async () => {
            toast.dismiss(t.id); // Dismiss the toast
            const response = await deleteWork(e); // Call your delete function
  
            if (response.status===200) {
              toast.success("Artwork deleted successfully!");
            } else {
              toast.error("Failed to delete artwork.");
            }
          }}
        >
          Yes, Delete
        </button>
        <button 
        className="bg-slate-200 text-slate-800 rounded p-2 m-2"
          onClick={() => toast.dismiss(t.id)} // Dismiss without doing anything
        >
          Cancel
        </button>
        </div>
      </div>
    ), {
      duration: 4000, // Set duration if you want it to automatically disappear
      position: 'top-center',
      id:'deletion-confirmation-toast'
    });
  };

  // delete work
  const deleteWork = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/artwork/${artwork._id}`, {
        method: "DELETE",
      });
      if (res.status === 200) {
        window.location.reload();
      }
      return res;

    } catch (error) {
      console.error(error);
    }
    
  };

  const handleArtworkClick = () => {
    if (type==='auction') {
      setSelectedPost(work);
      const id = encodeUserId(loggedInUserId);
      const wid = encodeUserId(work._id);
      type==='auction'?router.push(`/${creator.username}/art/${id}?&type=${type}&post=${wid}`):
      router.push(`/${creator?.username}/art/${id}?&type=artwork&post=${wid}`);
    }
    else {
        setSelectedPost(artwork);
        const id = encodeUserId(loggedInUserId);
        const wid = encodeUserId(artwork._id);
        type==='auction'?router.push(`/${creator.username}/art/${id}?&type=${type}&post=${wid}`):
        router.push(`/${creator?.username}/art/${id}?&type=artwork&post=${wid}`);
      }
    
  }

  // previously () => router.push(`/artwork-details?id=${work._id}`)
  
  // Add to wish list
  const currentWishList = session?.user?.wishList;
  const isLiked = currentWishList?.find((item) => item?._id === artwork?._id);

  const addToWishList = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `/api/user/${loggedInUserId}/wishlist/${artwork._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(artwork)
        }
      );

      const data = await response.json();
      update({ user: { wishList: data.wishList } });
      if(response.status===200){
        toast.success('Artwork added to wishlist',{id:"wishlist-artwork-patch-toast"})
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 w-11/12"
      onClick={() => { handleArtworkClick() }}
    >
      <div
        className="relative h-44 overflow-hidden group"
      >
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {artwork?.workPhotoPaths?.map((photo, index) => (
            <div key={index} className="w-full flex-shrink-0 relative h-44">
              <img
                src={photo}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                {work?.status==='Scheduled'&& loggedInUserId!==work?.artist?._id &&<button className="max-h-6 text-white bg-purple-600 px-1 m-1 rounded-lg text-xs font-bold opacity-75 hover:opacity-100" onClick={(e)=>e.stopPropagation()}>Interested?</button>}
              </div>

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
              {currentIndex < artwork.workPhotoPaths.length - 1 && (
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
            <h3 className="font-bold text-sm">{work?.title}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <img
                src={creator?.profileImagePath || '/assets/nft5.png'}
                alt="creator"
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="mx-2">
                <Link className="hover:text-gray-950" href={`/${creator?.username}`}>{creator?.username}</Link>
              </div>
            </div>
          </div>
          <div className="font-semibold">
            <span className="text-gray-500">$</span>
            {type==='auction'?work?.startingBid:artwork?.price}
          </div>
        </div>
      </div>

      { type!=='auction' &&(loggedInUserId === creator?._id  ?  (
        <button
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          onClick={(e) => handleDeleteWork(e)}
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
      ))}
      <Toaster />
    </div>

  );
};

export default WorkCard;