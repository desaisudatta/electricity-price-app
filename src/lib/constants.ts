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
    return date.toLocaleDateString(locale, options);
  }


  // Calculate Price Volatility
export const calculateVolatility = (data: number[]): number[] => {
    const volatility = [];
    for (let i = 1; i < data.length; i++) {
      const change = Math.abs(data[i] - data[i - 1]) / data[i - 1];
      volatility.push(change);
    }
    return volatility;
  };
  
  // Calculate Daily Low, High, and Average
  export const calculateDailyStats = (data: number[]): { dailyLow: number; dailyHigh: number; dailyAverage: number }[] => {
    const dailyStats = [];
    for (let i = 0; i < data.length; i += 24) { // Assuming hourly data, 24 hours in a day
      const dailyPrices = data.slice(i, i + 24);
      if (dailyPrices.length > 0) {
        const dailyLow = Math.min(...dailyPrices);
        const dailyHigh = Math.max(...dailyPrices);
        const dailyAverage = dailyPrices.reduce((acc, val) => acc + val, 0) / dailyPrices.length;
        dailyStats.push({ dailyLow, dailyHigh, dailyAverage });
      }
    }
    return dailyStats;
  };