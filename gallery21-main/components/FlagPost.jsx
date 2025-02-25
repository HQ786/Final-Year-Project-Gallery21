// components/FlagPost.js
'use client'

import { useState } from "react";
import { FlagIcon } from 'lucide-react'; // Adjust the import based on your FlagIcon location
import toast, { Toaster } from "react-hot-toast";
import FlagModal from './FlagModal'

const FlagPost = ({ postId, userId }) => {
  const [reason, setReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFlag = async () => {
    if (userId) {
        if (postId){
            const response = await fetch(`/api/user/${userId}/flagPost`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, reason }),
            });
    
            if (response.ok) {
            toast.success("Post flagged successfully!", {id: 'post-flag-successful'});
            setIsModalOpen(false);
            setReason("");
            } else {
            const error = await response.json();
            toast.error(error.error, {id: 'error-in-flagging'});
            }
        }
        else{
            console.log('postid',postId)
        }
    
     } else {
      toast.error('You need to log in to flag a post', { id: 'login-flag-post' });
    }
  };


  return (
    <div>
      {/* Existing Flag Button */}
      <span>
        <button
          title='Flag post for violation'
          className='absolute top-2 right-6 rounded-full bg-white text-black px-2 py-1 hover:bg-slate-200'
          onClick={() => setIsModalOpen(true)} // Open modal on click
        >
          <FlagIcon width={16} />
        </button>
      </span>

      {/* Modal for flagging a post */}
      <FlagModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} handleFlag={handleFlag} />
      <Toaster />
    </div>
  );
};

export default FlagPost;
