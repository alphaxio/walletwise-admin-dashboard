"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { EventAdminCardProps, TicketType } from "../../types";
import {
  convertDateFormat,
  formatEventDate,
  formatEventTime,
} from "@/lib/helpers/dateFormats";
import { totalTickets } from "../../helpers/totalTickets";
import { numberWithCommas } from "@/lib/helpers";
import { formatNaira } from "@/lib/helpers/currency";

import {
  Calendar,
  CopyIcon,
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  TicketIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";

import StatChip from "@/components/molecules/StatChip/StatChip";
import TicketRow from "@/components/molecules/TicketRow/TicketRow";
import ActionButton from "@/components/atoms/ActionButton/ActionButton";

const EventAdminCard = ({
  data,
  total_attendees,
  onEdit,
  onDelete,
  onToggleVisibility,
  onViewAttendees,
}: EventAdminCardProps) => {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard?.writeText(data.event_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleToggleVisibility = () => {
    const next = !visible;
    setVisible(next);
    onToggleVisibility?.();
  };

  const tickets = Object.entries(data?.ticket_types ?? {})?.filter(
    ([, v]) => v !== undefined,
  ) as [string, TicketType][];
  const tokenPacks = data?.form_settings?.tokenPacks ?? [];
  const formFields = Object.entries(data?.form_settings ?? {}).filter(
    ([field, settings]) =>
      field !== "custom_fields" &&
      settings &&
      !Array.isArray(settings),
  ) as [string, { input_type: string; is_required: boolean }][];
  const formatLabel = (value: string) =>
    value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  const formatDateTime = (value?: string | null) =>
    value
      ? new Intl.DateTimeFormat("en-NG", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(value))
      : "—";

  return (
    <div className="w-full max-w-6xl mx-auto rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 font-sans">
      <div className="relative h-96 overflow-hidden">
        <Image
          src={data?.image_url}
          alt={data?.title}
          height={384}
          width={1200}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/80" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            Live Event
          </span>
          <div className="flex items-center gap-2">
            {!visible && (
              <span className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Hidden
              </span>
            )}
            <Link
              href={`/services/events/info/${data.event_id}`}
              className="text-[10px] text-white/60 bg-black/40 px-2.5 py-1 rounded-full hover:text-white hover:underline"
            >
              ID #{data?.id}
            </Link>
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-3 left-4">
          <Link href={`/services/events/info/${data.event_id}`} className="hover:underline">
            <h2 className="text-4xl font-black tracking-wide text-white leading-none uppercase">
              {data?.title}
            </h2>
          </Link>
          <p className="text-xs text-white/60 mt-1">
            {data?.date && convertDateFormat(data?.date)}
          </p>
        </div>
      </div>

      <div className="p-4 pb-0 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <StatChip
            icon={<TicketIcon />}
            label="Total Tickets"
            value={
              data?.ticket_types
                ? String(totalTickets(data?.ticket_types))
                : "0"
            }
          />
          <StatChip
            icon={<Calendar />}
            label="Created"
            value={data?.created_at && convertDateFormat(data?.created_at)}
          />
          <StatChip
            icon={<UsersIcon />}
            label="Attendees"
            value={
              total_attendees
                ? numberWithCommas(total_attendees).toString()
                : "0"
            }
          />
        </div>

        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
            <span className="text-[11px]">Event ID:</span>
            <Link href={`/services/events/info/${data.event_id}`} className="text-[11px] font-mono text-[#5c24cc] hover:underline dark:text-purple-400">
              {data?.event_id}
            </Link>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-lg transition-colors duration-150
              ${
                copied
                  ? "text-emerald-500"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
          >
            <CopyIcon />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <p className="text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
          {data?.description}
        </p>

        <div className="h-px bg-gray-100 dark:bg-white/10" />

        <div>
          <p className="mb-3 text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Event Information
          </p>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Category", data?.category],
              ["Status", data?.status],
              ["Event Date", formatEventDate(data?.date)],
              ["Start Time", formatEventTime(data?.time)],
              ["End Time", formatEventTime(data?.end_time)],
              [
                "Service Fee",
                data?.service_fee ? `${data.service_fee}%` : "—",
              ],
              ["Address", data?.address],
              ["Promo", data?.promo],
              ["Created By", data?.created_by_type],
              ["Partner ID", data?.partner_id, data?.partner_id ? `/manage-partner-events/info/${data.partner_id}` : undefined],
              ["Updated", formatDateTime(data?.updated_at)],
            ].map(([label, value, href]) => (
              <div
                key={label}
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-white/10 dark:bg-white/5"
              >
                <dt className="text-[10px] uppercase tracking-wide text-gray-400">
                  {label}
                </dt>
                <dd className="mt-1 break-words text-sm text-gray-700 dark:text-gray-200">
                  {href && value ? <Link href={href} className="text-[#5c24cc] hover:underline dark:text-purple-400">{value}</Link> : value || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {data?.refund_policy && (
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">
              Refund Policy
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {data.refund_policy}
            </p>
          </div>
        )}

        {formFields.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-widest text-gray-400">
              Registration Form
            </p>
            <div className="flex flex-wrap gap-2">
              {formFields.map(([field, settings]) => (
                <span
                  key={field}
                  className="rounded-full border px-3 py-1 text-xs text-gray-600 dark:border-gray-600 dark:text-gray-300"
                >
                  {formatLabel(field)} · {settings.input_type}
                  {settings.is_required ? " · Required" : " · Optional"}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="h-px bg-gray-100 dark:bg-white/10" />

        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
            Ticket Types
          </p>
          <div className="space-y-2">
            {tickets.length > 0 ? (
              tickets?.map(([type, tier]) => (
                <TicketRow key={type} type={type} data={tier} />
              ))
            ) : (
              <p className="text-[13px] text-gray-400 dark:text-gray-500 italic">
                No ticket types configured.
              </p>
            )}
          </div>
        </div>

        {tokenPacks.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Token Packs
            </p>
            <div className="space-y-2">
              {tokenPacks.map((pack, index) => (
                <div
                  key={`${pack.name}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 dark:border-white/10 dark:bg-white/5"
                >
                  <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200">
                    {pack.name}
                  </span>
                  <div className="flex items-center gap-5">
                    <span className="text-[12px] text-gray-400 dark:text-gray-500">
                      {numberWithCommas(pack.tokens)} tokens
                    </span>
                    <span className="min-w-[60px] text-right text-[13px] font-semibold text-[#5c24cc] dark:text-purple-400">
                      {formatNaira(pack.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-px bg-gray-100 dark:bg-white/10" />
      </div>

      <div className="p-4 flex flex-wrap gap-2">
        <ActionButton icon={<EditIcon />} label="Edit Event" onClick={onEdit} />
        <ActionButton
          icon={visible ? <EyeOffIcon /> : <EyeIcon />}
          label={visible ? "Hide Event" : "Show Event"}
          onClick={handleToggleVisibility}
        />
        <ActionButton
          icon={<UsersIcon />}
          label="Attendees"
          onClick={onViewAttendees}
        />
        <ActionButton
          icon={<TrashIcon />}
          label="Delete"
          danger
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

export default EventAdminCard;
