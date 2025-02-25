'use client'
import React, { useState } from "react";

const Modal = ({ isOpen, onClose, handleFlag }) => {
    const [reason, setReason] = useState('');
    const maxChars = 500;
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 w-96 relative">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            &times; {/* Close button */}
          </button>
          <div>
          <h2 className="text-lg font-semibold mb-4">Flag Post</h2>
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
          <div className="flex justify-end">
            <button
              onClick={handleFlag}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Submit Flag
            </button>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            {maxChars - reason.length} characters remaining
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;