import { ChevronDown, ChevronUp } from "lucide-react";

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  isExpanded,
  onToggle,
}: SectionHeaderProps) => {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {onToggle !== undefined && (
        <div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      )}
    </>
  );

  if (onToggle) {
    return (
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-t-2xl"
      >
        {content}
      </button>
    );
  }

  return <div className="flex items-center justify-between p-6">{content}</div>;
};

export default SectionHeader;
