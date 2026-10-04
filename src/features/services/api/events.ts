import { axiosInstance } from "@/lib/axiosInstance";
import { formatCreatedAt } from "@/lib/helpers/dateFormats";
import { fetchDataProps } from "@/lib/types";
import { CreateEventPayload, PartnerEventTicketsResponse } from "../types";
import { PartnerEventFiles, PartnerEventPayload } from "../types/partnerEvent";

export const getEvents = async ({
  currentPage,
  limit,
  search,
  selectedDateFilterValue,
}: fetchDataProps) => {
  try {
    const query: Record<string, string> = {};

    query.page = currentPage.toString();
    query.limit = limit.toString();

    if (search) query.search = search;

    if (selectedDateFilterValue) {
      if (selectedDateFilterValue.label === "custom") {
        query.filterType = "customRange";
        query.filterValue = `${formatCreatedAt(
          selectedDateFilterValue.dateRange.start,
        )},${formatCreatedAt(selectedDateFilterValue.dateRange.end)}`;
      } else {
        query.filterType = selectedDateFilterValue.label;
      }
    }

    const queryString = new URLSearchParams(query).toString();

    const url = `/events?${queryString}`;

    const { data } = await axiosInstance.get(url);
    return data?.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEvent = async ({ eventId }: { eventId: string }) => {
  try {
    const url = `/events/${eventId}`;
    const { data } = await axiosInstance.delete(url);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updatePartnerEventStatus = async ({
  eventId,
  status,
}: {
  eventId: string;
  status: "Approved" | "Declined";
}) => {
  const { data } = await axiosInstance.patch(`/partner/events/${eventId}`, {
    status,
  });

  return data;
};

export const getEventInfo = async ({ eventId }: { eventId: string }) => {
  try {
    const url = `/events/${eventId}`;
    const { data } = await axiosInstance.get(url);
    const eventInfo = data?.data;

    if (!eventInfo?.event || !Array.isArray(eventInfo.event.ticket_types)) {
      return eventInfo;
    }

    const ticketTypes = eventInfo.event.ticket_types.reduce(
      (
        normalized: Record<
          string,
          { price: number; quantity: number; discountPrice: number }
        >,
        ticket: { type: string; price: number; capacity: number },
      ) => {
        normalized[ticket.type] = {
          price: ticket.price,
          quantity: ticket.capacity,
          discountPrice: 0,
        };
        return normalized;
      },
      {},
    );

    const ticketSales = eventInfo.event.ticket_types.reduce(
      (
        normalized: Record<
          string,
          {
            sold: number;
            price: number;
            total_quantity: number;
            available: number;
          }
        >,
        ticket: { type: string; price: number; capacity: number },
        index: number,
      ) => {
        if (typeof ticket?.type !== "string" || !ticket.type.trim()) return normalized;
        const sale = eventInfo.stats?.ticket_sales?.[index] ?? {};
        const sold = sale.sold ?? 0;

        normalized[ticket.type.toLowerCase()] = {
          sold,
          price: sale.price ?? ticket.price,
          total_quantity: ticket.capacity,
          available: Math.max(ticket.capacity - sold, 0),
        };
        return normalized;
      },
      {},
    );

    return {
      ...eventInfo,
      event: {
        ...eventInfo.event,
        ticket_types: ticketTypes,
      },
      stats: {
        ...eventInfo.stats,
        ticket_sales: ticketSales,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getPartnerEventTickets = async ({
  eventId,
  page,
  limit,
  search,
  attendance_status,
  payment_status,
}: {
  eventId: string;
  page: number;
  limit: number;
  search?: string;
  attendance_status?: string;
  payment_status?: string;
}) => {
  const { data } = await axiosInstance.get<PartnerEventTicketsResponse>(
    `/partner/${eventId}/tickets`,
    {
      params: {
        eventId,
        page,
        limit,
        ...(search && { search }),
        ...(attendance_status && { attendance_status }),
        ...(payment_status && { payment_status }),
      },
    },
  );

  return data;
};

export const validatePartnerTicket = async ({
  ticketId,
}: {
  ticketId: string;
}) => {
  const { data } = await axiosInstance.post("/partner/validate-ticket", {
    ticketId,
  });

  return data;
};

export function buildEventFormData(payload: CreateEventPayload): FormData {
  const form = new FormData();

  form.append("title", payload.title);
  form.append("date", payload.date);
  form.append("time", payload.time);
  form.append("address", payload.address);
  form.append("description", payload.description);

  if (payload.promo) form.append("promo", payload.promo);

  if (payload.image) form.append("image", payload.image);

  form.append("ticket_types", JSON.stringify(payload.ticket_types));

  return form;
}

export const createEvent = async ({
  payload,
}: {
  payload: CreateEventPayload;
}) => {
  try {
    const formData = buildEventFormData(payload);

    const url = `/events`;

    const { data } = await axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const createPartnerEvent = async ({
  payload,
  files,
}: {
  payload: PartnerEventPayload;
  files: PartnerEventFiles;
}) => {
  const form = buildPartnerEventFormData(payload, files, true);

  const { data } = await axiosInstance.post("/partner/events", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const buildPartnerEventFormData = (
  payload: PartnerEventPayload,
  files: PartnerEventFiles,
  includePartnerId = false,
) => {
  const form = new FormData();

  if (includePartnerId) form.append("partner_id", payload.partner_id);
  form.append("title", payload.title);
  form.append("description", payload.description);
  form.append("category", payload.category);
  form.append("date", payload.date);
  form.append("time", payload.time);
  form.append("end_time", payload.end_time);
  form.append("address", payload.address);
  form.append("service_fee", String(payload.service_fee));
  form.append("refund_policy", payload.refund_policy);
  form.append("ticket_types", JSON.stringify(payload.ticket_types));
  if (files.thumbnail) {
    form.append("thumbnail", files.thumbnail, files.thumbnail.name);
  }

  if (files.banner) form.append("banner", files.banner, files.banner.name);
  if (payload.headliner) {
    form.append("headliner", JSON.stringify(payload.headliner));
    files.headlinerImages.forEach((image) =>
      form.append("headliner_images", image, image.name),
    );
  }
  if (payload.prizes) {
    form.append("prizes", JSON.stringify(payload.prizes));
    files.prizeImages.forEach((image) =>
      form.append("prize_images", image, image.name),
    );
  }
  if (payload.form_settings) {
    form.append("form_settings", JSON.stringify(payload.form_settings));
  }

  return form;
};

export const updatePartnerEvent = async ({
  eventId,
  payload,
  files,
}: {
  eventId: string;
  payload: PartnerEventPayload;
  files: PartnerEventFiles;
}) => {
  const form = buildPartnerEventFormData(payload, files);
  const { data } = await axiosInstance.patch(
    `/partner/events/${eventId}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
};

export const getEventAttendees = async ({
  currentPage,
  limit,
  search,
  eventId,
}: fetchDataProps) => {
  try {
    const query: Record<string, string> = {};

    query.page = currentPage.toString();
    query.limit = limit.toString();

    if (search) query.search = search;

    const queryString = new URLSearchParams(query).toString();

    const url = `/events/${eventId}/attendees?${queryString}`;

    const { data } = await axiosInstance.get(url);
    return data?.data;
  } catch (error) {
    throw error;
  }
};
