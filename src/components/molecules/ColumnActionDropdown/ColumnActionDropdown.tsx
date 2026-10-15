import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";

interface ColumnActionDropdownProps {
  children: React.ReactNode;
}

const ColumnActionDropdown = ({ children }: ColumnActionDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open row actions" variant="ghost" className="h-8 w-8 p-0 text-right">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-gray-900">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnActionDropdown;
