"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useDeleteEvent } from "../../hooks/useDeleteEvent";
import { useGetEventInfo } from "../../hooks/useGetEventInfo";

import PageTitle from "@/components/atoms/PageTitle/PageTitle";
import AppBreadcrumb from "@/components/molecules/AppBreadcrumb/AppBreadcrumb";
import AdminInfoLoader from "@/components/atoms/skeleton/AdminInfoLoader";
import DynamicTabs from "@/components/molecules/DynamicTabs/DynamicTabs";
import EventAdminCard from "../EventAdminCard/EventAdminCard";
import EventAttendeesTable from "../EventAttendeesTable/EventAttendeesTable";
import ConfirmAction from "@/components/molecules/ConfirmAction/ConfirmAction";
import { eventBreadcrumb } from "../../constants/events";
import PartnerEventTicketsTable from "../PartnerEventTicketsTable/PartnerEventTicketsTable";
import InvalidateTokenForm from "../InvalidateTokenForm/InvalidateTokenForm";
import InvalidateTicketForm from "../InvalidateTicketForm/InvalidateTicketForm";

const EventInfoWrapper = ({ eventId }: { eventId: string }) => {
  const router = useRouter();

  const [showAttendees, setShowAttendees] = useState(false);

  const { data, isLoading } = useGetEventInfo(eventId);
  const { isOpen, onCancel, isPending, setIsOpen, deleteEvent } =
    useDeleteEvent();

  const toggleAttendees = () => {
    setShowAttendees((prev) => !prev);
  };

  const onEditEvent = () =>
    router.push(`/services/events/info/${eventId}/edit`);

  const eventViews = [
    {
      label: "Show Event",
      value: "event",
      content: (
        <div className="space-y-4">
          <EventAdminCard
            data={data?.event}
            onEdit={onEditEvent}
            total_attendees={data?.stats?.total_attendees}
            onViewAttendees={toggleAttendees}
            onDelete={() => setIsOpen(true)}
          />
          {showAttendees && <EventAttendeesTable eventId={eventId} />}
        </div>
      ),
    },
    {
      label: "View Tickets",
      value: "tickets",
      content: <PartnerEventTicketsTable eventId={eventId} />,
    },
    {
      label: "Invalidate Ticket",
      value: "invalidate-ticket",
      content: <InvalidateTicketForm eventId={eventId} />,
    },
    {
      label: "Invalidate Token",
      value: "invalidate-token",
      content: <InvalidateTokenForm eventId={eventId} />,
    },
  ];

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {isLoading ? (
        <AdminInfoLoader />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <PageTitle title="Event Details" description="" />
          </div>
          <AppBreadcrumb items={eventBreadcrumb} />
          <DynamicTabs
            tabs={eventViews}
            defaultTab="event"
            onClick={(view) => {
              if (view !== "event") setShowAttendees(false);
            }}
          />
          <ConfirmAction
            isPending={isPending}
            open={isOpen}
            setOpen={setIsOpen}
            onCancel={onCancel}
            onConfirm={() => deleteEvent({ eventId })}
            title="Delete event"
            description="Are you sure you want to delete this event?"
          />
        </>
      )}
    </div>
  );
};

export default EventInfoWrapper;
