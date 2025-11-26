import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTABannerItem({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (item.button_url) {
      if (item.button_url.startsWith('http')) {
        window.open(item.button_url, '_blank');
      } else {
        navigate(item.button_url);
      }
    }
  };

  return (
    <div 
      className="content-cta-banner bg-gradient-to-br from-[#da2c38] to-[#c02530] rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl"
      role="banner"
      aria-label={item.title || 'Call to action banner'}
    >
      {item.title && (
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-serif">
          {item.title}
        </h2>
      )}
      {item.subtitle && (
        <p className="text-lg sm:text-xl mb-6 opacity-90" role="doc-subtitle">
          {item.subtitle}
        </p>
      )}
      {item.content && (
        <div 
          className="mb-8 text-lg opacity-90 max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}
      {item.button_text && (
        <Button
          onClick={handleClick}
          className="bg-white text-[#da2c38] hover:bg-gray-100 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#da2c38]"
          size="lg"
          aria-label={item.button_text}
        >
          {item.button_text}
          <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
