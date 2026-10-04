import { Badge } from "@/components/ui/badge";

const TypeBadge = ({ type }: { type?: string | null }) => {
  const label = typeof type === "string" && type.trim() ? type.trim() : "N/A";
  const isDebit = label.toLowerCase() === "debit";
  const isCredit = label.toLowerCase() === "credit";

  return (
    <Badge
      variant="outline"
      className={`${
        isDebit
          ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
          : isCredit
          ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
          : "bg-gray-500/10 text-gray-500 border-gray-500/20"
      } flex items-center gap-1.5 px-3 py-1`}
    >
      <span className="capitalize font-medium">{label}</span>
    </Badge>
  );
};

export default TypeBadge;
