"use client";

import React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

interface Tab {
  value: string; // Unique value for the tab
  label: string; // Display label for the tab
}

interface CustomTabsProps {
  defaultValue: string; // Default active tab value
  tabs: Tab[]; // Array of tab objects
  children: React.ReactNode; // Content associated with the tabs
}

const CustomTabs: React.FC<CustomTabsProps> = ({ defaultValue, tabs, children }) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full flex flex-col items-center mb-4">
      {/* List of tab triggers */}
      <TabsList className="flex flex-col sm:flex-row justify-center sm:flex-wrap sm:w-auto gap-2 mt-10 sm:mt-0 mb-6 sm:mb-2">
        {tabs.map(({ value, label }) => (
          <TabsTrigger
            key={value} // Key prop for efficient rendering of tab triggers
            value={value} // Value that corresponds to the content of this tab
            className="flex-1 flex flex-col text-center border-b-2 border-transparent transition-colors duration-200"
          >
            {label} {/* Display the label for each tab */}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Container for the tab content */}
      <div className="flex justify-center w-full mt-4">
        {React.Children.map(children, (child) => (
          // Check if the child is a valid React element
          React.isValidElement(child) ? (
            <TabsContent
              value={child.props.value} // Value that matches the corresponding tab trigger
              className="w-full sm:w-4/5 h-[60vh] sm:h-auto px-4" // Responsive styling for content area
            >
              {child} {/* Render the child component inside the content area */}
            </TabsContent>
          ) : null // If the child is not valid, return null
        ))}
      </div>
    </Tabs>
  );
};

export default CustomTabs;
