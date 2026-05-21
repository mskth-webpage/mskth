"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type Props = {
  variant: "publish" | "unpublish";
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmation dialog shown before publishing or unpublishing an event. */
export default function PublishConfirmDialog({ variant, onConfirm, onCancel }: Props) {
  const t = useTranslations("AdminUpcomingEvents");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-base font-semibold text-foreground">
          {variant === "publish" ? t("publishConfirm") : t("unpublishConfirm")}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button onClick={onConfirm}>
            {variant === "publish" ? t("publishAction") : t("unpublishAction")}
          </Button>
          <Button variant="outline" onClick={onCancel}>{t("cancelAction")}</Button>
        </div>
      </div>
    </div>
  );
}
