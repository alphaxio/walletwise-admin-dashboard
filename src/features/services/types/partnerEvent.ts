export const PARTNER_EVENT_CATEGORIES = [
  "Concert",
  "Beauty Pageant",
  "Sports",
  "Conference",
  "Religion",
  "Others",
] as const;

export type PartnerEventCategory = (typeof PARTNER_EVENT_CATEGORIES)[number];

export interface PartnerEventTicketType {
  type: string;
  price: number;
  capacity: number;
}

export interface PartnerEventTokenPack {
  name: string;
  tokens: number;
  price: number;
}

export interface PartnerEventCustomField {
  field_name: string;
  input_type: "text" | "number" | "date" | "file";
  is_required: boolean;
}

export interface PartnerEventPayload {
  partner_id: string;
  title: string;
  description: string;
  category: PartnerEventCategory;
  date: string;
  time: string;
  end_time: string;
  address: string;
  service_fee: number;
  refund_policy: string;
  ticket_types: PartnerEventTicketType[];
  token_packs?: PartnerEventTokenPack[];
  headliner?: { artist_name: string }[];
  prizes?: { name: string; description: string }[];
  form_settings?: {
    full_name: { input_type: "text"; is_required: boolean };
    date_of_birth: { input_type: "date"; is_required: boolean };
    state_of_origin: { input_type: "text"; is_required: boolean };
    custom_fields: PartnerEventCustomField[];
  };
}

export interface PartnerEventFiles {
  thumbnail: File | null;
  banner: File | null;
  headlinerImages: File[];
  prizeImages: File[];
}
