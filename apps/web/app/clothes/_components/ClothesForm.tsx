"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { PhotoPicker } from "./PhotoPicker";
import { uploadClothesImage } from "../../actions/uploadImage";
import { ensureGuestFamily } from "../../actions/ensureGuestFamily";
import { getFamilyMembers } from "../../actions/members";
import { createClothes, updateClothes } from "../../actions/clothes";
import { SEASONS, SIZES, STATUSES, mapUiStatusToDbStatus, mockAnalyzeImage } from "../../_lib/clothes";
import type { ClothesItem, ClothesStatus, Member, Season, Size } from "../../_lib/clothes";

type ClothesFormProps = {
  mode: "new" | "edit";
  initialItem?: ClothesItem;
};

type Errors = Partial<Record<"photo" | "name" | "color", string>>;

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
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [name, setName] = useState(initialItem?.name ?? "");
  const [category, setCategory] = useState(initialItem?.category ?? "");
  const [color, setColor] = useState(initialItem?.color ?? "");
  const [ownerId, setOwnerId] = useState(initialItem?.ownerId ?? "");
  const [status, setStatus] = useState<ClothesStatus>(initialItem?.status ?? "使用中");
  const [season, setSeason] = useState<Season>(initialItem?.season ?? "通年");
  const [size, setSize] = useState<Size>(initialItem?.size ?? "FREE");
  const [memo, setMemo] = useState(initialItem?.memo ?? "");

  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [familyId, setFamilyId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    let cancelled = false;
    ensureGuestFamily().then(async (session) => {
      const familyMembers = await getFamilyMembers();
      if (cancelled) return;
      setFamilyId(session.familyId);
      setMembers(familyMembers);
      setOwnerId((prev) => prev || familyMembers[0]?.id || session.memberId);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSelectFile(file: File) {
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setUploadedPhotoUrl(null);
    setUploadError(null);
    setRotation(0);
    setErrors((prev) => ({ ...prev, photo: undefined }));

    setAnalyzing(true);
    setUploading(true);

    const formData = new FormData();
    formData.set("file", file);

    const [analyzeResult, uploadResult] = await Promise.all([
      mockAnalyzeImage(),
      uploadClothesImage(formData),
    ]);

    setCategory(analyzeResult.category);
    setAnalyzing(false);

    if (uploadResult.success) {
      setUploadedPhotoUrl(uploadResult.url);
    } else {
      setUploadError(uploadResult.error);
    }
    setUploading(false);
  }

  function handleRotate() {
    setRotation((prev) => (prev + 90) % 360);
  }

  function handleRemovePhoto() {
    setPhotoUrl(null);
    setUploadedPhotoUrl(null);
    setUploadError(null);
    setRotation(0);
  }

  function validate(): Errors {
    const next: Errors = {};
    if (mode === "new" && !photoUrl) next.photo = "写真を選択してください";
    if (!name.trim()) next.name = "名前を入力してください";
    if (mode === "new" && !color.trim()) next.color = "色を入力してください";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError(null);
    setSaving(true);

    if (mode === "new") {
      if (!uploadedPhotoUrl) {
        setSubmitError("写真のアップロードが完了していません。もう一度写真を選択してください。");
        setSaving(false);
        return;
      }

      const session = await ensureGuestFamily();
      const result = await createClothes({
        familyId: session.familyId,
        ownerMemberId: ownerId || session.memberId,
        name: name.trim(),
        imageUrl: uploadedPhotoUrl,
        category: category.trim(),
        color: color.trim(),
        size,
        season,
        status: mapUiStatusToDbStatus(status),
        memo: memo.trim() || undefined,
      });

      setSaving(false);
      if (!result.success) {
        setSubmitError(result.error);
        return;
      }
      router.push("/dashboard");
      return;
    }

    if (!initialItem) {
      setSaving(false);
      return;
    }

    const session = familyId ? { familyId } : await ensureGuestFamily();
    const result = await updateClothes(initialItem.id, session.familyId, {
      name: name.trim(),
      category: category.trim(),
      color: color.trim(),
      size,
      season,
      status: mapUiStatusToDbStatus(status),
      memo: memo.trim() || undefined,
      imageUrl: uploadedPhotoUrl ?? undefined,
    });

    setSaving(false);
    if (!result.success) {
      setSubmitError(result.error);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">画像</label>
        <PhotoPicker
          photoUrl={photoUrl}
          rotation={rotation}
          analyzing={analyzing}
          onSelectFile={handleSelectFile}
          onRotate={handleRotate}
          onRemove={handleRemovePhoto}
        />
        {errors.photo && <p className="text-xs text-red-600 dark:text-red-400">{errors.photo}</p>}
        {uploadError && <p className="text-xs text-red-600 dark:text-red-400">{uploadError}</p>}
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

      <SelectField id="size" label="サイズ" value={size} options={SIZES} onChange={setSize} />

      <div className="flex flex-col gap-1">
        <label htmlFor="color" className="text-sm font-medium">
          色
        </label>
        <input
          id="color"
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="例: ネイビー"
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
        />
        {errors.color && <p className="text-xs text-red-600 dark:text-red-400">{errors.color}</p>}
      </div>

      <SelectField id="season" label="シーズン" value={season} options={SEASONS} onChange={setSeason} />

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
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <SelectField id="status" label="ステータス" value={status} options={STATUSES} onChange={setStatus} />

      <div className="flex flex-col gap-1">
        <label htmlFor="memo" className="text-sm font-medium">
          メモ（説明、収納場所）
        </label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
        />
      </div>

      {submitError && <p className="text-xs text-red-600 dark:text-red-400">{submitError}</p>}

      <button
        type="submit"
        disabled={saving || analyzing || uploading}
        className="mt-2 rounded-md bg-black py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {saving
          ? mode === "new"
            ? "登録中..."
            : "保存中..."
          : uploading
            ? "写真をアップロード中..."
            : mode === "new"
              ? "登録する"
              : "保存する"}
      </button>
    </form>
  );
}
