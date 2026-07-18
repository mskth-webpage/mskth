"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { useTranslations } from "next-intl";

import type {
  AdminProjectGroup,
  ProjectGroupModalInput,
} from "@/types/projectGroups";

type Props = {
  initialValues?: AdminProjectGroup;
  memberCount: number; // reusing this prop name for group count to keep consistency
  onSave: (input: ProjectGroupModalInput) => void;
  onCancel: () => void;
};

export default function CreateProjectGroupModal({
  initialValues,
  memberCount,
  onSave,
  onCancel,
}: Props) {
  const t = useTranslations("ProjectGroupModal"); // You might need to add these translations

  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [contactEmail, setContactEmail] = useState(initialValues?.contact_email ?? "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues?.image_url ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };
  
  const maxOrder = initialValues ? memberCount : memberCount + 1; 
  const [displayOrder, setDisplayOrder] = useState((initialValues?.display_order ?? maxOrder).toString());
  const [orderMessage, setOrderMessage] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  function validate() {
    const newErrors: Record<string,string> = {};

    if (!name.trim()) {newErrors.name = t('noNameError') || "Name is required";}
    
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      newErrors.contactEmail = t('invalidEmailError') || "Invalid email format";
    }

    if (!displayOrder) {newErrors.displayOrder = t('noDisplayOrderError') || "Display order is required";}
    if (displayOrder && Number(displayOrder) < 1) {newErrors.displayOrder = t('invalidDisplayOrderError') || "Invalid display order";} 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;

    setIsSaving(true);

    let image_url: string | null = null;

    try{
      if (imageFile) {
        const form = new FormData();
        form.append("file", imageFile);
        form.append("folder", "project_groups");

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: form,
        });

        const json = await res.json();

        if (!res.ok) {
          setErrors({image: json.error ?? "Image upload failed",});
          return;
        }

        image_url = json.url;

      } else if (imagePreview) {
        image_url = imagePreview;
      }

      onSave({
        name: name.trim(),
        description: description.trim() || null,
        contact_email: contactEmail.trim() || null,
        image_url,
        display_order: Number(displayOrder),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-muted-foreground/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl bg-background shadow-lg border border-border">
        
        <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">

          <h2 className="text-xl font-semibold"> {initialValues ? t('modalEditTitle') || "Edit Project Group" : t('modalCreateNewTitle') || "Create Project Group"} </h2>

          {/* Name */}
          <Field label={t('name') || "Name"} error={errors.name}>
            <input value={name} 
              onChange={(e) => setName(e.target.value)}
              className={inputClass(!!errors.name)}
            />
          </Field>

          {/* Description */}
          <Field label={t('description') || "Description"} error={errors.description}>
            <textarea value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass(!!errors.description)}
            />
          </Field>

          {/* Email */}
          <Field label={t('contactEmail') || "Contact Email (optional)"} error={errors.contactEmail}>
            <input type="email" value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className={inputClass(!!errors.contactEmail)}
            />
          </Field>

          {/* Image */}
          <Field label={t('image') || "Image (optional)"} error={errors.image}>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange}/>

            {imagePreview ? (
              <div className="relative h-40 w-full overflow-hidden rounded-lg border border-border">
                <Image src={imagePreview} alt="preview" fill className="object-cover"/>

                <button type="button" 
                  onClick={() => {setImageFile(null); setImagePreview(null); }} 
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/50 text-background hover:bg-foreground/70">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button type="button" 
                onClick={() => fileRef.current?.click()}
                className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs">{t('uploadImage') || "Upload Image"}</span>
              </button>
            )}
          </Field>

          {/* Order */}
          <Field label={t('displayOrder') || "Display Order"} error={errors.displayOrder}>
            <input type="number" min={1} max={maxOrder} value={displayOrder}
              onChange={(e) => {
                if (Number(e.target.value) > maxOrder) {
                  setDisplayOrder(maxOrder.toString());
                  setOrderMessage(`${t('maxDisplayOrderMessage') || "Max display order is"} ${maxOrder}`);         
                } else {
                  setDisplayOrder(e.target.value)
                }
              }}
              className={inputClass(!!errors.displayOrder)}
            />

            {orderMessage && (
              <p className="mt-1 text-xs text-muted-foreground">{orderMessage}</p>
            )}
          </Field>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t border-border p-4">
          <Button variant="outline" className="hover:bg-destructive/10 hover:text-destructive" onClick={onCancel}>{t('cancel') || "Cancel"}</Button>
          <Button onClick={handleSave} disabled={isSaving}> 
            {isSaving ? t('saving') || "Saving..." : t('save') || "Save"} 
          </Button>
        </div>

      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-muted-foreground">{label}</label>
      
      {children}
      
      {error && (<p className="mt-1 text-xs text-destructive">{error}</p>)}
   
    </div>
  );
}

function inputClass(error: boolean) {
  return `w-full rounded border px-3 py-2 text-sm outline-none
    ${error ? "border-destructive" : "border-border"}
    focus:border-primary`;
}
