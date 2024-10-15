"use client";

import React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

interface Tab {
  value: string;
  label: string;
}

interface CustomTabsProps {
  defaultValue: string;
  tabs: Tab[];
  children: React.ReactNode;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ defaultValue, tabs, children }) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full flex flex-col items-center mb-4">
      <TabsList className="flex flex-col sm:flex-row justify-center sm:flex-wrap sm:w-auto gap-2 mt-4 sm:mt-0 mb-6 sm:mb-2">
        {tabs.map(({ value, label }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="flex-1 flex flex-col text-center border-b-2 border-transparent transition-colors duration-200"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab Content */}
      <div className="flex justify-center w-full">
        {React.Children.map(children, (child) => (
          React.isValidElement(child) ? (
            <TabsContent
              value={child.props.value}
              className="w-full sm:w-4/5 h-[60vh] sm:h-auto px-4"
            >
              {child}
            </TabsContent>
          ) : null
        ))}
      </div>

    </Tabs>
  );
};

export default CustomTabs;
