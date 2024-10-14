// components/CustomTabs.tsx

"use client";

import React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

interface CustomTabsProps {
  defaultValue: string;
  tabs: { value: string; label: string }[];
  children: React.ReactNode;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ defaultValue, tabs, children }) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full flex flex-col items-center mb-4">
      <TabsList className="flex justify-center w-2/5">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="flex-1 text-center">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab Content */}
      <div className="flex justify-center w-full">
        {React.Children.map(children, (child) => {
          return React.isValidElement(child) ? (
            <TabsContent value={child.props.value} className="w-4/5">
              {child}
            </TabsContent>
          ) : null;
        })}
      </div>
    </Tabs>
  );
};

export default CustomTabs;
