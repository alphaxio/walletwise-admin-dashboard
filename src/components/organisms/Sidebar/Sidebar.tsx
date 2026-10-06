"use client";

import NavLink from "@/components/atoms/NavLink/NavLink";

import { links } from "@/lib/constants";
import { canAccess } from "@/lib/helpers/canAccess";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { hasEventManagementAccess } from "@/features/auth/constants/eventManagementAccess";
import { buildInfo } from "@/lib/buildInfo";
// import { useDisputeNotifications } from "@/lib/hooks/useDisputeNotifications";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isSidebarOpen }: DashboardSidebarProps) => {
  // const { notifications, isConnected } = useDisputeNotifications();
  const { user } = useSelector((state: RootState) => state.auth);

  const userPermissions = user?.permissions || [];

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen min-h-screen w-24 overflow-y-0 bg-[#FAFAFB] dark:bg-gray-800 border-r border-[#EDEDED] dark:border-gray-700 transition-transform duration-300 py-6 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="h-full space-y-8 flex flex-col items-center pt-14">
        <div className="flex-1 h-full overflow-y-auto no-scrollbar space-y-8">
          {links?.map((tab) => {
            const allowedLinks = tab.links.filter(
              (link) =>
                canAccess(userPermissions, link.permissions) ||
                (link.link === "/manage-partner-events" &&
                  hasEventManagementAccess(user)),
            );
            return (
              <div
                className="w-full flex flex-col justify-center items-center"
                key={tab?.title}
              >
                <h6 className="text-xs font-semibold uppercase text-center text-gray-800 dark:text-gray-300">
                  {tab?.title}
                </h6>
                <div className="pt-4 w-full">
                  {allowedLinks?.map((link) => (
                    <NavLink
                      key={link?.name}
                      label={link?.name}
                      icon={link?.icon}
                      link={link?.link}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <a
          href="/api/version"
          target="_blank"
          rel="noreferrer"
          title={`Commit: ${buildInfo.commit}\nBuilt: ${buildInfo.builtAt}`}
          className="shrink-0 text-center text-xs text-gray-500 dark:text-gray-400 hover:underline"
        >
          Build<br />{buildInfo.commit.slice(0, 7)}
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
