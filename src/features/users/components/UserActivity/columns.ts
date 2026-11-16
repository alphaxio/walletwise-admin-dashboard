import { createElement } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import StatusBubble from '@/components/atoms/StatusBubble/StatusBubble';
import { formatActivityMoney, formatActivityTime } from '../../helpers/activity';
import type { UserActivityRecord } from '../../types/activity';

export const activityColumns: ColumnDef<unknown>[] = [
  { accessorKey: 'occurredAt', header: 'Date and time', cell: ({ getValue }) => formatActivityTime(getValue<string>()) },
  { accessorKey: 'description', header: 'Activity' },
  { accessorKey: 'amountMinor', header: 'Amount', cell: ({ getValue }) => getValue<number | null>() === null ? '—' : formatActivityMoney(getValue<number>()) },
  { accessorKey: 'kind', header: 'Type', cell: ({ getValue }) => createElement(StatusBubble, { status: getValue<string>() }) },
  { accessorKey: 'channel', header: 'Channel' },
  { accessorKey: 'service', header: 'Service' },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => createElement(StatusBubble, { status: (row.original as UserActivityRecord).status }) },
];
