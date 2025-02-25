import React from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useRef, useEffect } from 'react'

const EmojiPicker = ({handleEmojiSelect, setShowEmojiPicker}) => {
    const emojiRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (emojiRef.current && !emojiRef.current.contains(event.target)) {
            setShowEmojiPicker(false);
          }
        };
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [setShowEmojiPicker]);

  return (
      <div className="absolute z-10" ref={emojiRef}>
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
          />
        </div>
  )
}

export default EmojiPicker
