"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type Props = {
  memberName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Deletion confirmation dialog shown before deleting a boardmember */
export default function DeleteMemberConfirmDialog({
  memberName,
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
        <p className="text-base font-semibold text-foreground">
          {t("deleteConfirm")}{" "}<span className="font-bold italic">{memberName}</span> ?
        </p>

        <div className="mt-6 flex justify-between gap-4">
          <Button variant="outline" onClick={onCancel}>
            {t("cancelAction")} 
          </Button>

          <Button variant="destructive" onClick={onConfirm}>
            {t("deleteAction")}
          </Button>
        </div>
        
      </div>
    </div>
  );
}