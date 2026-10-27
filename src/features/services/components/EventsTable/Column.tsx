import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { CellContext, createColumnHelper, Table } from "@tanstack/react-table";

import StatusBubble from "@/components/atoms/StatusBubble/StatusBubble";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { convertDateFormat, formatTime } from "@/lib/helpers/dateFormats";
import { numberWithCommas } from "@/lib/helpers";
import { EventsType } from "../../types";
import EventActionCell from "../EventActionCell/EventActionCell";

const columnHelper = createColumnHelper<EventsType>();

interface ColumnProps<TData = unknown> {
  table: Table<TData>;
}

const SortableHeader = ({
  label,
  column,
}: {
  label: string;
  column: {
    toggleSorting: (descending: boolean) => void;
    getIsSorted: () => false | "asc" | "desc";
  };
}) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

export const Column = [
  {
    id: "select",
    header: ({ table }: ColumnProps) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: CellContext<EventsType, unknown>) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  columnHelper.accessor("title", {
    header: ({ column }) => <SortableHeader label="Event" column={column} />,
    cell: ({ row }) => (
      <div className="min-w-48">
        <Link
          href={`/services/events/info/${row.original.event_id}`}
          className="font-medium capitalize text-[#5c24cc] hover:underline dark:text-purple-400"
        >
          {row.original.title}
        </Link>
        <Link
          href={`/services/events/info/${row.original.event_id}`}
          className="mt-1 block max-w-64 truncate text-xs text-gray-500 hover:underline"
        >
          {row.original.event_id}
        </Link>
      </div>
    ),
  }),
  columnHelper.accessor("category", {
    header: ({ column }) => <SortableHeader label="Category" column={column} />,
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap capitalize">{getValue() || "—"}</span>
    ),
  }),
  columnHelper.accessor("date", {
    header: ({ column }) => <SortableHeader label="Schedule" column={column} />,
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        <div>{convertDateFormat(row.original.date)}</div>
        <div className="text-xs text-gray-500">
          {row.original.time ? formatTime(row.original.time) : "Time not set"}
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("address", {
    header: ({ column }) => <SortableHeader label="Location" column={column} />,
    cell: ({ getValue }) => (
      <div className="max-w-64 truncate" title={getValue() || undefined}>
        {getValue() || "—"}
      </div>
    ),
  }),
  columnHelper.accessor("created_by_type", {
    header: ({ column }) => (
      <SortableHeader label="Created By" column={column} />
    ),
    cell: ({ getValue }) => (
      <span className="capitalize">{getValue() || "—"}</span>
    ),
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => <SortableHeader label="Status" column={column} />,
    cell: ({ getValue }) =>
      getValue() ? <StatusBubble status={getValue()!} /> : "—",
  }),
  columnHelper.accessor("total_attendees", {
    header: ({ column }) => (
      <SortableHeader label="Attendees" column={column} />
    ),
    cell: ({ getValue }) => numberWithCommas(Number(getValue() || 0)),
  }),
  columnHelper.accessor("total_tickets_sold", {
    header: ({ column }) => (
      <SortableHeader label="Tickets Sold" column={column} />
    ),
    cell: ({ getValue }) => numberWithCommas(Number(getValue() || 0)),
  }),
  columnHelper.accessor("total_tokens_sold", {
    header: ({ column }) => (
      <SortableHeader label="Tokens Sold" column={column} />
    ),
    cell: ({ getValue }) => numberWithCommas(Number(getValue() || 0)),
  }),
  columnHelper.accessor("service_fee", {
    header: ({ column }) => (
      <SortableHeader label="Service Fee" column={column} />
    ),
    cell: ({ getValue }) => `${Number(getValue() || 0)}%`,
  }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => <SortableHeader label="Created" column={column} />,
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap">
        {getValue() ? convertDateFormat(getValue()) : "—"}
      </span>
    ),
  }),
  {
    id: "actions",
    cell: ({ row }: CellContext<EventsType, unknown>) => (
      <EventActionCell
        eventId={row.original.event_id}
        status={row.original.status}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
