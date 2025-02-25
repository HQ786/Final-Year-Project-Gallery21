import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export const useImage = () => {
  return useContext(ImageContext);
};

export const ImageProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [originalFileName, setOriginalFileName] = useState('');
  const [isExternalImage, setIsExternalImage] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [artPostImages, setArtPostImages] = useState([]);

  return (
    <ImageContext.Provider value={{ image, setImage, originalFileName, setOriginalFileName, isExternalImage, setIsExternalImage, pageData, setPageData, artPostImages, setArtPostImages }}>
      {children}
    </ImageContext.Provider>
  );
};
