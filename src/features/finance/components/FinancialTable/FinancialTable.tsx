import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { recordId } from '../../helpers/records';
import type { Field, FinancialRecord, Resource } from '../../types/index';
import FinancialCell from '../FinancialCell/FinancialCell';
import FinancialRowActions from '../FinancialRowActions/FinancialRowActions';

export default function FinancialTable({resource, fields, records, onSelect}: {
  resource:Resource;
  fields:Field[];
  records:FinancialRecord[];
  onSelect:(record:FinancialRecord) => void;
}) {
  const hasActions = resource !== 'savings/accruals';
  return <div className="overflow-x-auto rounded border"><Table>
    <TableHeader><TableRow>
      {fields.map(field => <TableHead key={field.key}>{field.label}</TableHead>)}
      {hasActions && <TableHead>Action</TableHead>}
    </TableRow></TableHeader>
    <TableBody>
      {records.map((record,index) => <TableRow key={recordId(record) || index}>
        {fields.map(field => <TableCell key={field.key} className="whitespace-nowrap"><FinancialCell record={record} field={field} /></TableCell>)}
        {hasActions && <TableCell><FinancialRowActions resource={resource} record={record} onSelect={onSelect} /></TableCell>}
      </TableRow>)}
      {!records.length && <TableRow><TableCell colSpan={fields.length + Number(hasActions)} className="text-center p-10">No records match these filters.</TableCell></TableRow>}
    </TableBody>
  </Table></div>;
}
