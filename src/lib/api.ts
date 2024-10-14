// lib/api.js

/**
 * Fetches detailed electricity price data for a specific region.
 *
 * @param {string} regionCode - The code for the region to fetch data for.
 * @returns {Promise<object>} - A promise that resolves to the region data.
 * @throws {Error} - Throws an error if the fetch fails or if the response is not OK.
 */
export const fetchRegionDetails = async (regionCode: string) => {
    const baseUrl = 'https://api.energy-charts.info/price'; // Replace with your actual API base URL
  
    try {
      const response = await fetch(`${baseUrl}?bzn=${regionCode}`);
  
      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error(`Error fetching region details: ${response.statusText}`);
      }
  
      const data = await response.json();
      
      // You can structure the data according to your needs
      return {
        price: data.price,  // Assuming the API returns prices as an array
        unix_seconds: data.unix_seconds, // Assuming the API returns timestamps in an array
      };
    } catch (error) {
      console.error('Failed to fetch region details:', error);
      throw error; // Rethrow the error to handle it in the component
    }
  };
  