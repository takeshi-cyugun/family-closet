"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { PhotoPicker } from "./PhotoPicker";
import { uploadClothesImage } from "../../actions/uploadImage";
import { ensureGuestFamily } from "../../actions/ensureGuestFamily";
import { getFamilyMembers } from "../../actions/members";
import { getSettingsData } from "../../actions/settings";
import { createClothes, deleteClothes, updateClothes } from "../../actions/clothes";
import { SEASONS, SIZES, STATUSES, mapUiStatusToDbStatus, mapAiSeasonToSeason } from "../../_lib/clothes";
import type { ClothesItem, ClothesStatus, Member, Season, Size } from "../../_lib/clothes";
import { useLanguage } from "../../_lib/LanguageContext";
import { getClothesFormDictionary } from "../_lib/i18n";
import { getDashboardDictionary } from "../../dashboard/_lib/i18n";

type ClothesFormProps = {
  mode: "new" | "edit";
  initialItem?: ClothesItem;
  compact?: boolean;
};

type Errors = Partial<Record<"photo" | "name" | "color", string>>;

function SelectField<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  renderOption,
}: {
  id: string;
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  renderOption?: (option: T) => string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {renderOption ? renderOption(option) : option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ClothesForm({ mode, initialItem, compact }: ClothesFormProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const t = getClothesFormDictionary(language);
  const dashboardT = getDashboardDictionary(language);

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

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [familyId, setFamilyId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isGuest, setIsGuest] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureGuestFamily(language).then(async (session) => {
      const [familyMembers, settings] = await Promise.all([getFamilyMembers(), getSettingsData()]);
      if (cancelled) return;
      setFamilyId(session.familyId);
      setMembers(familyMembers);
      setIsGuest(settings?.isGuest ?? false);
      setOwnerId((prev) => prev || familyMembers[0]?.id || session.memberId);
    });
    return () => {
      cancelled = true;
    };
    // マウント時点の言語だけを初回のゲストファミリー作成に使う（言語切替のたびに再作成/再取得はしない）
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const analyzeFormData = new FormData();
    analyzeFormData.set("image", file);
    analyzeFormData.set("language", language);

    const [analyzeResult, uploadResult] = await Promise.all([
      fetch("/api/analyze-image", { method: "POST", body: analyzeFormData })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
      uploadClothesImage(formData),
    ]);

    if (analyzeResult?.success) {
      if (analyzeResult.name) setName(analyzeResult.name);
      if (analyzeResult.category) setCategory(analyzeResult.category);
      if (analyzeResult.color) setColor(analyzeResult.color);
      if (analyzeResult.season) setSeason(mapAiSeasonToSeason(analyzeResult.season, dashboardT.seasons));
    }
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
    if (mode === "new" && !photoUrl) next.photo = t.errors.photoRequired;
    if (!name.trim()) next.name = t.errors.nameRequired;
    if (mode === "new" && !color.trim()) next.color = t.errors.colorRequired;
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
        setSubmitError(t.errors.uploadIncomplete);
        setSaving(false);
        return;
      }

      const session = await ensureGuestFamily(language);
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
        if ("reason" in result && result.reason === "item_limit") {
          setShowLimitModal(true);
        } else {
          setSubmitError(result.error);
        }
        return;
      }
      router.push("/dashboard");
      return;
    }

    if (!initialItem) {
      setSaving(false);
      return;
    }

    const session = familyId ? { familyId } : await ensureGuestFamily(language);
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

  async function handleDelete() {
    if (!initialItem) return;
    setDeleting(true);
    const session = familyId ? { familyId } : await ensureGuestFamily(language);
    const result = await deleteClothes(initialItem.id, session.familyId);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setDeleting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-ink">{t.photo.label}</label>
        <PhotoPicker
          photoUrl={photoUrl}
          rotation={rotation}
          analyzing={analyzing}
          onSelectFile={handleSelectFile}
          onRotate={handleRotate}
          onRemove={mode === "new" ? handleRemovePhoto : undefined}
          labels={t.photo}
          compact={compact}
        />
        {errors.photo && <p className="text-xs text-red-600 dark:text-red-400">{errors.photo}</p>}
        {uploadError && <p className="text-xs text-red-600 dark:text-red-400">{uploadError}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-ink">
          {t.fields.name.label}
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.fields.name.placeholder}
          className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
        />
        {errors.name && <p className="text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="text-sm font-medium text-ink">
          {t.fields.category.label}
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder={t.fields.category.placeholder}
          className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
        />
      </div>

      <SelectField id="size" label={t.fields.size} value={size} options={SIZES} onChange={setSize} />

      <div className="flex flex-col gap-1">
        <label htmlFor="color" className="text-sm font-medium text-ink">
          {t.fields.color.label}
        </label>
        <input
          id="color"
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder={t.fields.color.placeholder}
          className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
        />
        {errors.color && <p className="text-xs text-red-600 dark:text-red-400">{errors.color}</p>}
      </div>

      <SelectField
        id="season"
        label={t.fields.season}
        value={season}
        options={SEASONS}
        onChange={setSeason}
        renderOption={(option) => dashboardT.seasons[option]}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="owner" className="text-sm font-medium text-ink">
          {t.fields.owner}
        </label>
        <select
          id="owner"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
        >
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <SelectField
        id="status"
        label={t.fields.status}
        value={status}
        options={STATUSES}
        onChange={setStatus}
        renderOption={(option) => dashboardT.statuses[option]}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="memo" className="text-sm font-medium text-ink">
          {t.fields.memo}
        </label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
        />
      </div>

      {submitError && <p className="text-xs text-red-600 dark:text-red-400">{submitError}</p>}

      <button
        type="submit"
        disabled={saving || analyzing || uploading}
        className="mt-2 rounded-md bg-espresso py-3 text-sm font-semibold text-on-espresso disabled:opacity-50"
      >
        {saving
          ? mode === "new"
            ? t.submit.registering
            : t.submit.saving
          : uploading
            ? t.submit.uploading
            : mode === "new"
              ? t.submit.register
              : t.submit.save}
      </button>

      {mode === "edit" && initialItem && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="text-xs text-red-600 underline-offset-2 hover:underline dark:text-red-400"
          >
            {t.delete.link}
          </button>
        </div>
      )}

      {confirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={t.delete.cancel}
            className="absolute inset-0 bg-black/60"
            onClick={() => setConfirmingDelete(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-cream p-5 text-left shadow-2xl">
            <p className="mb-4 text-sm text-red-700 dark:text-red-300">{t.delete.confirm}</p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmingDelete(false)}
                className="flex-1 rounded-md border border-linen py-2 text-sm text-ink disabled:opacity-50"
              >
                {t.delete.cancel}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 rounded-md bg-red-600 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {deleting ? t.delete.deleting : t.delete.confirmButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={t.limitModal.close}
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowLimitModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-cream p-6 text-center shadow-2xl">
            <h2 className="font-serif text-lg font-bold text-ink">{t.limitModal.title}</h2>
            <p className="mt-3 text-sm text-ink-soft">
              {isGuest ? t.limitModal.descGuest : t.limitModal.descMember}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href={isGuest ? "/signup" : "/settings"}
                className="rounded-md bg-espresso py-2.5 text-center text-sm font-semibold text-on-espresso"
              >
                {isGuest ? t.limitModal.ctaGuest : t.limitModal.ctaMember}
              </Link>
              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="rounded-md border border-linen py-2.5 text-sm text-ink"
              >
                {t.limitModal.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
