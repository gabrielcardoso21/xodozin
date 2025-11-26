/**
 * API utilities for fetching content from Odoo
 */

const getOdooBaseUrl = () => {
  // Try to get from environment variable first
  if (process.env.REACT_APP_ODOO_URL) {
    return process.env.REACT_APP_ODOO_URL;
  }
  
  // Fallback to current origin (for same-domain setup)
  return window.location.origin.replace(':80', '').replace(':3000', '');
};

/**
 * Fetch page content from Odoo by URL
 * @param {string} url - Page URL (e.g., '/kits', '/sobre')
 * @returns {Promise<Object>} Page data with content items
 */
export const getPageContent = async (url) => {
  try {
    const baseUrl = getOdooBaseUrl();
    const apiUrl = `${baseUrl}/api/website/page${url}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Page not found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
};

/**
 * Fetch all pages
 * @returns {Promise<Array>} Array of page data
 */
export const getAllPages = async () => {
  try {
    const baseUrl = getOdooBaseUrl();
    const apiUrl = `${baseUrl}/api/website/pages`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
};

export default {
  getPageContent,
  getAllPages,
};
