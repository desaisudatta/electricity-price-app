import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OverviewPage from '@/app/page';
import { regions as mockRegions } from '@/lib/constants'; // Import mock regions

// Mock the Spinner component
jest.mock('@/components/ui/spinner', () => ({
  Spinner: () => <div>Loading...</div>,
}));

// Mock the Link component from Next.js
jest.mock('next/link', () => {
    return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});

// Mock the API request function
jest.mock('@/lib/constants', () => ({
  regions: [
    { regionName: 'Region 1', regionCode: 'R1' },
    { regionName: 'Region 2', regionCode: 'R2' },
    { regionName: 'Region 3', regionCode: 'R3' },
  ],
}));

describe('OverviewPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', () => {
    render(<OverviewPage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders region table after loading', async () => {
    render(<OverviewPage />);

    // Wait for the loading spinner to be removed
    await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument(), { timeout: 3000 });

    // Check if regions are rendered in the table
    expect(screen.getByText('Region 1')).toBeInTheDocument();
    expect(screen.getByText('Region 2')).toBeInTheDocument();
    expect(screen.getByText('Region 3')).toBeInTheDocument();
  });

  test('filters regions based on search input', async () => {
    render(<OverviewPage />);

    // Wait for the loading spinner to be removed
    await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument(), { timeout: 3000 });

    // Type in the search input
    fireEvent.change(screen.getByPlaceholderText(/Search regions or region code.../i), {
      target: { value: 'Region 1' },
    });

    // Check that only Region 1 is displayed
    expect(screen.getByText('Region 1')).toBeInTheDocument();
  });

  test('renders View Details button for each region', async () => {
    render(<OverviewPage />);

    // Wait for the loading spinner to be removed
    await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument(), { timeout: 3000 });

    // Check that each region has a View Details button
    const buttons = screen.getAllByText(/View Details/i);
    expect(buttons.length).toBe(3); // Should match the number of mock regions
  });
});
