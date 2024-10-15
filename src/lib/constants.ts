// Array of regions with their names and codes
export const regions = [
  { regionName: "Austria", regionCode: "AT" },
  { regionName: "Belgium", regionCode: "BE" },
  { regionName: "Switzerland", regionCode: "CH" },
  { regionName: "Czech Republic", regionCode: "CZ" },
  { regionName: "Germany, Luxembourg", regionCode: "DE-LU" },
  { regionName: "Germany, Austria, Luxembourg", regionCode: "DE-AT-LU" },
  { regionName: "Denmark 1", regionCode: "DK1" },
  { regionName: "Denmark 2", regionCode: "DK2" },
  { regionName: "France", regionCode: "FR" },
  { regionName: "Hungary", regionCode: "HU" },
  { regionName: "Italy North", regionCode: "IT-North" },
  { regionName: "Netherlands", regionCode: "NL" },
  { regionName: "Norway 2", regionCode: "NO2" },
  { regionName: "Poland", regionCode: "PL" },
  { regionName: "Sweden 4", regionCode: "SE4" },
  { regionName: "Slovenia", regionCode: "SI" },
];

// Format date from epoch time
export function formatDate(epochTime: number, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(epochTime * 1000); // Convert seconds to milliseconds
  return date.toLocaleDateString(locale, options); // Format the date based on the provided locale and options
}

// Calculate Price Volatility
export const calculateVolatility = (data: number[]): number[] => {
  const volatility = []; // Initialize an array to hold volatility values
  for (let i = 1; i < data.length; i++) {
    const change = Math.abs(data[i] - data[i - 1]) / data[i - 1]; // Calculate the relative change
    volatility.push(change); // Add the change to the volatility array
  }
  return volatility; // Return the array of volatility values
};

// Calculate Daily Low, High, and Average
export const calculateDailyStats = (data: number[]): { dailyLow: number; dailyHigh: number; dailyAverage: number }[] => {
  const dailyStats = []; // Initialize an array to hold daily statistics
  for (let i = 0; i < data.length; i += 24) { // Loop through data in chunks of 24 (assuming hourly data)
    const dailyPrices = data.slice(i, i + 24); // Get prices for the day
    if (dailyPrices.length > 0) {
      const dailyLow = Math.min(...dailyPrices); // Calculate daily low price
      const dailyHigh = Math.max(...dailyPrices); // Calculate daily high price
      const dailyAverage = dailyPrices.reduce((acc, val) => acc + val, 0) / dailyPrices.length; // Calculate daily average price
      dailyStats.push({ dailyLow, dailyHigh, dailyAverage }); // Add the stats to the dailyStats array
    }
  }
  return dailyStats; // Return the array of daily statistics
};
