import React from 'react';

const SliderGallery = ({ unsplashImages }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Slider Gallery</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {unsplashImages.slice(8, 12).map((image) => (
          <div
            key={image.id}
            className="min-w-[200px] relative bg-gray-100 rounded-md overflow-hidden group flex-shrink-0"
          >
            <img
              src={image.urls.small}
              alt={image.alt_description || 'Unsplash Art'}
              className="object-cover w-full h-60 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-white text-center p-2">
                <p className="capitalize">{image.alt_description || 'Untitled Art'}</p>
              </div>
            </div>
            <div className="p-2 bg-white">
              <p className="text-gray-600">Likes: {image.likes}</p>
              <p className="text-gray-600">By: {image.user.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderGallery;
