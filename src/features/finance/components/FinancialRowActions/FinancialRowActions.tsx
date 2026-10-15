import { Button } from '@/components/ui/button';
import { recordId } from '../../helpers/records';
import type { FinancialRecord, Resource } from '../../types/index';
import UsdWalletActions from '../UsdWalletActions/UsdWalletActions';

export default function FinancialRowActions({resource, record, onSelect}: {
  resource:Resource;
  record:FinancialRecord;
  onSelect:(record:FinancialRecord) => void;
}) {
  if (resource === 'usd/kyc') return <UsdWalletActions walletId={recordId(record)} status={record.status} onReview={() => onSelect(record)} />;
  const id = recordId(record, resource === 'usd/accounts');
  return <Button variant="outline" disabled={!id} onClick={() => onSelect(record)}>View</Button>;
}
