import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

export default function ButtonItem({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (item.button_action === 'navigate' && item.button_url) {
      if (item.button_url.startsWith('http')) {
        window.open(item.button_url, '_blank');
      } else {
        navigate(item.button_url);
      }
    } else if (item.button_action === 'scroll' && item.button_url) {
      const element = document.querySelector(item.button_url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item.button_action === 'external' && item.button_url) {
      window.open(item.button_url, '_blank');
    }
  };

  if (!item.button_text) {
    return null;
  }

  return (
    <div className="content-button text-center" role="region" aria-label={item.title || 'Call to action'}>
      {item.title && (
        <h3 className="text-2xl font-bold text-[#Da2c38] mb-4 font-serif">
          {item.title}
        </h3>
      )}
      {item.content && (
        <div 
          className="mb-6 text-[#463f3a]"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}
      <Button
        onClick={handleClick}
        className="btn-primary text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#da2c38] focus:ring-offset-2"
        size="lg"
        aria-label={item.button_text}
      >
        {item.button_text}
      </Button>
    </div>
  );
}
