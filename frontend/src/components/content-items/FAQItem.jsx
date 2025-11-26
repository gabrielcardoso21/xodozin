import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

export default function FAQItem({ item }) {
  if (!item.faq_item_ids || item.faq_item_ids.length === 0) {
    return null;
  }

  return (
    <div className="content-faq" role="region" aria-label={item.title || 'Frequently asked questions'}>
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
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full" role="list">
          {item.faq_item_ids.map((faq, index) => (
            <AccordionItem
              key={faq.id || index}
              value={`faq-${faq.id || index}`}
              className="border-b border-[#da2c38]/20"
              role="listitem"
            >
              <AccordionTrigger 
                className="text-left text-[#Da2c38] font-semibold hover:text-[#da2c38] focus:outline-none focus:ring-2 focus:ring-[#da2c38] focus:ring-offset-2 rounded"
                aria-expanded="false"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#463f3a] pt-4">
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
