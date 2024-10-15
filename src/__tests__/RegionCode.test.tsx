import { render, screen, waitFor } from '@testing-library/react';
import RegionDetailPage from '@/app/region/[regionCode]/page'; // Adjust the import path if needed
import { fetchRegionDetails } from '@/lib/api'; // Mock this function
import { Spinner } from '@/components/ui/spinner'; // Import Spinner component

jest.mock('@/lib/api', () => ({
  fetchRegionDetails: jest.fn(),
}));

jest.mock('@/lib/constants', () => ({
    regions: [{ regionCode: 'test-region', regionName: 'Test Region' }],
    // ...other constants
  }));
  

const mockRegionData = {
  unix_seconds: [1633564800, 1633651200], // Example timestamps
  price: [50, 55], // Example prices
};

const mockParams = { regionCode: 'test-region' };

describe('RegionDetailPage', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('renders loading spinner while fetching data', () => {
    (fetchRegionDetails as jest.Mock).mockImplementation(() => new Promise(() => {})); // Simulate a pending promise

    render(<RegionDetailPage params={mockParams} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument(); // Change this if you have specific loading text
    expect(screen.getByRole('progressbar')).toBeInTheDocument(); // Check for the spinner component
  });

  it('displays data when fetch is successful', async () => {
    (fetchRegionDetails as jest.Mock).mockResolvedValueOnce(mockRegionData); // Mock successful API response

    render(<RegionDetailPage params={mockParams} />);

    // Wait for the data to be rendered
    await waitFor(() => {
      expect(screen.getByText(/Region Details: Test Region/i)).toBeInTheDocument();
      expect(screen.getByText(/Date \(MM\/DD\/YYYY\)/i)).toBeInTheDocument(); // Check if table header exists
      expect(screen.getByText(/50/i)).toBeInTheDocument(); // Check if price is rendered
    }, { timeout: 3000 });
  });

  it('displays error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch region data';
    (fetchRegionDetails as jest.Mock).mockRejectedValueOnce(new Error(errorMessage)); // Mock API failure

    render(<RegionDetailPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch region data/i)).toBeInTheDocument(); // Check error message
      expect(screen.getByRole('link', { name: /go to overview/i })).toBeInTheDocument(); // Check if the button is rendered
    },{ timeout: 3000 });
  });

  it('renders chart data correctly', async () => {
    (fetchRegionDetails as jest.Mock).mockResolvedValueOnce(mockRegionData); // Mock successful API response

    render(<RegionDetailPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText(/current prices/i)).toBeInTheDocument(); // Check if chart tab is rendered
      expect(screen.getByRole('button', { name: /Current Prices Chart/i })).toBeInTheDocument(); // Check if chart button is rendered
    }, { timeout: 3000 });
  });

});
