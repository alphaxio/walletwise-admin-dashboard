import { useState } from "react";

import { Activity } from "lucide-react";

import { UserLogType } from "../../types";
import { formatDate } from "@/lib/helpers/dateFormats";

import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";

const UserLogsSection = ({ userLogs }: { userLogs: UserLogType[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getActivityTypeColor = (type: string) => {
    if (type.includes("suspended"))
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    if (type.includes("unsuspended"))
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <SectionHeader
        icon={Activity}
        title="Activity Logs"
        subtitle={`${userLogs?.length} log${userLogs?.length !== 1 ? "s" : ""}`}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Action Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Admin
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {userLogs?.map((log) => (
                <tr
                  key={log?.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap  ${getActivityTypeColor(
                        log?.action_type
                      )}`}
                    >
                      {log?.action_type?.replace(/_/g, " ") || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {log?.details}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {log?.admin_first_name} {log?.admin_last_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {log?.admin_email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm whitespace-nowrapgit">
                    {formatDate(log?.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserLogsSection;
