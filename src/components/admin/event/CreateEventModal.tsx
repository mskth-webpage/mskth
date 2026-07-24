"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import TimePicker from "@/components/admin/event/TimePicker";
import type {
  AdminEvent,
  Audience,
  CreateEventInput,
  Language,
} from "@/types/adminEvent";

function toLocalDate(iso: string) {
  const date = new Date(iso);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function toLocalTime(iso: string) {
  const date = new Date(iso);

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

type EventType = "upcoming" | "previous";

type Props = {
  initialValues?: AdminEvent;
  onSave: (input: CreateEventInput) => Promise<void>;
  onCancel: () => void;
  defaultType?: EventType;
};

const scallop: React.CSSProperties = {
  WebkitMaskImage:
    "radial-gradient(circle at 10px 0, transparent 9px, black 10px)",
  WebkitMaskSize: "20px 100%",
  WebkitMaskRepeat: "repeat-x",
  WebkitMaskPosition: "top",
  maskImage:
    "radial-gradient(circle at 10px 0, transparent 9px, black 10px)",
  maskSize: "20px 100%",
  maskRepeat: "repeat-x",
  maskPosition: "top",
};

const todayStr = new Date().toISOString().slice(0, 10);

const yesterdayStr = new Date(Date.now() - 86_400_000)
  .toISOString()
  .slice(0, 10);

/**
 * Modal form for creating or editing an event.
 * The header and action buttons remain visible while the form scrolls.
 */
export default function CreateEventModal({
  initialValues,
  onSave,
  onCancel,
  defaultType = "upcoming",
}: Props) {
  const t = useTranslations("AdminUpcomingEvents");

  const [eventType, setEventType] = useState<EventType>(defaultType);
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );

  const [startDate, setStartDate] = useState(
    initialValues?.start_at ? toLocalDate(initialValues.start_at) : "",
  );

  const [startTime, setStartTime] = useState(
    initialValues?.start_at ? toLocalTime(initialValues.start_at) : "00:00",
  );

  const [endDate, setEndDate] = useState(
    initialValues?.end_at ? toLocalDate(initialValues.end_at) : "",
  );

  const [endTime, setEndTime] = useState(
    initialValues?.end_at ? toLocalTime(initialValues.end_at) : "00:00",
  );

  const [regClosesDate, setRegClosesDate] = useState(
    initialValues?.registration_closes_at
      ? toLocalDate(initialValues.registration_closes_at)
      : "",
  );

  const [regClosesTime, setRegClosesTime] = useState(
    initialValues?.registration_closes_at
      ? toLocalTime(initialValues.registration_closes_at)
      : "23:59",
  );

  const [location, setLocation] = useState(
    initialValues?.location ?? "",
  );

  const [maxParticipants, setMaxParticipants] = useState(
    initialValues?.max_participants?.toString() ?? "",
  );

  const [audience, setAudience] = useState<Audience>(
    initialValues?.audience ?? "all",
  );

  const [language, setLanguage] = useState<Language>(
    initialValues?.language ?? "both",
  );

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.image_url ?? null,
  );

  const [saving, setSaving] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const minDate = eventType === "upcoming" ? todayStr : undefined;
  const maxDate = eventType === "previous" ? yesterdayStr : undefined;

  const handleTypeChange = (type: EventType) => {
    setEventType(type);
    setStartDate("");
    setEndDate("");
    setRegClosesDate("");
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!title || !startDate) {
      return;
    }

    setSaving(true);

    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("folder", "events");

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Image upload failed");
        }

        const result = (await response.json()) as {
          url?: string;
        };

        imageUrl = result.url;
      } else if (imagePreview) {
        imageUrl = imagePreview;
      }

      await onSave({
        title,
        description,
        start_at: new Date(
          `${startDate}T${startTime}`,
        ).toISOString(),
        end_at: new Date(
          `${endDate || startDate}T${endTime}`,
        ).toISOString(),
        image_url: imageUrl,
        location: location || undefined,
        max_participants: maxParticipants
          ? Number(maxParticipants)
          : undefined,
        audience,
        language,
        registration_closes_at: regClosesDate
          ? new Date(
              `${regClosesDate}T${regClosesTime}`,
            ).toISOString()
          : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-muted-foreground/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-sm flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Fixed modal header */}
        <div className="shrink-0 pb-3">
          <p
            id="event-modal-title"
            className="text-lg font-semibold text-foreground"
          >
            {initialValues ? t("editTitle") : t("createTitle")}
          </p>
        </div>

        {/* Scrollable form */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <div
            className="bg-background"
            style={scallop}
          >
            <div className="space-y-3 px-5 pb-4 pt-6">
              {!initialValues && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {t("eventTypeLabel")}
                  </label>

                  <div className="flex overflow-hidden rounded border border-border text-sm">
                    {(["upcoming", "previous"] as EventType[]).map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleTypeChange(type)}
                          className={`flex-1 py-1.5 font-medium transition-colors ${
                            eventType === type
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {t(
                            type === "upcoming"
                              ? "eventTypeUpcoming"
                              : "eventTypePrevious",
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t("titleLabel")}
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  className="w-full rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t("descriptionLabel")}
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={4}
                  className="w-full resize-y rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t("locationLabel")}
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="e.g. KTH Campus, Room D3"
                  className="w-full rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {t("maxParticipantsLabel")}
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={maxParticipants}
                    onChange={(event) =>
                      setMaxParticipants(event.target.value)
                    }
                    placeholder="e.g. 50"
                    className="w-full rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {t("openForLabel")}
                  </label>

                  <select
                    value={audience}
                    onChange={(event) =>
                      setAudience(event.target.value as Audience)
                    }
                    className="w-full rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="all">
                      {t("audienceAll")}
                    </option>

                    <option value="brothers">
                      {t("audienceBrothers")}
                    </option>

                    <option value="sisters">
                      {t("audienceSisters")}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t("thumbnailLabel")}
                </label>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {imagePreview ? (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border">
                    <Image
                      src={imagePreview}
                      alt="Event thumbnail preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 384px"
                      className="object-cover"
                    />

                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={removeImage}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/50 text-background transition-colors hover:bg-foreground/70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <ImagePlus className="h-6 w-6" />

                    <span className="text-xs">
                      {t("uploadImage")}
                    </span>
                  </button>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t("startDateLabel")}
                </label>

                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    min={minDate}
                    max={maxDate}
                    onChange={(event) =>
                      setStartDate(event.target.value)
                    }
                    className="min-w-0 flex-1 rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />

                  <TimePicker
                    value={startTime}
                    onChange={setStartTime}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t("endDateLabel")}
                </label>

                <div className="flex gap-2">
                  <input
                    type="date"
                    value={endDate}
                    min={minDate}
                    max={maxDate}
                    onChange={(event) =>
                      setEndDate(event.target.value)
                    }
                    className="min-w-0 flex-1 rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />

                  <TimePicker
                    value={endTime}
                    onChange={setEndTime}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t("registrationClosesLabel")}{" "}
                  <span className="text-muted-foreground/60">
                    ({t("optional")})
                  </span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="date"
                    value={regClosesDate}
                    min={minDate}
                    max={startDate || maxDate}
                    onChange={(event) =>
                      setRegClosesDate(event.target.value)
                    }
                    className="min-w-0 flex-1 rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />

                  <TimePicker
                    value={regClosesTime}
                    onChange={setRegClosesTime}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t("languageLabel")}
                </label>

                <select
                  value={language}
                  onChange={(event) =>
                    setLanguage(event.target.value as Language)
                  }
                  className="w-full rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
                >
                  <option value="both">
                    {t("languageBoth")}
                  </option>

                  <option value="en">
                    {t("languageEn")}
                  </option>

                  <option value="sv">
                    {t("languageSv")}
                  </option>
                </select>
              </div>
            </div>

            <div className="mx-4 border-t border-dashed border-border" />
            <div className="h-4" />
          </div>
        </div>

        {/* Fixed modal footer */}
        <div className="mt-4 flex shrink-0 items-center justify-between">
          <Button
            onClick={handleSave}
            disabled={saving || !title || !startDate}
          >
            {saving ? t("saving") : t("save")}
          </Button>

          <Button
            variant="outline"
            onClick={onCancel}
          >
            {t("cancelAction")}
          </Button>
        </div>
      </div>
    </div>
  );
}