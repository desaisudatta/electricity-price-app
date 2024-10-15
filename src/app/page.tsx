"use client";
import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/spinner'; // Spinner component

import Link from 'next/link';
import { regions as initialRegions } from '@/lib/constants';

// Simulate async API request for regions data
const fetchRegions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialRegions);
    }, 1000); // Simulating 1 second delay
  });
};

const OverviewPage = () => {
  const [searchTerm, setSearchTerm] = useState(''); // User input state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Debounced state
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch regions when component mounts
    const getRegions = async () => {
      setLoading(true); // Start loading
      const response = await fetchRegions(); // Simulate API call
      setRegions(response);
      setLoading(false); // Stop loading when data is fetched
    };

    getRegions();
  }, []);

  // Debouncing search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm); // Update debounced value after delay
    }, 500); // 500ms delay for debounce

    // Cleanup timeout if searchTerm changes before delay finishes
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filter regions based on debouncedSearchTerm
  const filteredRegions = regions.filter((region) =>
    region.regionName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    region.regionCode.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="grid items-center justify-items-center p-2 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold mb-4">Electricity Prices Overview</h1>

      <div className='w-full flex flex-col items-center mb-4'>
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search regions or region code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Updates searchTerm immediately
          className="flex justify-center w-2/5 mb-4"
        />

        {/* Spinner while loading */}
        {loading ? (
          <div className="flex justify-center items-center w-full h-64">
            <Spinner size="lg" /> {/* Spinner placed in the middle of the screen */}
          </div>
        ) : (
          // Regions Table
          <table className="justify-center w-3/5 table-auto">
            <thead>
              <tr>
                <th className="text-left p-2">Region</th>
                <th className="text-left p-2">Region Code (€/MWh)</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegions.length > 0 ? (
                filteredRegions.map((region) => (
                  <tr key={region.regionCode} className="border-b">
                    <td className="p-2">{region.regionName}</td>
                    <td className="p-2">{region.regionCode}</td>
                    <td className="p-2">
                      <Link href={`/region/${region.regionCode}`}>
                        <Button aria-label={`View details for ${region.regionName}`}>View Details</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center p-4">No Regions Found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;
