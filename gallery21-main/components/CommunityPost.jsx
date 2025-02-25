'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Undo, Redo, Bold, Italic, Underline, Link, List, ListOrdered } from 'lucide-react';
import GifIcon from '@mui/icons-material/Gif';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw, convertFromRaw, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Image as ImageIcon, X } from 'lucide-react';
import GiphyComponent from '@components/GiphyComponent';
import { toast } from 'react-hot-toast';
import '@styles/EditorStyles.module.css';
import { removeImageFromArray } from '@lib/removeImageFromArray';
import EmojiPicker from './EmojiPicker';

const MAX_CHARS = 200;


const CommentBox = ({ updatePost, setUpdatePost, setHasUnsavedChanges, userId, onTrigger, posts, setPosts }) => {
  
  //  const [visibility, setVisibility] = useState('Everyone');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGiphPicker, setShowGiphPicker] = useState(false);
  const [selectedGifs, setSelectedGifs] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const editorRef = useRef(null); // Reference to the editor
  const [postImages, setPostImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (updatePost !== null && updatePost?.status === true) {
      try {
        const rawContent = JSON.parse(updatePost.content);
        const parsedContentState = convertFromRaw(rawContent);
        const newEditorState = EditorState.createWithContent(parsedContentState);
        setPostImages(updatePost.communityImages);
        setSelectedGifs(updatePost.gifs);
        console.log(updatePost.communityImages)
        // Update the editor state
        setEditorState(newEditorState);
      } catch (error) {
        console.error('Error parsing update post content:', error);
        // Fallback to empty editor state
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [updatePost]);
  
  useEffect(() => {

    const contentState = editorState?.getCurrentContent();
    const hasText = contentState?.hasText();
    const hasImages = postImages?.length > 0;
    const hasGifs = selectedGifs?.length > 0;
    setHasUnsavedChanges(hasText || hasImages || hasGifs);

  }, [editorState, postImages, setHasUnsavedChanges]);


  const closeModal = () => {
    setEditorState(EditorState.createEmpty());
    setPostImages([]);
    setCharCount(0);
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleEditorChange = (state) => {
    const currentContent = state.getCurrentContent();
    const currentLength = currentContent.getPlainText('').length;

    if (currentLength <= MAX_CHARS) {
      setEditorState(state);
      setCharCount(currentLength);
    } else {
      console.warn("Character limit reached");
    }
  };
  const handleBeforeInput = (inputChar) => {
    const currentLength = editorState.getCurrentContent().getPlainText('').length;

    // Prevent additional input when limit is reached
    if (currentLength >= MAX_CHARS) {
      // console.warn("Character limit reached, input ignored");
      return 'handled';
    }
    return 'not-handled';
  };

  const handlePastedText = (pastedText) => {
    const currentLength = editorState.getCurrentContent().getPlainText('').length;
    const newLength = currentLength + pastedText.length;

    // Prevent paste if it exceeds the character limit
    if (newLength > MAX_CHARS) {
      // console.warn("Pasted text exceeds character limit, input ignored");
      return 'handled';
    }
    return 'not-handled';
  };
  const mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    editorRef.current.focus(); // Refocus the editor after the button click
  };

  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    editorRef.current.focus(); // Refocus the editor after the button click
  };

  const handleEmojiSelect = (emoji) => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();

    if (plainText.length + emoji.native.length <= MAX_CHARS) {
      const newContentState = Modifier.insertText(contentState, editorState.getSelection(), emoji.native);
      setEditorState(EditorState.push(editorState, newContentState, 'insert-characters'));
    }

  };

  const handleImageUpload = (event) => {
    if (postImages.length === 4) {
      return toast.error("Upload of only up to 4 images is allowed", {
        id: "max-images-toast",
      });
    }
    const file = event.target.files[0];
    if (file) {
      setPostImages((prevImages) => [...prevImages, file]);
    }
  };
  const getContentLength = () => {
    const currentContent = editorState.getCurrentContent();
    return currentContent.getPlainText().length;
  };
  const handlePostSubmit = () => {
    if ( getContentLength() <= MAX_CHARS ) {
      if (updatePost !== null) {
        return handleUpdatePost();
      }
      handleCreatePost();
    }
    else{
      return toast.error("Character limit exceeded", {
        id: "character-limit-toast",
      });
    }
  };


  const handleCreatePost = async () => {
    const contentState = editorState.getCurrentContent();
    if (contentState.hasText() || postImages.length > 0  || selectedGifs.length > 0) { // Ensure there is text to submit
      setLoading(true);
      const formData = new FormData();
      formData.append('content', JSON.stringify(convertToRaw(contentState)));
      formData.append('postType', 'community');
      if(selectedGifs.length>0)
        selectedGifs.forEach((gif, index)=>{
        formData.append(`Gifs[${index}]`, gif);
      });
      postImages.forEach((image, index) => {
        formData.append(`communityImages[${index}]`, image); // Append each image file
      });
      
      setEditorState(EditorState.createEmpty());
      setPostImages([])
      setSelectedGifs([])
      setCharCount(0);

      try {
        const response = await fetch(`/api/user/${userId}/posts`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to create post');
        }

        const result = await response.json();
        posts.unshift(result);  // Add the new post to the posts array
        setHasUnsavedChanges(false);  // Reset unsaved changes
        onTrigger();  // Trigger any callback after the post is created
        setHasUnsavedChanges(false); // No unsaved changes after submission
      } catch (error) {
        return toast.error("Error creating post\nMake sure your connection is strong", {
          id: "connection-error-toast",
        });
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      return toast.error("Cannot submit an empty post", {
        id: "cannot-submit-empty-toast",
      });
    }
   
  };
  

  const handleUpdatePost = async () => {
    const contentState = editorState.getCurrentContent();
    if (contentState.hasText() || postImages.length > 0 || selectedGifs.length > 0) { // Ensure there is text to submit

      setLoading(true);
      const formData = new FormData();
      formData.append('postId', updatePost.postId);
      formData.append('content', JSON.stringify(convertToRaw(contentState)));
      formData.append('postType', 'community');
      if(selectedGifs.length>0)
        selectedGifs.forEach((gif, index)=>{
        formData.append(`Gifs[${index}]`, gif);
      });
      postImages.forEach((image, index) => {
        formData.append(`communityImages[${index}]`, image); // Append each image file
      });
      
      setEditorState(EditorState.createEmpty());
      setPostImages([])
      setSelectedGifs([])
      setCharCount(0);


        try {
          const response = await fetch(`/api/user/${userId}/posts`, {
            method: 'PATCH',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to create post');
          }

          const updatedPost = await response.json();
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === updatedPost._id ? updatedPost : post
            )
          );

          setUpdatePost(null);
          setHasUnsavedChanges(false);
          onTrigger();
          toast.success("Post updated.")

        } catch (error) {
          setLoading(false)
          return toast.error("Error updating post\nMake sure your connection is strong", {
            id: "connection-error-update-toast",
          });
        } finally {
          setLoading(false);
        }
        
    } else {
      return toast.error("Can not upload an empty post", {
        id: "cannot-upload-empty-toast",
      });
    }
  };

  const styleButton = (style, label, icon) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    const isActive = currentStyle.has(style);

    return (
      <button
        onMouseDown={(e) => {
          e.preventDefault(); // Prevent losing focus
          toggleInlineStyle(style);
        }}
        className={`dark:text-slate-200 dark:hover:bg-gray-700 p-2  m-2 hover:bg-gray-200 rounded ${isActive ? 'bg-gray-300 dark:bg-gray-800' : ''}`}
        aria-label={label}
      >
        {icon}
      </button>
    );
  };

  const shouldShowPlaceholder = () => {
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    
    // Check if all blocks are empty or only contain block type without text
    const allBlocksEmpty = blockMap.every(block => {
      // Check if block is completely empty
      if (block.getText().trim() === '') {
        // hide placeholder for list or other block types
        const blockType = block.getType();
        return blockType === 'unstyled';
      }
      return false;
    });

    return allBlocksEmpty;
  };


  return (

    <div>
      <div className=" flex space-x-2 relative overflow-hidden outline outline-1 dark:outline-slate-600 outline-gray-300 shadow-md mb-3">
        <button onMouseDown={(e) => { e.preventDefault(); setEditorState(EditorState.undo(editorState)); editorRef.current.focus(); }} className="dark:text-slate-200 dark:hover:bg-gray-700 p-2  my-2 hover:bg-gray-200 rounded">
          <Undo size={20} />
        </button>
        <button onMouseDown={(e) => { e.preventDefault(); setEditorState(EditorState.redo(editorState)); editorRef.current.focus(); }} className="dark:text-slate-200 dark:hover:bg-gray-700 p-2  my-2 hover:bg-gray-200 rounded">
          <Redo size={20} />
        </button>
        {styleButton('BOLD', 'Bold', <Bold size={20} />)}
        {styleButton('ITALIC', 'Italic', <Italic size={20} />)}
        {styleButton('UNDERLINE', 'Underline', <Underline size={20} />)}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            const url = prompt('Enter the URL:');
            if (url) {
              const contentState = editorState.getCurrentContent();
              const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url });
              const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
              const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
              setEditorState(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey));
              editorRef.current.focus();
            }
          }}
          className="dark:text-slate-200 dark:hover:bg-gray-700 p-2  m-2 hover:bg-gray-200 rounded"
        >
          <Link size={20} />
        </button>
        <button onMouseDown={(e) => { e.preventDefault(); toggleBlockType('ordered-list-item'); }} className=" dark:text-slate-200 dark:hover:bg-gray-700 p-2  m-2 hover:bg-gray-200 rounded">
          <ListOrdered size={20} />
        </button>
        <button onMouseDown={(e) => { e.preventDefault(); toggleBlockType('unordered-list-item'); }} className="dark:text-slate-200 dark:hover:bg-gray-700 p-2 m-2 hover:bg-gray-200 rounded">
          <List size={20} />
        </button>

        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`dark:text-slate-200 dark:hover:bg-gray-700 p-2 m-2 hover:bg-gray-200 rounded flex items-center ${showEmojiPicker&&'bg-gray-300 dark:bg-gray-800'}`}
        >
          <span role="img" aria-label="emoji">😊</span>
        </button>
        <button
          onClick={() => setShowGiphPicker(!showGiphPicker)}
          className={`dark:text-slate-200 dark:hover:bg-gray-700 p-1 m-2 hover:bg-gray-200 rounded flex items-center ${showGiphPicker&&'bg-gray-300 dark:bg-gray-800'}`}
        >
          <GifIcon fontSize="large"/>
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="community-image-upload"
        />
        <label htmlFor="community-image-upload" className="dark:text-slate-200 dark:hover:bg-gray-700 p-2 m-2 hover:bg-gray-200 rounded flex items-center">
          <ImageIcon size={20} />
        </label>
        
      </div>
      {showEmojiPicker && (
        <div className='relative z-10'>
          <EmojiPicker handleEmojiSelect={handleEmojiSelect} setShowEmojiPicker={setShowEmojiPicker} />
        </div>
      )}
        
        {showGiphPicker && (
          <div className="relative z-10">
            <GiphyComponent setShowGiphPicker={setShowGiphPicker} selectedGifs={selectedGifs} setSelectedGifs={setSelectedGifs} />
          </div>  
      )}


      <div className='dark:bg-deviantBlack rounded-lg '>
        <div className="dark:bg-deviantBlack dark:text-slate-300 w-full bg-gray-100 text-gray-900 p-2 rounded mb-4 ">
          <Editor
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            onChange={handleEditorChange}
            handleBeforeInput={handleBeforeInput}
            handlePastedText={handlePastedText}
            placeholder={shouldShowPlaceholder() ? "Tell the community what's up" : ""}
            ref={editorRef}
          />
        </div>
        <div className="flex flex-wrap mb-4">
          
        {postImages.map((image, index) => (
          <div 
            key={index} 
            className="relative group inline-block m-2"
          >
            <div className="relative">
              <img
                src={image instanceof File || image instanceof Blob
                  ? URL.createObjectURL(image)
                  : image}
                alt={`Uploaded ${index}`}
                className="max-w-xl p-4 rounded shadow-md 
                          transition-all duration-300 
                          group-hover:brightness-75"
              />
              
              <button
                onClick={() => removeImageFromArray(index, setPostImages)}
                className="absolute top-0 right-0 mt-6 mr-6 
                          bg-white 
                          text-gray-700 hover:text-gray-900
                          rounded-full p-1 
                          shadow-lg 
                          opacity-100 group-hover:opacity-100 
                          transition-all duration-300 
                          z-20"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
        {selectedGifs?.length>0 && (
          selectedGifs.map((selectedGif, index)=>(
            <div className='relative'>
            <div className="mt-4 mb-2 mx-5">
              <img src={selectedGif} alt="Selected GIF" className="rounded-md shadow-md mt-2" />
            </div>
            <button
            onClick={() => removeImageFromArray(index, setSelectedGifs)}
            className="absolute top-0 right-0 mt-6 mr-6 
                      bg-white 
                      text-gray-700 hover:text-gray-900
                      rounded-full p-1 
                      shadow-lg 
                      opacity-100 group-hover:opacity-100 
                      transition-all duration-300"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        )))}
        
      </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {charCount}/{MAX_CHARS} characters
        </div>

      </div>

      <div className="flex justify-end space-x-2 mx-3">
      { !updatePost && <button onClick={closeModal} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-300">
          Clear
        </button> }
        <button
          onClick={handlePostSubmit}
          className="dark:bg-purple-700 dark:hover:bg-purple-800 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading} // Disable button while loading
        >
          {(updatePost !== null) ? (loading) ? 'Updating...' : 'Update' : loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>

  );
};

export default CommentBox;