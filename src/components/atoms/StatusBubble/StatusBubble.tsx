const StatusBubble = ({ status }: { status?: string | null }) => {
  const label = typeof status === "string" && status.trim() ? status.trim() : "N/A";
  const statusStyles: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20",
    inactive: "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20",
    in_transit: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
    replied: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
    reversed: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
    unavailable: "text-orange-400 bg-orange-500/10 border border-orange-500/20",
    processing: "text-orange-400 bg-orange-500/10 border border-orange-500/20",
    completed: "text-green-400 bg-green-500/10 border border-green-500/20",
    approved: "text-green-400 bg-green-500/10 border border-green-500/20",
    success: "text-green-400 bg-green-500/10 border border-green-500/20",
    received: "text-green-400 bg-green-500/10 border border-green-500/20",
    verified: "text-green-400 bg-green-500/10 border border-green-500/20",
    credit: "text-green-400 bg-green-500/10 border border-green-500/20",
    resolved: "text-green-400 bg-green-500/10 border border-green-500/20",
    active: "text-green-400 bg-green-500/10 border border-green-500/20",
    declined: "text-red-400 bg-red-500/10 border border-red-500/20",
    unverified: "text-red-400 bg-red-500/10 border border-red-500/20",
    blocked: "text-red-400 bg-red-500/10 border border-red-500/20",
    failed: "text-red-400 bg-red-500/10 border border-red-500/20",
    debit: "text-red-400 bg-red-500/10 border border-red-500/20",
    confirmed: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
    "Personalized account":
      "text-green-400 bg-green-500/10 border border-green-500/20",
    "Virtual account": "text-blue-400 bg-blue-500/10 border border-blue-500/20",
  };

  return (
    <div
      className={`rounded-full px-3 py-1 text-center w-fit min-w-32 whitespace-nowrap text-sm ${
        statusStyles[label.toLowerCase()] ||
        "text-gray-400 bg-gray-500/10 border border-gray-500/20"
      }`}
    >
      {label}
    </div>
  );
};

export default StatusBubble;
