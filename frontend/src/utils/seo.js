/**
 * SEO Utilities
 * Functions to manage meta tags and SEO
 */

export const updateMetaTag = (name, content, attribute = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

export const updateTitle = (title) => {
  document.title = title;
};

export const updateOGTag = (property, content) => {
  updateMetaTag(property, content, 'property');
};

export const setPageSEO = (data) => {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
  } = data;

  // Title
  if (title) {
    updateTitle(title);
    updateOGTag('og:title', title);
    updateMetaTag('twitter:title', title);
  }

  // Description
  if (description) {
    updateMetaTag('description', description);
    updateOGTag('og:description', description);
    updateMetaTag('twitter:description', description);
  }

  // Image
  if (image) {
    const imageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;
    updateOGTag('og:image', imageUrl);
    updateMetaTag('twitter:image', imageUrl);
  }

  // URL
  if (url) {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    updateOGTag('og:url', fullUrl);
  }

  // Type
  updateOGTag('og:type', type);

  // Site name
  updateOGTag('og:site_name', 'Xodózin');
};

export const setStructuredData = (data) => {
  const {
    type = 'Organization',
    name = 'Xodózin',
    description,
    url,
    logo,
  } = data;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    ...(description && { description }),
    ...(url && { url }),
    ...(logo && { logo }),
  };

  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
};
