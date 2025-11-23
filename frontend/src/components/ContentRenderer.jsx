import React from 'react';
import SectionItem from './content-items/SectionItem';
import TextItem from './content-items/TextItem';
import ImageItem from './content-items/ImageItem';
import ButtonItem from './content-items/ButtonItem';
import GalleryItem from './content-items/GalleryItem';
import TestimonialsItem from './content-items/TestimonialsItem';
import PricingItem from './content-items/PricingItem';
import FAQItem from './content-items/FAQItem';
import CTABannerItem from './content-items/CTABannerItem';

/**
 * ContentRenderer - Renders configurable content items from Odoo
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of content items from Odoo
 * @param {Object} props.className - Additional CSS classes
 */
export default function ContentRenderer({ items = [], className = '' }) {
  if (!items || items.length === 0) {
    return null;
  }

  const renderItem = (item, index) => {
    const itemProps = {
      key: item.id || index,
      item,
      index,
    };

    // Apply spacing and styling
    const itemStyle = {
      paddingTop: item.spacing_top ? `${item.spacing_top}px` : undefined,
      paddingBottom: item.spacing_bottom ? `${item.spacing_bottom}px` : undefined,
      maxWidth: item.max_width || '1200px',
      backgroundColor: item.background_color || undefined,
      textAlign: item.text_align || 'left',
    };

    const itemClassName = `content-item content-item-${item.item_type} ${item.css_classes || ''} ${className}`.trim();

    // Animation class
    const animationClass = item.animation_type && item.animation_type !== 'none' 
      ? `animate-${item.animation_type}` 
      : '';

    switch (item.item_type) {
      case 'section':
        return (
          <div key={item.id || index} style={itemStyle} className={`${itemClassName} ${animationClass}`}>
            <SectionItem {...itemProps} />
          </div>
        );
      case 'text':
        return (
          <div key={item.id || index} style={itemStyle} className={`${itemClassName} ${animationClass}`}>
            <TextItem {...itemProps} />
          </div>
        );
      case 'image':
        return (
          <div key={item.id || index} style={itemStyle} className={`${itemClassName} ${animationClass}`}>
            <ImageItem {...itemProps} />
          </div>
        );
      case 'button':
        return (
          <div key={item.id || index} style={itemStyle} className={`${itemClassName} ${animationClass}`}>
            <ButtonItem {...itemProps} />
          </div>
        );
      case 'gallery':
        return (
          <div key={item.id || index} style={itemStyle} className={`${itemClassName} ${animationClass}`}>
            <GalleryItem {...itemProps} />
          </div>
        );
      case 'testimonials':
        return (
          <div key={item.id || index} style={itemStyle} className={`${itemClassName} ${animationClass}`}>
            <TestimonialsItem {...itemProps} />
          </div>
        );
      case 'pricing':
        return (
          <div key={item.id || index} style={itemStyle} className={`${itemClassName} ${animationClass}`}>
            <PricingItem {...itemProps} />
          </div>
        );
      case 'faq':
        return (
          <div key={item.id || index} style={itemStyle} className={`${itemClassName} ${animationClass}`}>
            <FAQItem {...itemProps} />
          </div>
        );
      case 'cta_banner':
        return (
          <div key={item.id || index} style={itemStyle} className={`${itemClassName} ${animationClass}`}>
            <CTABannerItem {...itemProps} />
          </div>
        );
      default:
        console.warn(`Unknown content item type: ${item.item_type}`);
        return null;
    }
  };

  return (
    <div className="content-renderer">
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
}
