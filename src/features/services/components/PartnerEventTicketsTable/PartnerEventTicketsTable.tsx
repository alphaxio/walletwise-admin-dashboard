"use client";

import { useState } from "react";

import Button from "@/components/atoms/Button/Button";
import StatusBubble from "@/components/atoms/StatusBubble/StatusBubble";
import TableLoader from "@/components/atoms/skeleton/TableLoader";
import ConfirmAction from "@/components/molecules/ConfirmAction/ConfirmAction";
import PaginationComponent from "@/components/molecules/PaginationComponent/PaginationComponent";
import SearchInput from "@/components/molecules/SearchInput/SearchInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPartnerEventTickets } from "../../hooks/useGetPartnerEventTickets";
import { useValidatePartnerTicket } from "../../hooks/useValidatePartnerTicket";

const PartnerEventTicketsTable = ({ eventId }: { eventId: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { data, isLoading } = useGetPartnerEventTickets(
    eventId,
    currentPage,
    limit,
    search,
    attendanceStatus,
    paymentStatus,
  );
  const validation = useValidatePartnerTicket(eventId);

  const tickets = data?.data.tickets ?? [];
  const totalPages = data?.data.pagination.totalPages ?? 1;
  const formatDate = (date: string | null) =>
    date
      ? new Intl.DateTimeFormat("en-NG", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(date))
      : "—";
  const formatPrice = (price: string) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(price));

  const closeConfirmation = () => setSelectedTicketId(null);
  const handleValidate = () => {
    if (!selectedTicketId) return;
    validation.mutate(
      { ticketId: selectedTicketId },
      { onSuccess: closeConfirmation },
    );
  };

  if (isLoading) return <TableLoader />;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Event Tickets
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {data?.data.pagination.total ?? 0} tickets issued
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-64 flex-1">
          <SearchInput
            value={searchInput}
            placeholder="Search tickets"
            handleChange={setSearchInput}
            handleClear={() => {
              setSearchInput("");
              setSearch("");
              setCurrentPage(1);
            }}
            onSubmit={() => {
              setSearch(searchInput.trim());
              setCurrentPage(1);
            }}
          />
        </div>
        <Select
          value={attendanceStatus || "all"}
          onValueChange={(value) => {
            setAttendanceStatus(value === "all" ? "" : value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Attendance status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All attendance</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Attended">Attended</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={paymentStatus || "all"}
          onValueChange={(value) => {
            setPaymentStatus(value === "all" ? "" : value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-lg border dark:border-gray-800">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Confirmed</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length ? (
              tickets.map((ticket) => {
                const customerName =
                  ticket.name || ticket.custom_answers?.fullName || "—";
                const customerEmail =
                  ticket.email || ticket.custom_answers?.email || "—";
                const phone =
                  ticket.phone_number ||
                  ticket.custom_answers?.phoneNumber ||
                  "—";
                const isValidated =
                  (ticket.attendance_status ?? "pending").toLowerCase() !== "pending" ||
                  ticket.attended_count > 0;

                return (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono font-medium">
                      {ticket.ticket_id}
                    </TableCell>
                    <TableCell>{customerName}</TableCell>
                    <TableCell>
                      <div>{customerEmail}</div>
                      <div className="text-xs text-gray-500">{phone}</div>
                    </TableCell>
                    <TableCell>
                      {ticket.tickets_purchased.ticketType}
                    </TableCell>
                    <TableCell>{ticket.tickets_purchased.quantity}</TableCell>
                    <TableCell>
                      {formatPrice(ticket.tickets_purchased.price)}
                    </TableCell>
                    <TableCell>
                      <StatusBubble status={ticket.payment_status} />
                    </TableCell>
                    <TableCell>
                      <StatusBubble status={ticket.attendance_status} />
                    </TableCell>
                    <TableCell>{formatDate(ticket.confirmed_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        width="w-auto"
                        height="h-9"
                        disabled={isValidated}
                        onClick={() => setSelectedTicketId(ticket.ticket_id)}
                      >
                        {isValidated ? "Invalidated" : "Invalidate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center">
                  No tickets found for this event.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        prevPage={() => setCurrentPage((page) => Math.max(1, page - 1))}
        nextPage={() =>
          setCurrentPage((page) => Math.min(totalPages, page + 1))
        }
        goToFirstPage={() => setCurrentPage(1)}
        goToLastPage={() => setCurrentPage(totalPages)}
        isFirstPage={() => currentPage === 1}
        isLastPage={() => currentPage === totalPages}
        limit={limit}
        setLimit={(newLimit) => {
          setLimit(newLimit);
          setCurrentPage(1);
        }}
        setCurrentPage={setCurrentPage}
      />

      <ConfirmAction
        open={Boolean(selectedTicketId)}
        setOpen={(open) => {
          if (!open) closeConfirmation();
        }}
        onCancel={closeConfirmation}
        onConfirm={handleValidate}
        isPending={validation.isPending}
        title="Invalidate Ticket"
        description={`Are you sure you want to invalidate ticket ${selectedTicketId ?? ""}?`}
      />
    </section>
  );
};

export default PartnerEventTicketsTable;
