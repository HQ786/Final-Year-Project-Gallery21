// pages/index.js or pages/giphy.js
'use client'
import FlagPost from "@components/FlagPost";
import { useState } from "react";
const HomePage = () => {
  const [reason, setReason] = useState('');
  const maxChars = 500;
  return (
    <div>
      <textarea
            placeholder="Reason for flagging (required)"
            value={reason}
            onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue.length <= maxChars) {
                setReason(inputValue);
                }
            }}
            className="border border-gray-300 rounded w-full p-2 mb-2"
            maxLength={maxChars}
            required

            />
    </div>
  );
};

export default HomePage;
