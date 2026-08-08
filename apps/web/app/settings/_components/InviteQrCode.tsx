"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type InviteQrCodeProps = {
  url: string;
  alt: string;
};

export function InviteQrCode({ url, alt }: InviteQrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, { width: 240, margin: 1 }).then((result) => {
      if (!cancelled) setDataUrl(result);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!dataUrl) {
    return <div className="h-60 w-60 animate-pulse rounded-md bg-sand" />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={dataUrl} alt={alt} width={240} height={240} className="rounded-md" />;
}
