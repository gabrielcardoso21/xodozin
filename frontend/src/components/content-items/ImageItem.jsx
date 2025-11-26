import React, { useState, useEffect, useRef } from 'react';

export default function ImageItem({ item }) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);
  
  const imageSrc = item.image_url || 
    (item.image ? `data:image/png;base64,${item.image}` : null);

  useEffect(() => {
    // Intersection Observer for lazy loading
    if (imgRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsLoaded(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px' }
      );
      observer.observe(imgRef.current);
      return () => observer.disconnect();
    } else {
      setIsLoaded(true);
    }
  }, []);

  if (!imageSrc && !imageError) {
    return null;
  }

  return (
    <div className="content-image" role="img" aria-label={item.title || item.name || 'Content image'}>
      {item.title && (
        <h3 className="text-xl font-bold text-[#Da2c38] mb-3 font-serif">
          {item.title}
        </h3>
      )}
      {imageSrc && (
        <img
          ref={imgRef}
          src={isLoaded ? imageSrc : undefined}
          alt={item.title || item.name || 'Content image'}
          className={`w-full h-auto rounded-lg shadow-lg transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onError={() => setImageError(true)}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {item.content && (
        <div 
          className="mt-4 text-[#463f3a]"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}
    </div>
  );
}
