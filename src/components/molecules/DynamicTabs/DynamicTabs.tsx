"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import TableLoader from "@/components/atoms/skeleton/TableLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabType } from "@/lib/types";

interface DynamicTabsProps {
  defaultTab: string;
  className?: string;
  tabs: TabType[];
  onClick: (value: string) => void;
  urlKey?: string;
}

function PersistentTabs({ tabs, defaultTab, className = "space-y-6", onClick, urlKey = "tab" }: DynamicTabsProps) {
  const search = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const requested = search.get(urlKey);
  const hasRequested = tabs.some(tab => tab.value === requested);
  const fallback = tabs.some(tab => tab.value === defaultTab) ? defaultTab : tabs[0]?.value;
  const active = hasRequested ? requested! : fallback;

  useEffect(() => {
    if (!hasRequested && active) {
      const params = new URLSearchParams(search.toString());
      params.set(urlKey, active);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [active, hasRequested, pathname, router, search, urlKey]);

  const previousActive = useRef(active);
  const callback = useRef(onClick);
  callback.current = onClick;
  useEffect(() => {
    if (previousActive.current !== active || !hasRequested) {
      previousActive.current = active;
      callback.current(active);
    }
  }, [active, hasRequested]);

  function changeTab(value: string) {
    const params = new URLSearchParams(search.toString());
    params.set(urlKey, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return <div className="flex w-full flex-col gap-6">
    <Tabs value={active} onValueChange={changeTab} className={className}>
      <TabsList className="dark:bg-gray-800 max-w-full overflow-x-auto justify-start">
        {tabs.map(tab => <TabsTrigger key={tab.value} value={tab.value} className="cursor-pointer">{tab.label}</TabsTrigger>)}
      </TabsList>
      {tabs.map(tab => <TabsContent key={tab.value} value={tab.value}><ErrorBoundary>{tab.content}</ErrorBoundary></TabsContent>)}
    </Tabs>
  </div>;
}

export default function DynamicTabs(props: DynamicTabsProps) {
  return <Suspense fallback={<TableLoader />}><PersistentTabs {...props} /></Suspense>;
}
