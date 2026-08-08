"use client";

import { useState } from "react";

export function CopyableId({ fullId, digits = 8 }: { fullId: string; digits?: number }) {
  const [copied, setCopied] = useState(false);
  const shortId = fullId.slice(-digits);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(fullId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-xs" title={fullId}>
        {shortId}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        title="IDをコピー"
        aria-label="IDをコピー"
        className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-emerald-600">
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875a3.75 3.75 0 013.75 3.75v.375c0 1.036-.84 1.875-1.875 1.875h-7.5A1.875 1.875 0 019.75 13.125v-9.75z" />
            <path d="M6 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3v-1.5a.75.75 0 00-1.5 0v1.5a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5V8.25A1.5 1.5 0 016 6.75h1.5a.75.75 0 000-1.5H6z" />
          </svg>
        )}
      </button>
    </div>
  );
}
