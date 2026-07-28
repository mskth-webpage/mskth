"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmation dialog shown before publishing changes to board members. */
export default function PublishConfirmDialog({
  onConfirm,
  onCancel,
}: Props) {
  const t = useTranslations("AdminBoardMembersView");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-base font-semibold text-foreground">{t("publishConfirm")}</p>

        <div className="mt-6 flex justify-between gap-4">
          <Button variant="outline" onClick={onCancel}>
            {t("cancelAction")}
          </Button>

          <Button onClick={onConfirm}>
            {t("publishAction")}
          </Button>
        </div>

      </div>
    </div>
  );
}