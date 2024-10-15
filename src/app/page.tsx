"use client";

import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/spinner'; 
import Link from 'next/link';
import { regions as initialRegions } from '@/lib/constants';

interface IRegions {
  regionName: string;
  regionCode: string;
}

// Simulate async API request
const fetchRegions = (): Promise<IRegions[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialRegions as IRegions[]);
    }, 1000);
  });
};

const OverviewPage = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Search term input by user
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Debounced version of search term
  const [regions, setRegions] = useState<IRegions[]>([]); // Regions data
  const [loading, setLoading] = useState(true); // Loading state for API call

  // Fetch regions on component mount
  useEffect(() => {
    const getRegions = async () => {
      setLoading(true); // Start loading
      const response = await fetchRegions();
      setRegions(response); // Set regions data
      setLoading(false); // Stop loading after data is fetched
    };
    getRegions();
  }, []);

  // Debounce search input to limit the number of updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(handler); // Cleanup on input change
  }, [searchTerm]);

  // Filter regions based on search input
  const filteredRegions = regions.filter((region) =>
    region.regionName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    region.regionCode.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="grid items-center justify-items-center p-2 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Electricity Prices Overview</h1>

      <div className='w-full flex flex-col items-center mb-4'>
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search regions or region code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          className="flex justify-center w-2/5 mb-4"
        />

        {/* Show spinner while data is loading */}
        {loading ? (
          <div className="flex justify-center items-center w-full h-64">
            <Spinner size="medium" />
          </div>
        ) : (
          <table className="justify-center w-3/5 table-auto">
            <thead>
              <tr>
                <th className="text-left p-2">Region</th>
                <th className="text-left p-2">Region Code</th>
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
                      {/* Link to detailed region page */}
                      <Link href={`/region/${region.regionCode}`}>
                        <Button aria-label={`View details for ${region.regionName}`}>
                          View Details
                        </Button>
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
