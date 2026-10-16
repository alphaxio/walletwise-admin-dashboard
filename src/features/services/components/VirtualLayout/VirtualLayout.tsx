import React from "react";

import { TabType } from "@/lib/types";
import DynamicTabs from "@/components/molecules/DynamicTabs/DynamicTabs";

const VirtualLayout = ({
  tabs,
  title,
  defaultTab,
  onClick,
}: {
  tabs: TabType[];
  title: string;
  defaultTab: string;
  onClick: (value: string) => void;
}) => {
  return (
    <div>
      <div className="py-6">
        <h2 className="sm:text-xl text-lg font-semibold dark:text-gray-300 capitalize">
          {title}
        </h2>
      </div>
      <DynamicTabs urlKey="virtualTab" tabs={tabs} defaultTab={defaultTab} onClick={onClick} />
    </div>
  );
};

export default VirtualLayout;
