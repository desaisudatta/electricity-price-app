"use client";
import { useEffect, useState } from 'react';
import { Table } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner"; // Import Spinner
import { Line, Bar } from 'react-chartjs-2';
import CustomTabs from '@/components/ui/customTabs'; // Import the CustomTabs component
import { regions, formatDate, calculateDailyStats, calculateVolatility } from '@/lib/constants';
import { fetchRegionDetails } from '@/lib/api';
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
} from 'chart.js';
import { ChartOptions } from 'chart.js';
import { TabsContent } from '@/components/ui/tabs';
// Register Chart.js components
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function RegionDetailPage({ params }: { params: { regionCode: string } }) {
  const { regionCode } = params;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const regionData = await fetchRegionDetails(regionCode);
        setData(regionData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    getData();
  }, [regionCode]);

  // Conditionally render spinner during loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen"> {/* Full-screen centered spinner */}
        <Spinner size="medium" /> {/* Display Spinner while loading */}
      </div>
    );
  }

  if (error) return <p>Error loading region details: {error}</p>;

  // Calculate Price Volatility
  const volatilityData = calculateVolatility(data?.price);
  const volatilityChartData = {
    labels: data?.unix_seconds?.slice(1).map((date: any) => formatDate(date)), // Adjust labels for volatility
    datasets: [
      {
        label: `Price Volatility (%) in ${regionCode}`,
        data: volatilityData,
        borderColor: 'rgba(255,159,64,1)',
        backgroundColor: 'rgba(255,159,64,0.2)',
        fill: true,
      },
    ],
  };

  // Calculate Daily Low, High, and Average
  const dailyStats = calculateDailyStats(data?.price);

  // Prepare chart data for Daily Low, High, Average
  const dailyLowHighAverageChartData = {
    labels: data?.unix_seconds?.filter((_: any, index: number) => index % 24 === 0).map((date: any) => formatDate(date)), // Extract one label per day
    datasets: [
      {
        label: 'Daily Low (€/MWh)',
        data: dailyStats.map(stat => stat.dailyLow),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Daily High (€/MWh)',
        data: dailyStats.map(stat => stat.dailyHigh),
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,1)',
        fill: false,
      },
      {
        label: 'Daily Average (€/MWh)',
        data: dailyStats.map(stat => stat.dailyAverage),
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,1)',
        fill: false,
      },
    ],
  };
  const options: ChartOptions<'bar' | 'line'> = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
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
          display: true,
          text: 'Price (€/MWh)',
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
    <div className="grid items-center justify-items-center p-2 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold mb-4">Region Details: {regions.filter((region) => region.regionCode === regionCode)[0].regionName}</h1>

      {/* Custom Tabs */}
      <CustomTabs
        defaultValue="currentPrices"
        tabs={[
          { value: 'currentPrices', label: 'Current Prices' },
          { value: 'dailyLowHighAverage', label: 'Daily Low, High, Average' },
          { value: 'priceVolatility', label: 'Price Volatility' },
        ]}
      >
        <TabsContent value="currentPrices">
          {/* Current Prices Table */}
          <Table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-center p-2">Date (MM/DD/YYYY)</th>
                <th className="text-center p-2">Price (€/MWh)</th>
              </tr>
            </thead>
            <tbody>
              {data?.price?.map((priceData: any, index: number) => (
                <tr key={index} className="border-b">
                  <td className="text-center p-2">{formatDate(data?.unix_seconds[index])}</td>
                  <td className="text-center p-2">{priceData}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabsContent>

        <TabsContent value="dailyLowHighAverage">
          {/* Daily Low, High, Average Chart */}
          <div className="w-full h-64">
            <Bar data={dailyLowHighAverageChartData} options={options} />
          </div>
        </TabsContent>

        <TabsContent value="priceVolatility">
          {/* Price Volatility Chart */}
          <div className="w-full h-64">
            <Line data={volatilityChartData} options={options} />
          </div>
        </TabsContent>
      </CustomTabs>

    </div>
  );
}
