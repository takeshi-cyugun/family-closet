"use client";

import { useState, type FormEvent } from "react";
import { useSettingsLanguage } from "../_lib/LanguageContext";
import { updateFamilyName, updateMemberDisplayName } from "../../actions/settings";

type AccountInfoCardProps = {
  familyName: string;
  memberName: string;
  onFamilyNameChange: (name: string) => void;
  onMemberNameChange: (name: string) => void;
};

type Field = "family" | "member";

export function AccountInfoCard({
  familyName,
  memberName,
  onFamilyNameChange,
  onMemberNameChange,
}: AccountInfoCardProps) {
  const { t } = useSettingsLanguage();
  const [editing, setEditing] = useState<Field | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(field: Field, currentValue: string) {
    setEditing(field);
    setDraft(currentValue);
    setError(null);
  }

  function cancelEdit() {
    setEditing(null);
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;

    setSaving(true);
    setError(null);

    const result =
      editing === "family" ? await updateFamilyName(draft) : await updateMemberDisplayName(draft);

    setSaving(false);

    if (!result.success) {
      setError(result.error || t.accountInfo.updateError);
      return;
    }

    if (editing === "family") {
      onFamilyNameChange(draft.trim());
    } else {
      onMemberNameChange(draft.trim());
    }
    setEditing(null);
  }

  function renderRow(field: Field, label: string, value: string, placeholder: string) {
    const isEditing = editing === field;

    return (
      <div className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
        <dt className="shrink-0 text-ink-soft">{label}</dt>
        <dd className="flex-1">{isEditing ? (
          <form onSubmit={handleSubmit} className="flex flex-1 items-center justify-end gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              autoFocus
              className="w-full max-w-[60%] rounded-md border border-linen bg-white px-2 py-1 text-right text-sm text-ink"
            />
            <button
              type="submit"
              disabled={saving}
              className="shrink-0 rounded-md bg-espresso px-2.5 py-1 text-xs font-medium text-on-espresso disabled:opacity-50"
            >
              {saving ? t.accountInfo.saving : t.accountInfo.saveButton}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className="shrink-0 text-xs text-ink-soft underline disabled:opacity-50"
            >
              {t.accountInfo.cancelButton}
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-medium text-ink">{value}</span>
            <button
              type="button"
              onClick={() => startEdit(field, value)}
              className="text-xs text-ink-soft underline"
            >
              {t.accountInfo.editButton}
            </button>
          </div>
        )}</dd>
      </div>
    );
  }

  return (
    <section className="rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(60,47,43,0.08)]">
      <dl className="divide-y divide-linen text-sm">
        {renderRow("family", t.accountInfo.familyNameLabel, familyName, t.accountInfo.familyNamePlaceholder)}
        {renderRow("member", t.accountInfo.memberNameLabel, memberName, t.accountInfo.memberNamePlaceholder)}
      </dl>
      {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </section>
  );
}
