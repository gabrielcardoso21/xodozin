import React, { useState, useEffect, useRef } from 'react';

export default function GalleryItem({ item }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());

  useEffect(() => {
    // Close modal on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  if (!item.gallery_image_ids || item.gallery_image_ids.length === 0) {
    return null;
  }

  const handleImageLoad = (imageId) => {
    setLoadedImages((prev) => new Set([...prev, imageId]));
  };

  return (
    <div className="content-gallery" role="region" aria-label={item.title || 'Image gallery'}>
      {item.title && (
        <h3 className="text-2xl font-bold text-[#Da2c38] mb-6 font-serif text-center">
          {item.title}
        </h3>
      )}
      {item.content && (
        <div 
          className="mb-6 text-[#463f3a] text-center"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
        {item.gallery_image_ids.map((image, index) => {
          const imageSrc = image.image_url || 
            (image.image ? `data:image/png;base64,${image.image}` : null);
          
          if (!imageSrc) return null;

          const imageId = image.id || index;
          const isLoaded = loadedImages.has(imageId);

          return (
            <div
              key={imageId}
              role="listitem"
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow focus-within:ring-2 focus-within:ring-[#da2c38] focus-within:outline-none"
              onClick={() => setSelectedImage(imageSrc)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedImage(imageSrc);
                }
              }}
              tabIndex={0}
              aria-label={`View ${image.caption || image.alt_text || `image ${index + 1}`} in full size`}
            >
              <img
                src={isLoaded ? imageSrc : undefined}
                alt={image.alt_text || image.caption || `Gallery image ${index + 1}`}
                className={`w-full h-64 object-cover transition-all duration-300 ${
                  isLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
                }`}
                loading="lazy"
                onLoad={() => handleImageLoad(imageId)}
              />
              {!isLoaded && (
                <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
                  <span className="text-gray-400">Loading...</span>
                </div>
              )}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image modal"
        >
          <div className="max-w-4xl max-h-full relative">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded"
              onClick={() => setSelectedImage(null)}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
