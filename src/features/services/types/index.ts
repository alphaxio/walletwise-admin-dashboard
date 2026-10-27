export interface TransactionDetails {
  billerRef?: string;
  requestID?: string;
  remark?: string;
  bankName?: string;
  recepientAcc?: string;
  [key: string]: string | undefined;
  fee?: string;
  brand?: string;
  card_id?: string;
  currency?: string;
  card_name?: string;
  commission?: string;
  exchange_rate?: string;
  provider_rate?: string;
  quote_trans_id?: string;
  amount_credited?: string;
  amount_requested?: string;
  amount_usd?: string;
}

export interface ServiceData {
  id: number;
  status: "success" | "failed" | "pending" | "reversed";
  type: "debit" | "credit";
  asset_id: string;
  category: string;
  amount: string;
  fee: string;
  commission: string;
  date: string;
  product_name: string;
  transaction_id: string;
  details: TransactionDetails;
  balance: string;
  initiator_email: string;
  user_id: string;
  first_name: string;
  last_name: string;
  user_email: string;
  phone_number: string;
  user_tag: string;
  user_created_at: string;
  balance_after?: string;
}

export interface CreateDataPlanType {
  base_plan_id: string;
  fulfillment_quantity: string;
  commission?: string;
  plan_code?: string;
  final_price?: string;
}

export interface DataPlan {
  id: number;
  name: string;
  network: string;
  provider: string;

  plan_code: string;
  variation_code: string;
  external_plan_id: string;

  volume: string;
  validity: string;

  cost: string;
  commission: string;
  final_price: string;

  fulfillment_quantity: number | null;

  is_active: boolean;
  is_custom: boolean;

  created_at: string;
  updated_at: string;
}

export type TicketType = {
  price: number;
  quantity: number;
  discountPrice: number;
};

export type GiftCardTransaction = {
  id: number;
  user_id: string;

  token: string;
  transaction_id: string;
  gift_card_key: string;
  gift_card_name: string | null;
  currency: string;
  amount_in_currency: string;
  amount_in_naira: string;
  exchange_rate: string;
  fee: string;
  final_amount: string;
  status: "pending" | "success" | "failed" | "reversed" | "processing";
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type TicketTypes = {
  regular?: TicketType;
  vip?: TicketType;
  free?: TicketType;
  "Table (10)"?: TicketType;
  "Table (8)"?: TicketType;
  "Table (6)"?: TicketType;
  Table?: TicketType;
};

export type TicketFormTypes = {
  Regular?: TicketType;
  VIP?: TicketType;
  Free?: TicketType;
  Table?: TicketType;
  Table6?: TicketType;
  Table8?: TicketType;
  Table10?: TicketType;
};
export interface EventsType {
  id: number;
  event_id: string;
  title: string;
  date: string;
  time: string | null;
  address: string | null;
  description: string | null;
  promo: string | null;
  image_url: string;
  banner_image_url?: string | null;
  user_id?: string | null;
  total_attendees: string;
  total_tickets_sold: string;
  ticket_types: TicketTypes;
  created_at: string;
  updated_at?: string;
  end_time?: string | null;
  category?: string;
  service_fee?: string;
  refund_policy?: string | null;
  partner_id?: string | null;
  created_by_type?: string;
  status?: string;
  form_settings?: {
    tokenPacks?: import("./partnerEvent").PartnerEventTokenPack[];
    custom_fields?: unknown[];
    [field: string]:
      | { input_type: string; is_required: boolean }
      | unknown[]
      | undefined;
  };
}

export type TicketPurchase = {
  price: string;
  purchasedAt: string;
  ticketType: string;
  validated: boolean;
  validatedAt: null | string;
  validatedBy: null | string;
};

export interface EventsAttendeesType {
  id: number;
  event_id: string;
  confirmed_at: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  status: string;
  ticket_id: string;
  user_tag: string;
  tickets_purchased: TicketPurchase;
  user_id: string;
}

export interface PartnerEventTicket {
  id: number;
  ticket_id: string;
  email: string | null;
  name: string | null;
  phone_number: string | null;
  payment_status: string;
  attendance_status: string;
  attended_count: number;
  attended_at: string | null;
  confirmed_at: string | null;
  tickets_purchased: {
    price: string;
    quantity: number;
    ticketType: string;
  };
  custom_answers: {
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    paymentReference?: string;
  };
}

export interface PartnerEventTicketsResponse {
  success: boolean;
  message: string;
  data: {
    event: {
      eventId: string;
      title: string;
      date: string;
    };
    tickets: PartnerEventTicket[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasMore: boolean;
    };
  };
}

export interface EventAdminCardProps {
  data: EventsType;
  total_attendees: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  onViewAttendees?: () => void;
}

export interface CreateEventPayload {
  title: string;
  date: string;
  time: string;
  address: string;
  description: string;
  promo?: string;
  image: File | null;
  ticket_types: TicketFormTypes;
}

export interface EventFormValues {
  title: string;
  date: string;
  time: string;
  address: string;
  description: string;
  promo: string;
  image: File | null;
  ticket_types: TicketFormTypes;
}

export type VirtualCardRating = {
  id: number;
  created_at: string;
  updated_at: string;
  currency: string;
  rate: string;
  provider_rate: string;
  sell_rate: string;

  fee: string;
  is_active: boolean;
};

export type GiftCardProduct = {
  id: number;
  asset_id: string;
  country: string;
  currency: string;
  is_active: true;
  created_at: string;
  updated_at: string;
};

export type GiftCardCategory = {
  id: number;
  product_id: string;
  name: string;
  rate: string;
  is_active: true;
  created_at: string;
  updated_at: string;
  asset_id: string;
  admin_rate: string;
};
