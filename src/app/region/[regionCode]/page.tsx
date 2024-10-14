"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'; // import shadcn tabs
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// Fetch region data by regionCode
const fetchRegionDetails = async (regionCode: string) => {
  const res = await fetch(`https://api.energy-charts.info/price?bzn=${regionCode}`);
  if (!res.ok) throw new Error('Failed to fetch region details');
  return res.json();
};

function formatDate(epochTime: number, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(epochTime * 1000); // Convert seconds to milliseconds
  return date.toLocaleDateString(locale, options);
}

export default function RegionDetailPage({ params }: { params: { regionCode: string } }) {
  const { regionCode } = params;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data using useEffect
  useEffect(() => {
    const getData = async () => {
      try {
        const regionData = await fetchRegionDetails(regionCode);
        setData(regionData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [regionCode]);

  if (loading) return <p>Loading region details...</p>;
  if (error) return <p>Error loading region details: {error}</p>;

  // Prepare chart data
  const chartData = {
    labels: data?.unix_seconds?.map((date: any) => formatDate(date)),
    datasets: [
      {
        label: `Price (€/MWh) in ${regionCode}`,
        data: data?.price?.map((priceData: any) => priceData),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Price (€/MWh)' } },
    },
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Region Details: {regionCode}</h1>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="chart">Price Chart</TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="details">
          {/* Table for region details */}
          <Table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Price (€/MWh)</th>
              </tr>
            </thead>
            <tbody>
              {data?.price?.map((priceData: any, index: number) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{formatDate(data?.unix_seconds[index])}</td>
                  <td className="p-2">{priceData}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabsContent>

        <TabsContent value="chart">
          {/* Line chart for region prices */}
          <div className="w-full h-64">
            <Line data={chartData} options={options} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Go Back Button */}
      <Link href={`/`}>
        <Button className="mt-4">Go Back</Button>
      </Link>
    </div>
  );
}
