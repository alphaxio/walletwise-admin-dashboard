import { Badge } from "@/components/ui/badge";

const CategoryBadge = ({
  category,
  assetId,
}: {
  category: string;
  assetId: string;
}) => {
  return (
    <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1">
      <span className="capitalize">
        {category}
        {assetId ? ` (${assetId.toUpperCase()})` : ""}
      </span>
    </Badge>
  );
};

export default CategoryBadge;
