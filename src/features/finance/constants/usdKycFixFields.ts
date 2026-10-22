// Items an admin can ask a user to fix when declining USD KYC. Keys must match
// walletwise-dashboard-api/utils/usdKycFields.js (the mobile app reads them).
export const usdKycFixFields = [
  { field: 'govIdImageFront', label: 'Front of ID' },
  { field: 'govIdImageBack', label: 'Back of ID' },
  { field: 'proofOfAddressDocument', label: 'Proof of address' },
  { field: 'address', label: 'Home address' },
  { field: 'taxIdentificationNumber', label: 'BVN or NIN' },
  { field: 'sofEuQuestionnaire', label: 'Source of funds answers' },
  { field: 'middleName', label: 'Middle name' },
  { field: 'dateOfBirth', label: 'Date of birth (contact support)' },
  { field: 'general', label: 'Cannot be fixed in the app (contact support)' },
] as const;
export type UsdKycFixField = (typeof usdKycFixFields)[number]['field'];
export const usdKycFixLabels = Object.fromEntries(usdKycFixFields.map(({ field, label }) => [field, label])) as Record<string, string>;
