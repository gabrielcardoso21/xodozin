import React from 'react';

export default function SectionItem({ item }) {
  return (
    <section 
      className="content-section"
      aria-labelledby={item.title ? `section-title-${item.id}` : undefined}
      role="region"
    >
      {item.title && (
        <h2 
          id={`section-title-${item.id}`}
          className="text-3xl sm:text-4xl font-bold text-[#Da2c38] mb-4 font-serif"
        >
          {item.title}
        </h2>
      )}
      {item.subtitle && (
        <p className="text-lg text-[#463f3a] mb-6" role="doc-subtitle">
          {item.subtitle}
        </p>
      )}
      {item.content && (
        <div 
          className="prose prose-lg max-w-none text-[#463f3a]"
          dangerouslySetInnerHTML={{ __html: item.content }}
          aria-label="Section content"
        />
      )}
    </section>
  );
}
