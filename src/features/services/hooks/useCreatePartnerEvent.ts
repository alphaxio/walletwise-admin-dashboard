import { SubmitEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { createPartnerEvent, updatePartnerEvent } from "../api/events";
import { useGetEventInfo } from "./useGetEventInfo";
import { formatDateForInput, formatTimeForInput } from "../helpers/events";
import {
  PARTNER_EVENT_CATEGORIES,
  PartnerEventCategory,
  PartnerEventCustomField,
  PartnerEventPayload,
  PartnerEventTicketType,
  PartnerEventTokenPack,
} from "../types/partnerEvent";

export interface NamedImage {
  name: string;
  description?: string;
  image: File | null;
  preview: string | null;
}

const initialPayload: PartnerEventPayload = {
  partner_id: "",
  title: "",
  description: "",
  category: "Concert",
  date: "",
  time: "",
  end_time: "",
  address: "",
  service_fee: 0,
  refund_policy: "",
  ticket_types: [{ type: "Regular", price: 0, capacity: 0 }],
  token_packs: [],
};

type ExistingNamedImage = {
  artist_name?: string;
  name?: string;
  description?: string;
  image_url?: string;
  image?: string;
};

export const useCreatePartnerEvent = (eventId?: string) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = Boolean(eventId);
  const eventQuery = useGetEventInfo(eventId || "", isEdit);
  const hydratedEventId = useRef<string | null>(null);
  const [form, setForm] = useState(initialPayload);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [headliners, setHeadliners] = useState<NamedImage[]>([]);
  const [prizes, setPrizes] = useState<NamedImage[]>([]);
  const [customFields, setCustomFields] = useState<PartnerEventCustomField[]>(
    [],
  );

  useEffect(() => {
    if (isEdit) return;
    const partnerId = searchParams.get("partnerId");
    if (partnerId)
      setForm((current) => ({ ...current, partner_id: partnerId }));
  }, [isEdit, searchParams]);

  useEffect(() => {
    if (!eventId || !eventQuery.data?.event || hydratedEventId.current === eventId) return;

    const existing = eventQuery.data.event as Record<string, unknown>;
    const ticketTypes = existing.ticket_types as Record<
      string,
      { price?: number; quantity?: number; capacity?: number }
    > | undefined;
    const mappedTickets = Object.entries(ticketTypes || {}).map(
      ([type, ticket]) => ({
        type,
        price: Number(ticket.price || 0),
        capacity: Number(ticket.capacity ?? ticket.quantity ?? 0),
      }),
    );
    const category = PARTNER_EVENT_CATEGORIES.includes(
      existing.category as PartnerEventCategory,
    )
      ? (existing.category as PartnerEventCategory)
      : "Others";

    const formSettings = existing.form_settings as
      | { custom_fields?: PartnerEventCustomField[]; tokenPacks?: PartnerEventTokenPack[] }
      | undefined;
    const tokenPacks = formSettings?.tokenPacks ?? existing.token_packs;

    setForm({
      partner_id: String(existing.partner_id || ""),
      title: String(existing.title || ""),
      description: String(existing.description || ""),
      category,
      date: formatDateForInput(existing.date as string) || "",
      time: formatTimeForInput(existing.time as string) || "",
      end_time: formatTimeForInput(existing.end_time as string) || "",
      address: String(existing.address || ""),
      service_fee: Number(existing.service_fee || 0),
      refund_policy: String(existing.refund_policy || ""),
      token_packs: Array.isArray(tokenPacks)
        ? tokenPacks.map((pack: PartnerEventTokenPack) => ({
            name: pack.name,
            tokens: Number(pack.tokens),
            price: Number(pack.price),
          }))
        : [],
      ticket_types: mappedTickets.length
        ? mappedTickets
        : [{ type: "Regular", price: 0, capacity: 0 }],
    });

    setThumbnailPreview(String(existing.image_url || existing.thumbnail_url || "") || null);
    setBannerPreview(String(existing.banner_image_url || existing.banner_url || "") || null);

    const existingHeadliners = (existing.headliner || existing.headliners || []) as ExistingNamedImage[];
    setHeadliners(existingHeadliners.map((item) => ({
      name: item.artist_name || item.name || "",
      image: null,
      preview: item.image_url || item.image || null,
    })));
    const existingPrizes = (existing.prizes || []) as ExistingNamedImage[];
    setPrizes(existingPrizes.map((item) => ({
      name: item.name || "",
      description: item.description || "",
      image: null,
      preview: item.image_url || item.image || null,
    })));

    setCustomFields(formSettings?.custom_fields || []);
    hydratedEventId.current = eventId;
  }, [eventId, eventQuery.data]);

  const setField = useCallback(
    <K extends keyof PartnerEventPayload>(
      field: K,
      value: PartnerEventPayload[K],
    ) => setForm((current) => ({ ...current, [field]: value })),
    [],
  );

  const setCategory = useCallback((category: PartnerEventCategory) => {
    setForm((current) => ({ ...current, category }));
    if (category !== "Beauty Pageant") {
      setPrizes([]);
      setCustomFields([]);
    }
  }, []);

  const changeTicket = useCallback(
    (
      index: number,
      field: keyof PartnerEventTicketType,
      value: string | number,
    ) =>
      setForm((current) => ({
        ...current,
        ticket_types: current.ticket_types.map((ticket, ticketIndex) =>
          ticketIndex === index ? { ...ticket, [field]: value } : ticket,
        ),
      })),
    [],
  );
  const addTicket = useCallback(
    () =>
      setForm((current) => ({
        ...current,
        ticket_types: [
          ...current.ticket_types,
          { type: "", price: 0, capacity: 0 },
        ],
      })),
    [],
  );
  const removeTicket = useCallback(
    (index: number) =>
      setForm((current) => ({
        ...current,
        ticket_types: current.ticket_types.filter((_, i) => i !== index),
      })),
    [],
  );

  const changeTokenPack = useCallback(
    (index: number, field: keyof PartnerEventTokenPack, value: string | number) =>
      setForm((current) => ({
        ...current,
        token_packs: (current.token_packs || []).map((pack, i) =>
          i === index ? { ...pack, [field]: value } : pack,
        ),
      })),
    [],
  );
  const addTokenPack = useCallback(
    () => setForm((current) => ({
      ...current,
      token_packs: [...(current.token_packs || []), { name: "", tokens: 0, price: 0 }],
    })),
    [],
  );
  const removeTokenPack = useCallback(
    (index: number) => setForm((current) => ({
      ...current,
      token_packs: (current.token_packs || []).filter((_, i) => i !== index),
    })),
    [],
  );

  const updateNamedImage = useCallback(
    (
      kind: "headliner" | "prize",
      index: number,
      field: keyof NamedImage,
      value: string | File | null,
    ) => {
      const setter = kind === "headliner" ? setHeadliners : setPrizes;
      setter((current) =>
        current.map((item, i) => {
          if (i !== index) return item;
          if (field !== "image") return { ...item, [field]: value };
          if (item.preview) URL.revokeObjectURL(item.preview);
          const image = value as File | null;
          return {
            ...item,
            image,
            preview: image ? URL.createObjectURL(image) : null,
          };
        }),
      );
    },
    [],
  );
  const addNamedImage = useCallback((kind: "headliner" | "prize") => {
    const setter = kind === "headliner" ? setHeadliners : setPrizes;
    setter((current) => [
      ...current,
      { name: "", description: "", image: null, preview: null },
    ]);
  }, []);

  const changeMainImage = useCallback(
    (kind: "thumbnail" | "banner", file: File | null) => {
      const setFile = kind === "thumbnail" ? setThumbnail : setBanner;
      const setPreview =
        kind === "thumbnail" ? setThumbnailPreview : setBannerPreview;
      setPreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return file ? URL.createObjectURL(file) : null;
      });
      setFile(file);
    },
    [],
  );
  const removeNamedImage = useCallback(
    (kind: "headliner" | "prize", index: number) => {
      const setter = kind === "headliner" ? setHeadliners : setPrizes;
      setter((current) => current.filter((_, i) => i !== index));
    },
    [],
  );

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: {
      payload: PartnerEventPayload;
      files: {
        thumbnail: File | null;
        banner: File | null;
        headlinerImages: File[];
        prizeImages: File[];
      };
    }) =>
      eventId
        ? updatePartnerEvent({ eventId, ...variables })
        : createPartnerEvent(variables),
    onSuccess: async () => {
      toast.success(
        isEdit
          ? "Partner event successfully updated"
          : "Partner event successfully created",
      );
      const invalidations = [
        queryClient.invalidateQueries({ queryKey: ["events"] }),
        queryClient.invalidateQueries({ queryKey: ["partners"] }),
        queryClient.invalidateQueries({ queryKey: ["partner info"] }),
      ];
      if (eventId) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: ["event info", eventId],
            refetchType: "all",
          }),
        );
      }
      await Promise.all(invalidations);
      setForm(initialPayload);
      setThumbnail(null);
      setThumbnailPreview(null);
      setBanner(null);
      setBannerPreview(null);
      setHeadliners([]);
      setPrizes([]);
      setCustomFields([]);
      router.push(
        isEdit && eventId
          ? `/services/events/info/${eventId}`
          : "/services/events",
      );
    },
    onError: (error: ApiErrorResponse) => promiseErrorFunction(error),
  });

  const handleSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      const requiredValues = [
        ...(isEdit ? [] : [form.partner_id]),
        form.title,
        form.description,
        form.date,
        form.time,
        form.end_time,
        form.address,
      ];
      if (requiredValues.some((value) => !value.trim())) {
        toast.error("Please complete all required event fields.");
        return;
      }
      if (!isEdit && !thumbnail) {
        toast.error("Thumbnail image is required.");
        return;
      }
      if (
        !form.ticket_types.length ||
        form.ticket_types.some(
          (ticket) => !ticket.type.trim() || ticket.capacity <= 0,
        )
      ) {
        toast.error("Add at least one valid ticket tier.");
        return;
      }

      if (form.token_packs?.some((pack) =>
        !pack.name.trim() || !Number.isSafeInteger(pack.tokens) || pack.tokens <= 0 ||
        !Number.isFinite(pack.price) || pack.price < 0
      )) {
        toast.error("Each token pack needs a name, a positive whole token count, and a valid price.");
        return;
      }

      const isPageant = form.category === "Beauty Pageant";
      mutate({
        payload: {
          ...form,
          ...(headliners.length && {
            headliner: headliners.map((item) => ({ artist_name: item.name })),
          }),
          ...(isPageant &&
            prizes.length && {
              prizes: prizes.map((item) => ({
                name: item.name,
                description: item.description || "",
              })),
            }),
          ...(isPageant && {
            form_settings: {
              full_name: { input_type: "text", is_required: true },
              date_of_birth: { input_type: "date", is_required: true },
              state_of_origin: { input_type: "text", is_required: true },
              custom_fields: customFields,
            },
          }),
        },
        files: {
          thumbnail,
          banner,
          headlinerImages: headliners.flatMap((item) =>
            item.image ? [item.image] : [],
          ),
          prizeImages: prizes.flatMap((item) =>
            item.image ? [item.image] : [],
          ),
        },
      });
    },
    [banner, customFields, form, headliners, isEdit, mutate, prizes, thumbnail],
  );

  return {
    form,
    setField,
    setCategory,
    thumbnail,
    thumbnailPreview,
    banner,
    bannerPreview,
    changeMainImage,
    headliners,
    prizes,
    customFields,
    setCustomFields,
    updateNamedImage,
    addNamedImage,
    removeNamedImage,
    changeTokenPack,
    addTokenPack,
    removeTokenPack,
    changeTicket,
    addTicket,
    removeTicket,
    handleSubmit,
    isPending,
    isLoading: eventQuery.isLoading,
    isEdit,
  };
};
