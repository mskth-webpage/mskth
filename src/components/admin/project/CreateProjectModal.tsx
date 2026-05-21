"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Project } from "@/view/admin/project/AdminProjectsView";

type Props = {
  initialValues?: Project | null;
  statusTarget?: "draft" | "archived" | "published" | null;
  onSave: (projectData: Omit<Project, "id">, imageFile: File | null) => void;
  onUpdate: (project: Project, imageFile: File | null) => void;
  onCancel: () => void;
};

const scallop: React.CSSProperties = {
  WebkitMaskImage: `radial-gradient(circle at 10px 0, transparent 9px, black 10px)`,
  WebkitMaskSize: "20px 100%",
  WebkitMaskRepeat: "repeat-x",
  WebkitMaskPosition: "top",
  maskImage: `radial-gradient(circle at 10px 0, transparent 9px, black 10px)`,
  maskSize: "20px 100%",
  maskRepeat: "repeat-x",
  maskPosition: "top",
};

export default function CreateProjectModal({ initialValues, statusTarget, onSave, onUpdate, onCancel }: Props) {
  const t = useTranslations("AdminProjects");
  
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [groupLabel, setGroupLabel] = useState(initialValues?.group_label ?? "");
  const [members, setMembers] = useState(initialValues?.members ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues?.image_url ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSave = () => {
    if (!title) return;
    
    if (initialValues) {
      onUpdate({
        ...initialValues,
        title,
        description,
        group_label: groupLabel,
        members,
        status: initialValues.status,
        image_url: imagePreview || "",
      }, imageFile);
    } else {
      if (!statusTarget) return;
      onSave({
        title,
        description,
        group_label: groupLabel,
        members,
        status: statusTarget,
        image_url: imagePreview || "",
      }, imageFile);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-muted-foreground/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-3 text-lg font-semibold text-foreground">
          {initialValues ? t("editTitle") : t("addNew")}
        </p>

        {/* Ticket-shaped form */}
        <div className="bg-background" style={scallop}>
          <div className="space-y-3 px-5 pb-4 pt-6">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("project.name")}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("project.description")}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full resize-none rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("project.groupLabel")}</label>
              <input
                type="text"
                value={groupLabel}
                onChange={(e) => setGroupLabel(e.target.value)}
                className="w-full rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("project.members")}</label>
              <input
                type="text"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                className="w-full rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("project.imageOptional")}</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border">
                  <Image src={imagePreview} alt="preview" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/50 text-background hover:bg-foreground/70 transition-colors"
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
                  <span className="text-xs">{t("project.uploadImage")}</span>
                </button>
              )}
            </div>
          </div>

          {/* Dashed separator */}
          <div className="mx-4 border-t border-dashed border-border" />
          <div className="h-4" />
        </div>

        {/* Actions outside ticket */}
        <div className="mt-4 flex justify-between">
          <Button onClick={handleSave} disabled={!title}>
            {t("save")}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {t("cancelAction")}
          </Button>
        </div>
      </div>
    </div>
  );
}
