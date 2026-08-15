"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function ticketQrPayload(ticketCode: string) {
  return `launchbharat:ticket:${ticketCode.trim().toUpperCase()}`;
}

export default function TicketQr({
  ticketCode,
  size = 176,
}: {
  ticketCode: string;
  size?: number;
}) {
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void QRCode.toDataURL(ticketQrPayload(ticketCode), {
      errorCorrectionLevel: "M",
      margin: 2,
      width: size,
      color: { dark: "#0b1220", light: "#ffffff" },
    }).then((dataUrl) => {
      if (!cancelled) setSource(dataUrl);
    });

    return () => {
      cancelled = true;
    };
  }, [size, ticketCode]);

  if (!source) {
    return (
      <div
        aria-label="Generating ticket QR code"
        className="animate-pulse rounded-xl bg-slate-100"
        style={{ height: size, width: size }}
      />
    );
  }

  return (
    <Image
      unoptimized
      src={source}
      width={size}
      height={size}
      alt={`QR code for ticket ${ticketCode}`}
      className="rounded-xl border border-line bg-white"
    />
  );
}
