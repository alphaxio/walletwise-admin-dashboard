import {
  ArrowLeftRight,
  BookmarkCheck,
  ChartNoAxesCombined,
  Database,
  GitCompareArrows,
  HandCoins,
  LayoutGrid,
  Settings,
  ShieldCheck,
  User,
  UserLock,
  UserRoundPen,
  UserRoundPlus,
  Users,
  UserStar,
  Phone,
  Dices,
  Tv,
  Wifi,
  Zap,
  Gift,
  Send,
  GiftIcon,
  Save,
  Handshake,
} from "lucide-react";

export const links = [
  {
    title: "Dashboard",
    links: [
      {
        name: "overview",
        link: "/overview",
        icon: <LayoutGrid className="w-4 h-4" />,
      },
      {
        name: "analytics",
        link: "/analytics",
        icon: <ChartNoAxesCombined className="w-4 h-4" />,
        permissions: [
          "admin_management.read",
          "admin_management.write",
          "admin_management.create",
        ],
      },
      {
        name: "earnings",
        link: "/earnings",
        icon: <HandCoins className="w-4 h-4" />,
        permissions: [
          "admin_management.read",
          "admin_management.write",
          "admin_management.create",
        ],
      },
      {
        name: "commission",
        link: "/commission",
        icon: <GitCompareArrows className="w-4 h-4" />,
      },
      {
        name: "referrals",
        link: "/referrals",
        icon: <UserRoundPlus className="w-4 h-4" />,
      },
      {
        name: "all transactions",
        link: "/all-transactions",
        icon: <ArrowLeftRight className="w-4 h-4" />,
      },
      {
        name: "usertag",
        link: "/usertag",
        icon: <UserStar className="w-4 h-4" />,
      },
      {
        name: "services",
        link: "/services/airtime",
        icon: <Database className="w-4 h-4" />,
      },
      {
        name: "redeem giftcard",
        link: "/services/gift-redeem",
        icon: <GiftIcon className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Support",
    links: [
      {
        name: "tickets",
        link: "/tickets",
        icon: <ShieldCheck className="w-4 h-4" />,
      },
    ],
  },

  {
    title: "admin management",
    links: [
      {
        name: "manage admin",
        link: "/manage-admin",
        icon: <UserLock className="w-4 h-4" />,
        permissions: [
          "admin_management.read",
          "admin_management.write",
          "admin_management.create",
        ],
      },
      {
        name: "partner events",
        link: "/manage-partner-events",
        icon: <Handshake className="w-4 h-4" />,
        permissions: [
          "admin_management.read",
          "admin_management.write",
          "admin_management.create",
        ],
      },
      {
        name: "manage user",
        link: "/manage-user",
        icon: <Users className="w-4 h-4" />,
      },
      {
        name: "USD KYC",
        link: "/manage-usd-kyc",
        icon: <BookmarkCheck className="w-4 h-4" />,
      },
      {
        name: "manage kyc",
        link: "/manage-kyc",
        icon: <BookmarkCheck className="w-4 h-4" />,
      },
      {
        name: "roles",
        link: "/roles",
        icon: <UserRoundPen className="w-4 h-4" />,
        permissions: [
          "admin_management.read",
          "admin_management.write",
          "admin_management.create",
        ],
      },
    ],
  },
  {
    title: "My Account",
    links: [
      {
        name: "profile",
        link: "/profile",
        icon: <User className="w-4 h-4" />,
      },
      {
        name: "security",
        link: "/security",
        icon: <Settings className="w-4 h-4" />,
      },
    ],
  },
];

export const services = [
  { name: "USD accounts", link: "/services/usd-accounts" },
  {
    name: "airtime",
    link: "/services/airtime",
  },
  { name: "betting", link: "/services/betting" },
  {
    name: "cable",
    link: "/services/cable",
  },
  {
    name: "data",
    link: "/services/data",
  },
  {
    name: "education",
    link: "/services/education",
  },
  {
    name: "electricity",
    link: "/services/electricity",
  },
  {
    name: "esim",
    link: "/services/esim",
  },
  {
    name: "events",
    link: "/services/events",
  },
  {
    name: "giftcard",
    link: "/services/giftcard",
  },
  {
    name: "redeem gift",
    link: "/services/gift-redeem",
  },
  {
    name: "savings",
    link: "/services/savings",
  },
  { name: "transfer", link: "/services/transfer" },
  {
    name: "virtual card",
    link: "/services/virtual-card",
  },
  // { name: "book flight", link: "/services/book-flight" },
  // {
  //   name: "hotel reservation",
  //   link: "/services/hotel-reservations",
  // },
];

export const servicesData = [
  {
    label: "Airtime",
    value: "airtime",
    color: "rgba(59, 130, 246, 0.8)",
    bgColor: "rgb(239 246 255)",
    icon: Phone,
  },
  {
    label: "Betting",
    value: "betting",
    color: "rgba(239, 68, 68, 0.8)",
    bgColor: "rgb(254 242 242)",
    icon: Dices,
  },
  {
    label: "Cable",
    value: "cable",
    color: "rgba(34, 197, 94, 0.8)",
    bgColor: "rgb(240 253 244)",
    icon: Tv,
  },
  {
    label: "Data",
    value: "data",
    color: "rgba(168, 85, 247, 0.8)",
    bgColor: "rgb(250 245 255)",
    icon: Wifi,
  },
  {
    label: "Electricity",
    value: "electricity",
    color: "rgba(234, 179, 8, 0.8)",
    bgColor: "rgb(254 252 232)",
    icon: Zap,
  },
  {
    label: "E-Sim",
    value: "esim",
    color: "rgba(168, 85, 247, 0.8)",
    bgColor: "rgb(250 245 255)",
    icon: Wifi,
  },
  {
    label: "Giftcard",
    value: "giftcard",
    color: "rgba(236, 72, 153, 0.8)",
    bgColor: "rgb(250 245 255)",
    icon: Gift,
  },
  {
    label: "Gift Redeem",
    value: "gift-redeem",
    color: "rgba(59, 130, 246, 0.8)",
    bgColor: "rgb(239 246 255)",
    icon: Phone,
  },
  {
    label: "Savings",
    value: "savings",
    color: "rgba(34, 197, 94, 0.8)",
    bgColor: "rgb(240 253 244)",
    icon: Save,
  },
  {
    label: "Transfer",
    value: "transfer",
    color: "rgba(20, 184, 166, 0.8)",
    bgColor: "rgb(240 253 244)",
    icon: Send,
  },
  {
    label: "Virtual Card",
    value: "card-creation",
    color: "rgba(234, 179, 8, 0.8)",
    bgColor: "rgb(254 252 232)",
    icon: Zap,
  },
];

export const commissionSortOptions = [
  { label: "Sort by", values: ["revenue"] },
  { label: "Period", values: ["daily", "weekly", "monthly"] },
  { label: "Order", values: ["asc", "desc"] },
];
export const streakSortOptions = [{ label: "Sort by", values: ["streak"] }];

export const TransactionSortOptions = [
  { label: "Order", values: ["ASC", "DESC"] },
  { label: "Status", values: ["pending", "success", "reversed", "failed"] },
];

export const dataPlanSortOptions = [
  { label: "Sort by", values: ["all plans", "custom plans", "original plans"] },
  { label: "Status", values: ["all plans", "active plans", "inactive plans"] },
];

export const redeemGiftSortOptions = [
  { label: "Currency", values: ["USD", "NGN", "EUR", "GBP", "CAD"] },
  { label: "Order", values: ["asc", "desc"] },
  { label: "Status", values: ["pending", "success", "reversed", "failed"] },
];
export const ratingGiftSortOptions = [
  { label: "Currency", values: ["USD", "CAD", "EUR", "GBP"] },
  { label: "Status", values: ["active", "inactive"] },
];

export const productGiftSortOptions = [
  { label: "Order", values: ["asc", "desc"] },
  { label: "Status", values: ["active", "inactive"] },
  {
    label: "Others",
    values: ["country", "currency", "created_at", "asset_id"],
  },
];

const currentYear = new Date().getFullYear();
const startYear = 2024;

export const years = Array.from(
  { length: currentYear - startYear + 1 },
  (_, i) => {
    const year = (startYear + i).toString();
    return { label: year, value: year };
  },
);
