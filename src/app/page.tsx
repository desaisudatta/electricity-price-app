"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import Link from "next/link";

const regions = [
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

export default function Overview() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter regions based on search term for regionName and regionCode
  const filteredRegions = regions.filter((region) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      region.regionName.toLowerCase().includes(lowerCaseSearchTerm) ||
      region.regionCode.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <div className="grid items-center justify-items-center p-2 sm:p-8 font-[family-name:var(--font-geist-sans)]">
       {/* Search Bar */}
       <div className="mb-4">
          <Input
            placeholder="Search by region name or code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md"
          />
        </div>
      <div className='flex flex-col gap-2 items-center sm:items-start'>
        {/* Table */}
        {filteredRegions.length > 0 ? (
          <Table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left p-2">Region Name</th>
                <th className="text-left p-2">Region Code</th>
                <th className="text-left p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegions.map((region) => (
                <tr key={region.regionCode} className="border-b">
                  <td className="p-2">{region.regionName}</td>
                  <td className="p-2">{region.regionCode}</td>
                  <td className="p-2">
                    <Link href={`/region/${region.regionCode}`}>
                      <Button>View Details</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-red-500 mt-4">No Regions Found</p> // Display this when no results
        )}
      </div>
    </div>
  );
}
