import { formatDate } from "@/lib/helpers/dateFormats";
import { Activity, ChevronDown, ChevronUp } from "lucide-react";
import { getActivityTypeColor } from "../../helpers";

interface AdminActivityLogProps {
  expandedSection: string | null;
  toggleSection: (value: string) => void;
  logs: {
    activity_type: string;
    activity_description: string;
    timestamp: string;
    id: string;
  }[];
}

const AdminActivityLog = ({
  logs,
  toggleSection,
  expandedSection,
}: AdminActivityLogProps) => {
  return (
    <div className="dark:bg-gray-900 border dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <button
        onClick={() => toggleSection("logs")}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-800/10 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold dark:text-white text-gray-800">
            Activity Logs
          </h3>
          <span className="text-sm ardk:text-gray-400 text-gray-600">
            ({logs?.length} activities)
          </span>
        </div>
        {expandedSection === "logs" ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expandedSection === "logs" && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="dark:bg-gray-800/50 bg-gray-800/5 rounded-xl p-4 border border-gray-700/5 dark:border-gray-700/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Activity Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800 divide-gray-200">
              {logs?.map((log) => (
                <tr
                  key={log.id}
                  className="dark:hover:bg-gray-800/30 hover:bg-gray-800/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${getActivityTypeColor(
                        log.activity_type
                      )}`}
                    >
                      {log.activity_type?.replace(/_/g, " ") || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 dark:text-gray-300 text-gray-700">
                    {log.activity_description}
                  </td>
                  <td className="px-6 py-4 dark:text-gray-400 text-gray-600 text-sm whitespace-nowrap">
                    {formatDate(log.timestamp)}
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

export default AdminActivityLog;
