"use client";
import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input"; // Import input component from Shadcn
import { Button } from "@/components/ui/button"; // Import button component from Shadcn
import Link from 'next/link';
import { regions } from '@/lib/constants'; // Import your regions data

const OverviewPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegions, setFilteredRegions] = useState(regions);

  useEffect(() => {
    // Filter regions based on the search term
    setFilteredRegions(
      regions.filter((region) => 
        region.regionName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Electricity Prices Overview</h1>

      {/* Search Input */}
      <Input 
        type="text" 
        placeholder="Search regions..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="mb-4"
      />

      {/* Regions Table */}
      <table className="w-full table-auto">
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
                    <Button>View Details</Button>
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
    </div>
  );
};

export default OverviewPage;
