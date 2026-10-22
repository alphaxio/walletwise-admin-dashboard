import Image from 'next/image';
import DocumentInspector from '@/components/molecules/DocumentInspector/DocumentInspector';
import { read,safeDocumentUrl } from '../../helpers/records';
import type { RecordData } from '../../types/index';
import { profileFields,walletFields,bankFields,securityFields } from '../../constants/kycDetails';
import FinancialDetailSection from '../FinancialDetailSection/FinancialDetailSection';
import FinancialDetailFields from '../FinancialDetailFields/FinancialDetailFields';
import OptionalFinancialProfile from '../OptionalFinancialProfile/OptionalFinancialProfile';
import { usdKycFixLabels } from '../../constants/usdKycFixFields';

type KycReview = {status?:string;source?:string;reviewedAt?:string;submittedAt?:string;message?:string;items?:{field:string;reason?:string}[];updatedFields?:string[];lastRequest?:{items?:{field:string;reason?:string}[]}};

// What the user was asked to fix, or what they resubmitted for review.
function KycFixRequest({ review }: { review: KycReview }) {
  const resubmitted = review.status === 'in_review';
  const items = resubmitted ? review.lastRequest?.items ?? [] : review.items ?? [];
  return <FinancialDetailSection title={resubmitted ? 'Resubmitted fixes' : 'Fix requested from user'}>
    <div className="space-y-3 text-sm">
      <p className="text-muted-foreground">{resubmitted
        ? `The user resubmitted ${review.updatedFields?.length ? review.updatedFields.map(field => usdKycFixLabels[field] ?? field).join(', ') : 'their fixes'}${review.submittedAt ? ` on ${new Date(review.submittedAt).toLocaleString()}` : ''}. Review the updated items below.`
        : `Requested by ${review.source === 'miden' ? 'Miden' : 'an admin'}${review.reviewedAt ? ` on ${new Date(review.reviewedAt).toLocaleString()}` : ''}. The user has not resubmitted yet.`}</p>
      {review.source === 'miden' && resubmitted && <p className="text-red-500">Miden rejected this user. These fixes cannot be sent to Miden yet, so approving is blocked.</p>}
      {items.length > 0 && <ul className="space-y-1 list-disc pl-5">{items.map(item => <li key={item.field}><span className="font-medium">{usdKycFixLabels[item.field] ?? item.field}</span>{item.reason ? `: ${item.reason}` : ''}</li>)}</ul>}
    </div>
  </FinancialDetailSection>;
}
export default function UsdKycDetails({ data }: { data: RecordData }) {
  const photo = safeDocumentUrl(read(data, 'user.photoUrl'));
  return <div className="space-y-6">
    <FinancialDetailSection title="User profile">{photo && <Image unoptimized src={photo} alt="User profile photo" width={80} height={80} className="rounded-full object-cover h-20 w-20" />}<FinancialDetailFields data={data} fields={profileFields} /></FinancialDetailSection>
    <FinancialDetailSection title="USD wallet"><FinancialDetailFields data={data} fields={walletFields} /></FinancialDetailSection>
    {data.kycReview && typeof data.kycReview === 'object' ? <KycFixRequest review={data.kycReview as KycReview} /> : null}
    <FinancialDetailSection title="KYC documents">
      <FinancialDetailFields data={data} fields={[{label:'Submitted',path:'kycDocuments.submittedAt',format:'date'},{label:'BVN / Tax ID',path:'kycDocuments.bvnOrTaxId'}]} />
      <div className="space-y-6 mt-4">{[
        ['Government ID front','kycDocuments.govIdImageFront'],
        ['Government ID back','kycDocuments.govIdImageBack'],
        ['Proof of address','kycDocuments.proofOfAddressDocument'],
      ].map(([label,path]) => <DocumentInspector key={path} label={label} url={read(data,path)} />)}</div>
    </FinancialDetailSection>
    <OptionalFinancialProfile title="Residential address" value={data.residentialAddress} />
    <OptionalFinancialProfile title="Source of funds" value={data.sourceOfFunds} />
    <FinancialDetailSection title="Lead Bank virtual account"><FinancialDetailFields data={data} fields={bankFields} /></FinancialDetailSection>
    <FinancialDetailSection title="Crypto deposit address"><FinancialDetailFields data={data} fields={[{label:'Chain',path:'cryptoAddress.chain'},{label:'Address',path:'cryptoAddress.address'},{label:'Currency',path:'cryptoAddress.currency'}]} /></FinancialDetailSection>
    <FinancialDetailSection title="Security"><FinancialDetailFields data={data} fields={securityFields} /></FinancialDetailSection>
  </div>;
}
