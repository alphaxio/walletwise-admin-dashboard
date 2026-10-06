import { services } from "../constants";
import { SelectedValues, SortOption } from "../types";

export function numberWithCommas(x: number) {
  if (x == null || !Number.isFinite(Number(x))) return "N/A";
  const num = Number(x);
  return Number.isInteger(num)
    ? num.toLocaleString()
    : num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}

export const getDisplayText = (
  selectedValues: SelectedValues,
  sortOptions: SortOption[],
  placeholder: string
): string => {
  const selectedEntries = Object.entries(selectedValues).filter(
    ([, value]) => value,
  );

  if (selectedEntries.length === 0) return placeholder;

  return selectedEntries
    .map(([index, value]) => {
      const option = sortOptions[parseInt(index)];
      return `${option.label}: ${value}`;
    })
    .join(", ");
};

export const hasAnySelectedValues = (
  selectedValues: SelectedValues
): boolean => {
  return Object.values(selectedValues).some((value) => value);
};

export const findServiceName = (searchString?: string | null) => {
  if (typeof searchString !== "string" || !searchString.trim()) return "";
  const match = services.find((service) =>
    service.name.toLowerCase().includes(searchString.trim().toLowerCase())
  );

  return match ? match.name : "";
};
