import Image from 'next/image';
import type { ReactNode } from 'react';
import StatusBubble from '@/components/atoms/StatusBubble/StatusBubble';
import TableDate from '@/components/atoms/TableDate/TableDate';
import DocumentInspector from '@/components/molecules/DocumentInspector/DocumentInspector';
import { display, money, object, read, safeDocumentUrl } from '../helpers/records';
import type { RecordData } from '../types';

type DetailField = { label: string; path: string; format?: 'date' | 'status' | 'usd' };
const profileFields: DetailField[] = [
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
const walletFields: DetailField[] = [
  { label: 'Wallet ID', path: 'id' },
  { label: 'Status', path: 'status', format: 'status' },
  { label: 'Balance', path: 'balance', format: 'usd' },
  { label: 'Miden customer ID', path: 'midenCustomerId' },
  { label: 'Miden wallet ID', path: 'midenWalletId' },
  { label: 'Created', path: 'createdAt', format: 'date' },
  { label: 'Updated', path: 'updatedAt', format: 'date' },
  { label: 'Last continuity fee', path: 'lastContinuityFeeAt', format: 'date' },
];
const bankFields: DetailField[] = [
  { label: 'Bank name', path: 'bankDetails.bankName' },
  { label: 'Currency', path: 'bankDetails.currency' },
  { label: 'Bank address', path: 'bankDetails.bankAddress' },
  { label: 'Payment rail', path: 'bankDetails.paymentRail' },
  { label: 'Account number', path: 'bankDetails.bankAccountNumber' },
  { label: 'Routing number', path: 'bankDetails.bankRoutingNumber' },
  { label: 'Beneficiary name', path: 'bankDetails.bankBeneficiaryName' },
  { label: 'Beneficiary address', path: 'bankDetails.bankBeneficiaryAddress' },
];
const securityFields: DetailField[] = [
  { label: 'Threat status', path: 'security.threatStatus', format: 'status' },
  { label: 'Restriction status', path: 'security.restrictionStatus', format: 'status' },
  { label: 'Restriction type', path: 'security.restrictionType' },
  { label: 'Restriction reason', path: 'security.restrictionReason' },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-3"><h3 className="font-semibold">{title}</h3>{children}</section>;
}
function Fields({ data, fields }: { data: RecordData; fields: DetailField[] }) {
  return <dl className="grid sm:grid-cols-2 gap-4">{fields.map(field => {
    const value = read(data, field.path);
    let content: ReactNode = display(value);
    if (field.format === 'status') content = <StatusBubble status={typeof value === 'string' ? value : undefined} />;
    if (field.format === 'date') content = value ? <TableDate date={String(value)} showWithTime={field.path !== 'user.dob'} /> : '—';
    if (field.format === 'usd') content = money(value, 'USD');
    return <div key={field.path} className="rounded border p-3"><dt className="text-sm text-muted-foreground">{field.label}</dt><dd className="break-words [overflow-wrap:anywhere]">{content}</dd></div>;
  })}</dl>;
}
function OptionalProfile({ title, value }: { title: string; value: unknown }) {
  const entries = Object.entries(object(value));
  return <Section title={title}>{entries.length ? <dl className="grid sm:grid-cols-2 gap-4">{entries.map(([key,item]) => <div key={key} className="rounded border p-3"><dt className="text-sm text-muted-foreground capitalize">{key.replace(/([a-z])([A-Z])/g,'$1 $2').replaceAll('_',' ')}</dt><dd className="break-words">{display(item)}</dd></div>)}</dl> : <p className="text-sm text-muted-foreground">{value == null ? 'Not provided' : display(value)}</p>}</Section>;
}

export default function UsdKycDetails({ data }: { data: RecordData }) {
  const photo = safeDocumentUrl(read(data, 'user.photoUrl'));
  return <div className="space-y-6">
    <Section title="User profile">{photo && <Image unoptimized src={photo} alt="User profile photo" width={80} height={80} className="rounded-full object-cover h-20 w-20" />}<Fields data={data} fields={profileFields} /></Section>
    <Section title="USD wallet"><Fields data={data} fields={walletFields} /></Section>
    <Section title="KYC documents">
      <Fields data={data} fields={[{label:'Submitted',path:'kycDocuments.submittedAt',format:'date'},{label:'BVN / Tax ID',path:'kycDocuments.bvnOrTaxId'}]} />
      <div className="space-y-6 mt-4">{[
        ['Government ID front','kycDocuments.govIdImageFront'],
        ['Government ID back','kycDocuments.govIdImageBack'],
        ['Proof of address','kycDocuments.proofOfAddressDocument'],
      ].map(([label,path]) => <DocumentInspector key={path} label={label} url={read(data,path)} />)}</div>
    </Section>
    <OptionalProfile title="Residential address" value={data.residentialAddress} />
    <OptionalProfile title="Source of funds" value={data.sourceOfFunds} />
    <Section title="Lead Bank virtual account"><Fields data={data} fields={bankFields} /></Section>
    <Section title="Crypto deposit address"><Fields data={data} fields={[{label:'Chain',path:'cryptoAddress.chain'},{label:'Address',path:'cryptoAddress.address'},{label:'Currency',path:'cryptoAddress.currency'}]} /></Section>
    <Section title="Security"><Fields data={data} fields={securityFields} /></Section>
  </div>;
}
