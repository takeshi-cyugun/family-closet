"use client";

import { useRef } from "react";
import type { ClothesFormDictionary } from "../_lib/i18n";

type PhotoPickerProps = {
  photoUrl: string | null;
  rotation: number;
  analyzing: boolean;
  onSelectFile: (file: File) => void;
  onRotate: () => void;
  onRemove: () => void;
  labels: ClothesFormDictionary["photo"];
};

export function PhotoPicker({
  photoUrl,
  rotation,
  analyzing,
  onSelectFile,
  onRotate,
  onRemove,
  labels,
}: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelectFile(file);
          e.target.value = "";
        }}
      />

      {photoUrl ? (
        <div className="flex justify-center">
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={labels.previewAlt}
              className="block max-h-[50vh] w-auto max-w-full rounded-lg transition-transform"
              style={{ transform: `rotate(${rotation}deg)` }}
            />

            {analyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-white/80 dark:bg-black/70">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{labels.analyzing}</p>
              </div>
            )}

            {!analyzing && (
              <>
                <button
                  type="button"
                  onClick={onRotate}
                  aria-label={labels.rotate}
                  className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-base text-white"
                >
                  ⟳
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  aria-label={labels.remove}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-base text-white"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-linen bg-white px-4 py-3 text-ink-soft"
          >
            <span className="text-xl">📷</span>
            <span className="text-sm">{labels.selectCta}</span>
          </button>
        </div>
      )}
    </div>
  );
}
