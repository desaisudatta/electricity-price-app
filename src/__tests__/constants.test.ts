import { regions, formatDate, calculateVolatility, calculateDailyStats  } from "@/lib/constants";


describe('formatDate', () => {
  test('should format epoch time correctly', () => {
    const epochTime = 1633036800; // Example epoch time (October 1, 2021)
    const formattedDate = formatDate(epochTime);
    expect(formattedDate).toBe('10/1/2021'); // Expecting 'MM/DD/YYYY' format by default
  });
});

describe('calculateVolatility', () => {

  test('should return an empty array for a single data point', () => {
    const data = [100];
    expect(calculateVolatility(data)).toEqual([]);
  });

  test('should return an empty array for empty input', () => {
    const data: number[] = [];
    expect(calculateVolatility(data)).toEqual([]);
  });

  test('should handle data with zero values', () => {
    const data = [0, 100, 200];
    const expectedVolatility = [Infinity, 1]; // Change from 0 to 100 is infinite
    expect(calculateVolatility(data)).toEqual(expectedVolatility);
  });

});

describe('calculateDailyStats', () => {  
    test('should return empty array for empty input', () => {
      const data: number[] = [];
      expect(calculateDailyStats(data)).toEqual([]);
    });
  
    test('should return one stat for data length less than 24', () => {
      const data = [100, 110, 120, 130];
      const expectedStats = [{ dailyLow: 100, dailyHigh: 130, dailyAverage: 115 }];
      expect(calculateDailyStats(data)).toEqual(expectedStats);
    });
  
    test('should handle data with exactly 24 points', () => {
      const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240];
      const expectedStats = [{ dailyLow: 10, dailyHigh: 240, dailyAverage: 125 }];
      expect(calculateDailyStats(data)).toEqual(expectedStats);
    });
  
    test('should return correct stats for consecutive identical values', () => {
      const data = Array(24).fill(100); // 24 identical values
      const expectedStats = [{ dailyLow: 100, dailyHigh: 100, dailyAverage: 100 }];
      expect(calculateDailyStats(data)).toEqual(expectedStats);
    });
  });