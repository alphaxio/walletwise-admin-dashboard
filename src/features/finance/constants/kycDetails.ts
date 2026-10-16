import type { DetailField } from '../types';
export const profileFields: DetailField[] = [
  { label: 'Full name', path: 'user.fullName' },
  { label: 'First name', path: 'user.firstName' },
  { label: 'Middle name', path: 'user.middleName' },
  { label: 'Last name', path: 'user.lastName' },
  { label: 'Email', path: 'user.email' },
  { label: 'Phone number', path: 'user.phoneNumber' },
  { label: 'User tag', path: 'user.userTag' },
  { label: 'Date of birth', path: 'user.dob', format: 'date' },
  { label: 'Tier', path: 'user.tier' },
];
export const walletFields: DetailField[] = [
  { label: 'Wallet ID', path: 'id' },
  { label: 'Status', path: 'status', format: 'status' },
  { label: 'Balance', path: 'balance', format: 'usd' },
  { label: 'Miden customer ID', path: 'midenCustomerId' },
  { label: 'Miden wallet ID', path: 'midenWalletId' },
  { label: 'Created', path: 'createdAt', format: 'date' },
  { label: 'Updated', path: 'updatedAt', format: 'date' },
  { label: 'Last continuity fee', path: 'lastContinuityFeeAt', format: 'date' },
];
export const bankFields: DetailField[] = [
  { label: 'Bank name', path: 'bankDetails.bankName' },
  { label: 'Currency', path: 'bankDetails.currency' },
  { label: 'Bank address', path: 'bankDetails.bankAddress' },
  { label: 'Payment rail', path: 'bankDetails.paymentRail' },
  { label: 'Account number', path: 'bankDetails.bankAccountNumber' },
  { label: 'Routing number', path: 'bankDetails.bankRoutingNumber' },
  { label: 'Beneficiary name', path: 'bankDetails.bankBeneficiaryName' },
  { label: 'Beneficiary address', path: 'bankDetails.bankBeneficiaryAddress' },
];
export const securityFields: DetailField[] = [
  { label: 'Threat status', path: 'security.threatStatus', format: 'status' },
  { label: 'Restriction status', path: 'security.restrictionStatus', format: 'status' },
  { label: 'Restriction type', path: 'security.restrictionType' },
  { label: 'Restriction reason', path: 'security.restrictionReason' },
];

