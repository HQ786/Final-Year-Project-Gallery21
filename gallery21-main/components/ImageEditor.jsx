"use client";

import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import contrastIco from '@public/contrast2.png';
import grayscaleIco from '@public/gray.png';
import sharpnessIco from '@public/sharpness.svg';
import NextImage from "next/image";
import { UploadCloud, CropIcon, Download, Paintbrush, ZoomIn } from "lucide-react";
import { useImage } from '@context/ImageContext';
import { useRouter } from "next/navigation";
import { dataURLtoFile } from "@lib/dataUrltoFile";

const ImageEditor = () => {
  const { image, setImage, originalFileName, setOriginalFileName, isExternalImage, setIsExternalImage, pageData } = useImage();

  const [crop, setCrop] = useState({
    x: 10,
    y: 10,
    width: 50,
    height: 50,
    unit: "px",
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [zoomFactor, setZoomFactor] = useState(1);
  const imgRef = useRef(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 400, height: 400 });
  const [isCropMode, setIsCropMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const router = useRouter();

  // Filter state variables
  const [grayscale, setGrayscale] = useState(0);
  const [sharpness, setSharpness] = useState(1);
  const [contrast, setContrast] = useState(1);

  const handleNavigation = (url) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) {
        throw new Error('Route change aborted.'); // Prevent navigation
      }
    }
  };

  useEffect(() => {
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = async (...args) => {
      handleNavigation(args[0]);
      return originalPush(...args);
    };

    router.replace = async (...args) => {
      handleNavigation(args[0]);
      return originalReplace(...args);
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [hasUnsavedChanges, router]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Required for displaying the confirmation dialog
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please upload an image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setCrop({
        x: 10,
        y: 10,
        width: 50,
        height: 50,
        unit: "px",
      });
      setIsCropMode(false);
      setZoomFactor(1);
      setGrayscale(0);
      setSharpness(1);
      setContrast(1);  // Reset all filters when a new image is uploaded
      setHasUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
    setOriginalFileName(file.name.split(".").slice(0, -1).join("."));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
    },
  });

  useEffect(() => {
    if (completedCrop && imgRef.current) {
    }
  }, [completedCrop]);

  const onImageLoad = (e) => {
    const { width, height } = e.target;
    setAspectRatio(width / height);
    setImgDimensions({ width, height });
  };

  const handleCropComplete = (crop) => {
    if (crop.width && crop.height) {
      const scaledCrop = {
        ...crop,
        width: crop.width / zoomFactor,
        height: crop.height / zoomFactor,
        unit: "px",
      };
      setCompletedCrop(scaledCrop);
    }
  };

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleZoomChange = (e) => {
    const zoom = e.target.value / 100;
    setZoomFactor(zoom);
  };

  const saveImage = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    if (isExternalImage)
      image.crossOrigin = 'Anonymous';
    image.src = imgRef.current?.src || null;
    if (image.src) {
      image.onload = () => {
        // Set canvas dimensions to match the image dimensions
        canvas.width = imgRef.current.naturalWidth;
        canvas.height = imgRef.current.naturalHeight;

        // Draw the full image onto the canvas
        context.drawImage(image, 0, 0, imgRef.current.naturalWidth, imgRef.current.naturalHeight);

        // Apply any filters (grayscale, contrast, sharpness) before saving
        context.filter = `
          grayscale(${grayscale})
          contrast(${contrast})
          brightness(${sharpness})
        `;

        if (isCropMode && completedCrop && imgRef.current) {
          // Save the cropped image using the same canvas
          saveCroppedImage(canvas, context, image);
        }

        else {
          // Draw the filtered image again with filters applied
          context.drawImage(image, 0, 0);

          const imageUrl = canvas.toDataURL("image/png");
          if (isExternalImage) {
            const file = dataURLtoFile(imageUrl, originalFileName)
            setImage(file);
            return router.push(`/${pageData.username}`);
          }
          const link = document.createElement("a");
          link.href = imageUrl;
          link.download = `${originalFileName}-ImageEditor.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
    }
    else {
      toast.error('No uploaded image', {
        id: 'save-error-toast'
      })
    }
  };

  const saveCroppedImage = (canvas, context, image) => {
    if (completedCrop && imgRef.current) {
      // Set canvas dimensions to match the cropped area
      const cropWidth = completedCrop.width;
      const cropHeight = completedCrop.height;
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      context.filter = `
      grayscale(${grayscale})
      contrast(${contrast})
      brightness(${sharpness})
    `;
      // Draw the cropped portion of the image onto the canvas
      context.drawImage(
        image,
        completedCrop.x * (imgRef.current.naturalWidth / imgRef.current.width),
        completedCrop.y * (imgRef.current.naturalHeight / imgRef.current.height),
        completedCrop.width * (imgRef.current.naturalWidth / imgRef.current.width),
        completedCrop.height * (imgRef.current.naturalHeight / imgRef.current.height),
        0,
        0,
        cropWidth,
        cropHeight
      );

      // Convert the cropped area to a data URL and initiate download
      const croppedImageUrl = canvas.toDataURL("image/png");
      if (isExternalImage) {
        const file = dataURLtoFile(croppedImageUrl, originalFileName)
        setImage(file);
        return router.push(`/${pageData.username}`);
      }
      const link = document.createElement("a");
      link.href = croppedImageUrl;
      link.download = `${originalFileName}-cropped.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearCanvas = () => {
    // Locate the canvas element directly
    setImage(null);;
    // Reset any image-related state or variables
    setGrayscale(0);
    setContrast(0);
    setSharpness(1); // Set to normal brightness
    setIsCropMode(false);
    setCompletedCrop(null);
    setHasUnsavedChanges(false);
  };


  const renderImage = () => {
    const filterStyles = {
      filter: `
        grayscale(${grayscale * 100}%) 
        contrast(${contrast * 100}%)
        brightness(${sharpness})
      `,
    };

    return (
      <div
        className="flex justify-center w-[72vh] items-center"
        style={{
          transform: `scale(${zoomFactor})`,
          position: "relative",
        }}
      >
        {isCropMode ? (
          <ReactCrop
            crop={crop}
            onChange={handleCropChange}
            onComplete={handleCropComplete}
            style={{ width: "100%", height: "100%" }}
          >
            <img
              ref={imgRef}
              src={image}
              alt="Uploaded"
              className="object-contain"
              onLoad={onImageLoad}
              style={{ userSelect: "none", pointerEvents: "auto", ...filterStyles }} // Disable user selection
            />
          </ReactCrop>
        ) : (
          <img
            ref={imgRef}
            src={image}
            alt="Uploaded"
            className="object-contain"
            onLoad={onImageLoad}
            style={{ userSelect: "none", pointerEvents: "auto", ...filterStyles }} // Disable selection
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen m-0 p-0 bg-slate-100">
      {/* Navigation Bar */}
      <div className="flex bg-nft-black-1 px-2 py-4 text-white w-full z-40 justify-between">
        <span className="text-2xl font-extrabold px-3">Digital Canvas</span>
        <span className="text-sm font-thin text-slate-400 self-center">Make adjustments to your artworks here before uploading</span>
      </div>


      <div className="flex-grow flex flex-row">
        {/* Sidebar for Upload, Crop, and Download Buttons */}
        <div className="pt-4 bg-nft-black-1 w-auto sm:w-1/12 text-white flex flex-col items-center text-center text-sm space-y-4 z-40 px-6 gap-y-4">
          <div className="flex flex-col items-center cursor-pointer group gap-y-1" {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center"> {/* Additional wrapper for styling */}
              <UploadCloud width={24} />
              <p className="text-slate-300 text-xs">Upload</p>
            </div>
          </div>


          {/* Crop */}
          <div
            className="flex flex-col items-center cursor-pointer group gap-1"
            onClick={() => {
              setIsCropMode(true);
              setZoomFactor(1);
            }}
          >
            <CropIcon width={24} />
            <p className="text-slate-300 text-xs">Crop</p>
          </div>

          {/* Download */}
          <div
            className="flex flex-col items-center cursor-pointer gap-1 group"
            onClick={saveImage}
          >
            <Download width={24} />
            <p className="text-xs text-slate-300">Download</p>
          </div>
          {/* Clear Canvas */}
          <div
            className="flex flex-col items-center cursor-pointer gap-1 group"
            onClick={clearCanvas}
          >
            <Paintbrush width={24} />
            <p className="text-xs text-slate-300">Clear</p>
          </div>
        </div>


        {/* Main Container for Image and Filters */}
        <div
          className="flex-grow flex flex-col justify-center items-center"
        >
          {/* Render Image */}
          {image && renderImage()}
        </div>
        {/* Sidebar for Filters */}
        <div className="flex flex-col">
          <div className="bg-[#FCE1E0] h-fit rounded-s-md p-4 z-40">
            <h3 className="font-extrabold text-lg text-[#e3002a]">Apply Filters</h3>

            {/* Zoom Slider */}
            <div className="text-slate-700 flex items-center my-4 gap-x-4">
              <div title="Zoom In"><ZoomIn width={24} /></div>
              <input
                title={`${Math.floor(zoomFactor * 100)}%`}
                type="range"
                min="10"
                max="300"
                value={zoomFactor * 100}
                onChange={handleZoomChange}
                disabled={isCropMode}
                className="w-1/2" // Decrease width of slider
              />
              <label>{Math.round(zoomFactor * 100)}%</label>
            </div>

            {/* Grayscale Slider */}
            <div className="flex items-center my-2 text-slate-700 gap-x-2">
              <div title="Grayscale"><NextImage src={grayscaleIco} alt="Grayscale Icon" width={24} height={24} className="mr-2" /></div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={grayscale}
                onChange={(e) => setGrayscale(parseFloat(e.target.value))}
                className="w-1/2" // Decrease width of slider
              />
              <label className="mx-2">{Math.round(grayscale * 100)}%</label>
            </div>

            {/* Sharpness Slider */}
            <div className="flex items-center my-2 text-slate-700 gap-x-2">
            <div title="Sharpness"><NextImage src={sharpnessIco} alt="Sharpness Icon" width={24} height={24} className="mr-2" /></div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={sharpness}
                onChange={(e) => setSharpness(parseFloat(e.target.value))}
                className="w-1/2" // Decrease width of slider
              />
              <label className="mx-2">{sharpness.toFixed(1)}</label>
            </div>

            {/* Contrast Slider */}
            <div className="flex items-center my-2 text-slate-700 gap-x-2">
            <div title="Contrast"><NextImage src={contrastIco} alt="Contrast Icon" width={24} height={24} className="mr-2" /></div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={contrast}
                onChange={(e) => setContrast(parseFloat(e.target.value))}
                className="w-1/2"
              />
              <label className="mx-2">{contrast.toFixed(1)}</label>
            </div>
          </div>

          {/* Separate Buttons Section */}
          {isExternalImage && (
            <div className="flex items-start gap-x-4 mt-8 mx-2 z-50">
              <button
                className="rounded-sm p-2 bg-purple-700 text-slate-100"
                onClick={saveImage}
              >
                Proceed to Post
              </button>
              <button
                className="outline outline-1 outline-slate-600 rounded-sm p-2 bg-slate-200 text-slate-800"
                onClick={() => {
                  setIsExternalImage(true);
                  setHasUnsavedChanges(false);
                  return router.push(`/${pageData.username}`);
                }}
              >
                Discard Changes
              </button>
            </div>
          )}
        </div>

      </div>
      <Toaster />
    </div>
  );
};

export default ImageEditor;
