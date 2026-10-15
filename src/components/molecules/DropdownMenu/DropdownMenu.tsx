import DropdownMenuItem from "@/components/atoms/DropdownMenuItem/DropdownMenuItem";

import { menuItems } from "@/lib/constants/dateFilter";
import { FilterOption } from "@/lib/types";

interface DropdownMenuProps {
  isOpen: boolean;
  selectedFilter?: FilterOption;
  onSelect: (filter: FilterOption) => void;
}

const DropdownMenu = ({
  isOpen,
  selectedFilter,
  onSelect,
}: DropdownMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-2">
      {menuItems.map((item) => (
        <DropdownMenuItem
          key={item.value}
          label={item.label}
          isSelected={selectedFilter === item.value}
          onClick={() => onSelect(item.value)}
        />
      ))}
    </div>
  );
};

export default DropdownMenu;
