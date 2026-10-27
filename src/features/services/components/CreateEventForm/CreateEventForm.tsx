"use client";

import { Plus, Trash2 } from "lucide-react";

import Button from "@/components/atoms/Button/Button";
import Input from "@/components/atoms/Input/Input";
import Label from "@/components/atoms/Label/Label";
import Select from "@/components/atoms/Select/Select";
import Textarea from "@/components/atoms/TextArea/Textarea";
import CurrencyInput from "@/components/atoms/CurrencyInput/CurrencyInput";
import PartnerSelectField from "../PartnerSelectField/PartnerSelectField";
import PartnerTokenPackFields from "../PartnerTokenPackFields/PartnerTokenPackFields";
import PartnerTicketFields from "../PartnerTicketFields/PartnerTicketFields";
import EventFileField from "../EventFileField/EventFileField";
import PartnerEventImageGuide from "../PartnerEventImageGuide/PartnerEventImageGuide";
import PartnerNamedImageFields from "../PartnerNamedImageFields/PartnerNamedImageFields";
import { useCreatePartnerEvent } from "../../hooks/useCreatePartnerEvent";
import {
  PARTNER_EVENT_CATEGORIES,
  PartnerEventCategory,
  PartnerEventCustomField,
} from "../../types/partnerEvent";

const categoryOptions = PARTNER_EVENT_CATEGORIES.map((category) => ({
  label: category,
  value: category,
}));

const customInputOptions = ["text", "number", "date", "file"].map((type) => ({
  label: type[0].toUpperCase() + type.slice(1),
  value: type,
}));

const CreateEventForm = ({ eventId }: { eventId?: string }) => {
  const event = useCreatePartnerEvent(eventId);
  const { form } = event;

  return (
    <form
      onSubmit={event.handleSubmit}
      className="grid w-full items-start gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]"
    >
      <div className="max-w-158 space-y-8">
        {!event.isEdit && (
          <PartnerSelectField
            value={form.partner_id}
            onChange={(value) => event.setField("partner_id", value)}
          />
        )}

        <section className="space-y-5">
          <h2 className="font-medium">Event details</h2>
          <div className="space-y-2">
            <Label title="Event name" />
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={(e) => event.setField("title", e.target.value)}
              placeholder="Event name"
            />
          </div>
          <div className="space-y-2">
            <Label title="Description" />
            <Textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={(e) => event.setField("description", e.target.value)}
              placeholder="Enter event description"
            />
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="font-medium">Details</h2>
          <div className="space-y-2">
            <Label title="Category" />
            <Select
              name="category"
              value={form.category}
              onChange={(e) =>
                event.setCategory(e.target.value as PartnerEventCategory)
              }
              options={categoryOptions}
            />
          </div>
          <div className="">
            <EventFileField
              id="thumbnail"
              label="Thumbnail image"
              required
              file={event.thumbnail}
              preview={event.thumbnailPreview}
              onChange={(file) => event.changeMainImage("thumbnail", file)}
              onClear={() => event.changeMainImage("thumbnail", null)}
            />
          </div>
          <div className="">
            <EventFileField
              id="banner"
              label="Event page image"
              file={event.banner}
              preview={event.bannerPreview}
              onChange={(file) => event.changeMainImage("banner", file)}
              onClear={() => event.changeMainImage("banner", null)}
            />
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="font-medium">Date &amp; time</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <Label title="Date" />
              <Input
                type="date"
                name="date"
                value={form.date}
                onChange={(e) => event.setField("date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label title="Start time" />
              <Input
                type="time"
                name="time"
                value={form.time}
                onChange={(e) => event.setField("time", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label title="End time" />
              <Input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={(e) => event.setField("end_time", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="font-medium">Location</h2>
          <div className="space-y-2">
            <Label title="Venue" />
            <Input
              type="text"
              name="address"
              value={form.address}
              onChange={(e) => event.setField("address", e.target.value)}
              placeholder="e.g. Eko Convention Centre, Lagos"
            />
          </div>
        </section>

        <PartnerNamedImageFields
          kind="headliner"
          items={event.headliners}
          onAdd={event.addNamedImage}
          onChange={event.updateNamedImage}
          onRemove={event.removeNamedImage}
        />

        {form.category === "Beauty Pageant" && (
          <>
            <PartnerNamedImageFields
              kind="prize"
              items={event.prizes}
              onAdd={event.addNamedImage}
              onChange={event.updateNamedImage}
              onRemove={event.removeNamedImage}
            />
            <CustomRegistrationFields
              fields={event.customFields}
              setFields={event.setCustomFields}
            />
          </>
        )}

        <PartnerTicketFields
          tickets={form.ticket_types}
          onChange={event.changeTicket}
          onAdd={event.addTicket}
          onRemove={event.removeTicket}
        />

        <PartnerTokenPackFields
          packs={form.token_packs || []}
          onChange={event.changeTokenPack}
          onAdd={event.addTokenPack}
          onRemove={event.removeTokenPack}
        />

        <div className="space-y-2">
          <Label title="Service fee (₦)" />
          <CurrencyInput
            name="service_fee"
            value={form.service_fee}
            onValueChange={(value) => event.setField("service_fee", value)}
          />
        </div>
        <div className="space-y-2">
          <Label title="Refund policy" />
          <Textarea
            rows={4}
            name="refund_policy"
            value={form.refund_policy}
            onChange={(e) => event.setField("refund_policy", e.target.value)}
            placeholder="Enter the refund policy"
          />
        </div>

        <Button width="w-full sm:w-fit" type="submit" loading={event.isPending}>
          {event.isEdit ? "Update Partner Event" : "Publish Partner Event"}
        </Button>
      </div>

      <PartnerEventImageGuide
        form={form}
        thumbnailPreview={event.thumbnailPreview}
        bannerPreview={event.bannerPreview}
      />
    </form>
  );
};

const CustomRegistrationFields = ({
  fields,
  setFields,
}: {
  fields: PartnerEventCustomField[];
  setFields: React.Dispatch<React.SetStateAction<PartnerEventCustomField[]>>;
}) => (
  <section className="space-y-4">
    <div>
      <h2 className="font-medium">Contestant form</h2>
      <p className="text-sm text-gray-500">
        Full name, date of birth and state of origin are included by default.
      </p>
    </div>
    {fields.map((field, index) => (
      <div
        key={index}
        className="grid gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700 sm:grid-cols-[1fr_12rem_auto]"
      >
        <Input
          type="text"
          name="field_name"
          value={field.field_name}
          onChange={(e) =>
            setFields((current) =>
              current.map((item, i) =>
                i === index ? { ...item, field_name: e.target.value } : item,
              ),
            )
          }
          placeholder="Field name"
        />
        <Select
          options={customInputOptions}
          value={field.input_type}
          onChange={(e) =>
            setFields((current) =>
              current.map((item, i) =>
                i === index
                  ? {
                      ...item,
                      input_type: e.target
                        .value as PartnerEventCustomField["input_type"],
                    }
                  : item,
              ),
            )
          }
        />
        <button
          type="button"
          onClick={() =>
            setFields((current) => current.filter((_, i) => i !== index))
          }
          className="cursor-pointer text-red-500"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() =>
        setFields((current) => [
          ...current,
          { field_name: "", input_type: "text", is_required: false },
        ])
      }
      className="flex cursor-pointer items-center gap-2 text-sm text-[#5c24cc]"
    >
      <Plus className="h-4 w-4" /> Add custom field
    </button>
  </section>
);

export default CreateEventForm;
