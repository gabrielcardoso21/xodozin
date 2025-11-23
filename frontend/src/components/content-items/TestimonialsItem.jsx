import React from 'react';
import { Star } from 'lucide-react';

export default function TestimonialsItem({ item }) {
  if (!item.testimonial_ids || item.testimonial_ids.length === 0) {
    return null;
  }

  return (
    <div className="content-testimonials">
      {item.title && (
        <h3 className="text-2xl font-bold text-[#Da2c38] mb-6 font-serif text-center">
          {item.title}
        </h3>
      )}
      {item.content && (
        <div 
          className="mb-8 text-[#463f3a] text-center"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {item.testimonial_ids.map((testimonial, index) => {
          const imageSrc = testimonial.image_url || 
            (testimonial.image ? `data:image/png;base64,${testimonial.image}` : null);

          return (
            <div
              key={testimonial.id || index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#da2c38] text-[#da2c38]"
                  />
                ))}
              </div>
              <p className="text-[#463f3a] mb-4 italic leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-[#Da2c38]">{testimonial.name}</p>
                  {testimonial.role && (
                    <p className="text-sm text-[#463f3a]">{testimonial.role}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
