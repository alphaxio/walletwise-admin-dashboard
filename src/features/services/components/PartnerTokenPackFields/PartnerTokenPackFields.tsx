"use client";

import { memo, useState } from "react";

import Input from "@/components/atoms/Input/Input";
import Label from "@/components/atoms/Label/Label";
import CurrencyInput from "@/components/atoms/CurrencyInput/CurrencyInput";
import { formatNaira } from "@/lib/helpers/currency";
import { PartnerEventTokenPack } from "../../types/partnerEvent";

interface Props {
  packs: PartnerEventTokenPack[];
  onChange: (index: number, field: keyof PartnerEventTokenPack, value: string | number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const PartnerTokenPackFields = memo(function PartnerTokenPackFields({ packs, onChange, onAdd, onRemove }: Props) {
  const [confirmed, setConfirmed] = useState<number[]>([]);

  const removePack = (index: number) => {
    onRemove(index);
    setConfirmed((current) =>
      current.filter((item) => item !== index).map((item) => item > index ? item - 1 : item),
    );
  };

  return (
    <section className="space-y-4">
      <div className="space-y-1"><h2 className="font-medium">Token packs (optional)</h2><p className="text-sm text-gray-500">Add token packs if this event uses tokens. Leave empty otherwise.</p></div>
      <div className="space-y-3">
        {packs.map((pack, index) => confirmed.includes(index) ? (
          <div key={index} className="mb-2 flex items-center justify-between rounded border bg-gray-50 px-3 py-2">
            <div className="flex items-center gap-4"><span className="text-sm font-medium capitalize">{pack.name}</span><span className="text-sm text-gray-500">{formatNaira(pack.price)}</span><span className="text-sm text-gray-500">{pack.tokens.toLocaleString()} tokens</span></div>
            <div className="flex items-center gap-2"><button type="button" onClick={() => setConfirmed((current) => current.filter((item) => item !== index))} className="text-xs text-blue-500">Edit</button><button type="button" onClick={() => removePack(index)} aria-label="Remove token pack">×</button></div>
          </div>
        ) : (
          <div key={index} className="grid grid-cols-2 gap-2">
            <div className="w-full space-y-2"><Label title="Name" /><Input type="text" name="name" placeholder="Pack name (e.g. Starter Pack)" value={pack.name} onChange={(e) => onChange(index, "name", e.target.value)} /></div>
            <div className="flex items-center gap-2">
              <div className="w-full flex-1 space-y-2"><Label title="Price (₦)" /><CurrencyInput name="price" value={pack.price} onValueChange={(value) => onChange(index, "price", value)} /></div>
              <div className="w-full flex-1 space-y-2"><Label title="Tokens" /><Input type="text" name="tokens" placeholder="0" value={pack.tokens || ""} onChange={(e) => onChange(index, "tokens", Number(e.target.value))} /></div>
              <button type="button" onClick={() => pack.name.trim() && Number.isSafeInteger(pack.tokens) && pack.tokens > 0 && Number.isFinite(pack.price) && pack.price >= 0 && setConfirmed((current) => [...current, index])} className="mt-6 flex h-6 items-center justify-center rounded bg-[#6637CF] px-3 text-sm text-white">Add</button>
              <button type="button" onClick={() => removePack(index)} className="mt-6" aria-label="Remove token pack">×</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={onAdd} className="w-full cursor-pointer rounded-lg bg-[#F9FAFB] px-4 py-2 text-start text-sm text-[#6637CF]">+ Add token pack</button>
      </div>
    </section>
  );
});

export default PartnerTokenPackFields;
