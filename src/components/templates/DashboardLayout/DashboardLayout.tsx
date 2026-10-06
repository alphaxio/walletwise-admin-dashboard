"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Container from "@/components/atoms/Container/Container";
import Navbar from "@/components/organisms/Navbar/Navbar";
import Sidebar from "@/components/organisms/Sidebar/Sidebar";
import RestrictedEventAdminGuard from "@/components/RestrictedEventAdminGuard";

const DashboardLayout = ({
  children,
  title,
  className = "py-20",
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <RestrictedEventAdminGuard>
      <div className="min-h-screen bg-white dark:bg-gray-900 w-full">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Navbar
          title={title}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="flex">
          <div className="w-24 min-w-24 max-lg:hidden"></div>
          <main
            className={`flex-1 w-full max-w-full overflow-x-auto ${className}`}
          >
            <Container className="xl:px-6"><ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary></Container>
          </main>
        </div>
      </div>
    </RestrictedEventAdminGuard>
  );
};

export default DashboardLayout;
