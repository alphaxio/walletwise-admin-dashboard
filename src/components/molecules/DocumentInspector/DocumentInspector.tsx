'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { safeDocumentUrl } from '@/features/finance/helpers/records';
export default function DocumentInspector({ label, url }: {
    label: string;
    url: unknown;
}) {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const container = useRef<HTMLDivElement>(null);
    const source = safeDocumentUrl(url);
    return <section className="space-y-3"><h3 className="font-medium">{label}</h3>{source ? <><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setZoom(Math.min(zoom + .25, 3))}>Zoom in</Button><Button variant="outline" onClick={() => setZoom(Math.max(zoom - .25, .5))}>Zoom out</Button><Button variant="outline" onClick={() => setRotation(rotation + 90)}>Rotate</Button><Button variant="outline" onClick={() => { container.current?.requestFullscreen?.().catch(() => undefined); }}>Full screen</Button><a href={source} target="_blank" rel="noreferrer" className="underline p-2">Open original / PDF</a></div><div ref={container} className="h-80 overflow-auto rounded border bg-gray-100 dark:bg-gray-800"><Image unoptimized width={1200} height={900} src={source} alt={label} className="mx-auto max-h-full object-contain" style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}/></div></> : <p>Document unavailable</p>}</section>;
}
