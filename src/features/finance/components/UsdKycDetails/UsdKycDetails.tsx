import Image from 'next/image';
import DocumentInspector from '@/components/molecules/DocumentInspector/DocumentInspector';
import { read,safeDocumentUrl } from '../../helpers/records';
import type { RecordData } from '../../types/index';
import { profileFields,walletFields,bankFields,securityFields } from '../../constants/kycDetails';
import FinancialDetailSection from '../FinancialDetailSection/FinancialDetailSection';
import FinancialDetailFields from '../FinancialDetailFields/FinancialDetailFields';
import OptionalFinancialProfile from '../OptionalFinancialProfile/OptionalFinancialProfile';
export default function UsdKycDetails({ data }: { data: RecordData }) {
  const photo = safeDocumentUrl(read(data, 'user.photoUrl'));
  return <div className="space-y-6">
    <FinancialDetailSection title="User profile">{photo && <Image unoptimized src={photo} alt="User profile photo" width={80} height={80} className="rounded-full object-cover h-20 w-20" />}<FinancialDetailFields data={data} fields={profileFields} /></FinancialDetailSection>
    <FinancialDetailSection title="USD wallet"><FinancialDetailFields data={data} fields={walletFields} /></FinancialDetailSection>
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
