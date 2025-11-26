import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setPageSEO, setStructuredData } from '../utils/seo';

/**
 * Hook to manage SEO for pages
 * @param {Object} seoData - SEO data for the page
 */
export const useSEO = (seoData = {}) => {
  const location = useLocation();

  useEffect(() => {
    const defaultSEO = {
      title: 'Xodózin - O xodó que conecta gente de verdade',
      description: 'Rituais personalizados que transformam presentes em momentos de conexão.',
      image: '/logo.png',
      url: location.pathname,
    };

    const finalSEO = { ...defaultSEO, ...seoData };
    
    setPageSEO(finalSEO);
    
    // Set structured data
    setStructuredData({
      type: 'Organization',
      name: 'Xodózin',
      description: finalSEO.description,
      url: window.location.origin,
      logo: `${window.location.origin}${finalSEO.image}`,
    });
  }, [location.pathname, seoData]);
};

export default useSEO;
