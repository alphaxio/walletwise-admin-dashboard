"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabType } from "@/lib/types";

interface DynamicTabsProps {
  defaultTab: string;
  className?: string;
  tabs: TabType[];
  onClick: (value: string) => void;
}

const DynamicTabs = ({
  tabs,
  defaultTab,
  className = "spacey-y-6",
  onClick,
}: DynamicTabsProps) => {
  return (
    <div className={`flex w-full flex-col gap-6 `}>
      <Tabs
        defaultValue={defaultTab || tabs[0]?.value}
        className={`${className}`}
      >
        <TabsList className="dark:bg-gray-800">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => onClick(tab?.value)}
              className="cursor-pointer"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <ErrorBoundary>{tab.content}</ErrorBoundary>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DynamicTabs;
