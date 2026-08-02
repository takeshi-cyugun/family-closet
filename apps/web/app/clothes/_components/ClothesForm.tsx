"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PhotoPicker } from "./PhotoPicker";
import {
  SEASONS,
  SIZES,
  STATUSES,
  addClothesItem,
  mockAnalyzeImage,
  mockMembers,
  updateClothesItem,
} from "../../_lib/clothes";
import type { ClothesItem, ClothesStatus, Season, Size } from "../../_lib/clothes";

type ClothesFormProps = {
  mode: "new" | "edit";
  initialItem?: ClothesItem;
};

type Errors = Partial<Record<"photo" | "name", string>>;

function SelectField<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ClothesForm({ mode, initialItem }: ClothesFormProps) {
  const router = useRouter();

  const [photoUrl, setPhotoUrl] = useState<string | null>(initialItem?.photoDataUrl ?? null);
  const [rotation, setRotation] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const [name, setName] = useState(initialItem?.name ?? "");
  const [category, setCategory] = useState(initialItem?.category ?? "");
  const [ownerId, setOwnerId] = useState(initialItem?.ownerId ?? mockMembers[0].id);
  const [status, setStatus] = useState<ClothesStatus>(initialItem?.status ?? "使用中");
  const [season, setSeason] = useState<Season>(initialItem?.season ?? "通年");
  const [size, setSize] = useState<Size>(initialItem?.size ?? "FREE");
  const [memo, setMemo] = useState(initialItem?.memo ?? "");

  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  async function handleSelectFile(file: File) {
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setRotation(0);
    setErrors((prev) => ({ ...prev, photo: undefined }));

    setAnalyzing(true);
    const result = await mockAnalyzeImage();
    setCategory(result.category);
    setAnalyzing(false);
  }

  function handleRotate() {
    setRotation((prev) => (prev + 90) % 360);
  }

  function handleRemovePhoto() {
    setPhotoUrl(null);
    setRotation(0);
  }

  function validate(): Errors {
    const next: Errors = {};
    if (mode === "new" && !photoUrl) next.photo = "写真を選択してください";
    if (!name.trim()) next.name = "名前を入力してください";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const payload = {
      name: name.trim(),
      category: category.trim(),
      ownerId,
      status,
      season,
      size,
      memo: memo.trim() || undefined,
      photoDataUrl: photoUrl ?? undefined,
    };

    if (mode === "edit" && initialItem) {
      updateClothesItem(initialItem.id, payload);
    } else {
      addClothesItem(payload);
    }

    setSaving(false);
    router.push("/dashboard");
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div>
        <PhotoPicker
          photoUrl={photoUrl}
          rotation={rotation}
          analyzing={analyzing}
          onSelectFile={handleSelectFile}
          onRotate={handleRotate}
          onRemove={handleRemovePhoto}
        />
        {errors.photo && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.photo}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          名前
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: ダウンコート"
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
        />
        {errors.name && <p className="text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="text-sm font-medium">
          カテゴリ
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="例: コート"
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="owner" className="text-sm font-medium">
          オーナー
        </label>
        <select
          id="owner"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
        >
          {mockMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <SelectField id="status" label="ステータス" value={status} options={STATUSES} onChange={setStatus} />
      <SelectField id="season" label="シーズン" value={season} options={SEASONS} onChange={setSeason} />
      <SelectField id="size" label="サイズ" value={size} options={SIZES} onChange={setSize} />

      <div className="flex flex-col gap-1">
        <label htmlFor="memo" className="text-sm font-medium">
          メモ
        </label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
        />
      </div>

      <button
        type="submit"
        disabled={saving || analyzing}
        className="mt-2 rounded-md bg-black py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {saving ? "保存中..." : "保存する"}
      </button>
    </form>
  );
}
