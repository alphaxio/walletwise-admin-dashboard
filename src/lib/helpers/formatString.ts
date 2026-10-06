export function formatString(str?: string | null) {
  return typeof str === "string" ? str.replace(/_/g, " ") : "N/A";
}
