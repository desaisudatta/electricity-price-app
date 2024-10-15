"use client";
import { useEffect, useState } from 'react';
import { Table } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner"; // Import Spinner for loading state
import { Line, Bar } from 'react-chartjs-2'; // Import Line and Bar chart components
import CustomTabs from '@/components/ui/customTabs'; // Import the CustomTabs component
import { regions, formatDate, calculateDailyStats, calculateVolatility } from '@/lib/constants'; // Import utility functions
import { fetchRegionDetails } from '@/lib/api'; // Import API function to fetch region details
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; // Import Chart.js components
import { ChartOptions } from 'chart.js'; // Import Chart.js options type
import { TabsContent } from '@/components/ui/tabs'; // Import TabsContent for tab functionality
import Link from 'next/link'; // Import Link for navigation
import { Button } from '@/components/ui/button'; // Import Button component

// Register Chart.js components to be used in the charts
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function RegionDetailPage({ params }: { params: { regionCode: string } }) {
  const { regionCode } = params; // Extract regionCode from params
  const [data, setData] = useState<any>(null); // State to hold fetched region data
  const [loading, setLoading] = useState(true); // Loading state to control spinner visibility
  const [error, setError] = useState<string | null>(null); // State to hold any error message

  useEffect(() => {
    const getData = async () => {
      try {
        const regionData = await fetchRegionDetails(regionCode); // Fetch data for the specific region
        setData(regionData); // Update state with the fetched data
      } catch (error: any) {
        setError(error.message); // Set error message if fetching fails
      } finally {
        setLoading(false); // Stop loading after data fetch attempt
      }
    };

    getData(); // Call the async function to fetch data
  }, [regionCode]); // Dependency array to refetch data if regionCode changes

  // Conditionally render spinner during loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen"> {/* Full-screen centered spinner */}
        <Spinner size="medium" /> {/* Display Spinner while loading */}
      </div>
    );
  }

  // Centering the error message
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen"> {/* Full-screen centered error message */}
        <p className="text-red-500 text-lg text-center mb-4">{error}</p> {/* Error message */}
        <Link href={'/'}> {/* Link to go back to overview */}
          <Button aria-label={`Go To Overview`}>Go To Overview</Button>
        </Link>
      </div>
    );
  }

  // Prepare chart data for Current Prices
  const currentPricesChartData = {
    labels: data?.unix_seconds?.map((date: any) => formatDate(date)), // Format dates for the x-axis
    datasets: [
      {
        label: 'Current Prices (€/MWh)', // Label for the dataset
        data: data?.price, // Data points for the current prices
        borderColor: 'rgba(54,162,235,1)', // Line color for the chart
        backgroundColor: 'rgba(54,162,235,0.2)', // Background color for the chart area
        fill: true, // Fill under the line
      },
    ],
  };

  // Calculate Price Volatility
  const volatilityData = calculateVolatility(data?.price); // Calculate volatility based on price data
  const volatilityChartData = {
    labels: data?.unix_seconds?.slice(1).map((date: any) => formatDate(date)), // Adjust labels for volatility
    datasets: [
      {
        label: `Price Volatility (%) in ${regionCode}`, // Label for the volatility dataset
        data: volatilityData, // Data points for volatility
        borderColor: 'rgba(255,159,64,1)', // Line color for the volatility chart
        backgroundColor: 'rgba(255,159,64,0.2)', // Background color for the chart area
        fill: true, // Fill under the line
      },
    ],
  };

  // Calculate Daily Low, High, and Average
  const dailyStats = calculateDailyStats(data?.price); // Calculate daily statistics

  // Prepare chart data for Daily Low, High, Average
  const dailyLowHighAverageChartData = {
    labels: data?.unix_seconds?.filter((_: any, index: number) => index % 24 === 0).map((date: any) => formatDate(date)), // Extract one label per day
    datasets: [
      {
        label: 'Daily Low (€/MWh)', // Label for daily low prices
        data: dailyStats.map(stat => stat.dailyLow), // Data points for daily low prices
        borderColor: 'rgba(75,192,192,1)', // Line color for daily low
        backgroundColor: 'rgba(75,192,192,1)', // Background color for daily low
        fill: false, // Do not fill under the line
      },
      {
        label: 'Daily High (€/MWh)', // Label for daily high prices
        data: dailyStats.map(stat => stat.dailyHigh), // Data points for daily high prices
        borderColor: 'rgba(255,99,132,1)', // Line color for daily high
        backgroundColor: 'rgba(255,99,132,1)', // Background color for daily high
        fill: false, // Do not fill under the line
      },
      {
        label: 'Daily Average (€/MWh)', // Label for daily average prices
        data: dailyStats.map(stat => stat.dailyAverage), // Data points for daily average prices
        borderColor: 'rgba(153,102,255,1)', // Line color for daily average
        backgroundColor: 'rgba(153,102,255,1)', // Background color for daily average
        fill: false, // Do not fill under the line
      },
    ],
  };

  // Chart options for styling
  const options: ChartOptions<'bar' | 'line'> = {
    scales: {
      x: {
        title: {
          display: true, // Display the x-axis title
          text: 'Date', // Title text
          font: {
            size: 16, // Font size for the axis title
            weight: 'bold', // Bold axis title
          },
        },
        ticks: {
          font: {
            size: 14, // Font size for the labels
          },
        },
      },
      y: {
        title: {
          display: true, // Display the y-axis title
          text: 'Price (€/MWh)', // Title text
          font: {
            size: 16, // Font size for the axis title
            weight: 'bold', // Bold axis title
          },
        },
        ticks: {
          font: {
            size: 14, // Font size for the labels
          },
        },
      },
    },
  };

  return (
    <div className="grid items-center justify-items-center p-4 sm:p-8 lg:p-12 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Region Details: {regions.filter((region) => region.regionCode === regionCode)[0].regionName} {/* Display region name */}
      </h1>

      {/* Custom Tabs for different views */}
      <CustomTabs
        defaultValue="currentPrices" // Default tab to display
        tabs={[
          { value: 'currentPrices', label: 'Current Prices' },
          { value: 'currentPricesChart', label: 'Current Prices Chart' },
          { value: 'dailyLowHighAverage', label: 'Daily Low, High, Average' },
          { value: 'priceVolatility', label: 'Price Volatility' },
        ]}
      >
        <TabsContent value="currentPrices">
          {/* Current Prices Table */}
          <Table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-center p-2">Date (MM/DD/YYYY)</th> {/* Table header for date */}
                <th className="text-center p-2">Price (€/MWh)</th> {/* Table header for price */}
              </tr>
            </thead>
            <tbody>
              {data?.price?.map((priceData: any, index: number) => (
                <tr key={index} className="border-b"> {/* Table row for each price data */}
                  <td className="text-center p-2">{formatDate(data?.unix_seconds[index])}</td> {/* Formatted date */}
                  <td className="text-center p-2">{priceData}</td> {/* Price data */}
                </tr>
              ))}
            </tbody>
          </Table>
        </TabsContent>

        <TabsContent value="currentPricesChart">
          {/* Current Prices Chart */}
          <div className="w-full">
            <Line data={currentPricesChartData} options={options} /> {/* Line chart for current prices */}
          </div>
        </TabsContent>

        <TabsContent value="dailyLowHighAverage">
          {/* Daily Low, High, Average Chart */}
          <div className="w-full">
            <Bar data={dailyLowHighAverageChartData} options={options} /> {/* Bar chart for daily low, high, average */}
          </div>
        </TabsContent>

        <TabsContent value="priceVolatility">
          {/* Price Volatility Chart */}
          <div className="w-full">
            <Line data={volatilityChartData} options={options} /> {/* Line chart for price volatility */}
          </div>
        </TabsContent>
      </CustomTabs>
    </div>
  );
}
