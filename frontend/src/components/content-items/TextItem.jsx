import React from 'react';

export default function TextItem({ item }) {
  return (
    <div className="content-text">
      {item.title && (
        <h3 className="text-2xl font-bold text-[#Da2c38] mb-3 font-serif">
          {item.title}
        </h3>
      )}
      {item.content && (
        <div 
          className="text-[#463f3a] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}
    </div>
  );
}
