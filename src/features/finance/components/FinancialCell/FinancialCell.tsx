import UserProfileLink from '@/features/users/components/UserProfileLink/UserProfileLink';
import TableDate from '@/components/atoms/TableDate/TableDate';
import StatusBubble from '@/components/atoms/StatusBubble/StatusBubble';
import PlanProgress from '@/components/atoms/PlanProgress/PlanProgress';
import { display, money, read, recordId } from '../../helpers/records';
import type { Field, FinancialRecord } from '../../types/index';

const dateFields = new Set(['createdAt','submittedAt','startDate','maturityDate','date']);
const userFields = new Set(['user.name','user.email','user.tag']);
const statusFields = new Set(['status','threatStatus','restrictionStatus']);

export default function FinancialCell({record, field}: {record:FinancialRecord;field:Field}) {
  const value = read(record, field.key);
  if (dateFields.has(field.key)) {
    return <TableDate date={typeof value === 'string' ? value : ''} showWithTime={field.key === 'createdAt' || field.key === 'submittedAt'} />;
  }
  if (userFields.has(field.key)) {
    const email = read(record,'user.email');
    return <UserProfileLink name={display(value)} id={recordId(record,true) || undefined} email={typeof email === 'string' ? email : undefined} />;
  }
  if (statusFields.has(field.key)) return <StatusBubble status={typeof value === 'string' ? value : undefined} />;
  if (field.key === 'progress') return <PlanProgress start={record.startDate} end={record.maturityDate} />;
  return field.currency ? money(value,field.currency) : display(value);
}
