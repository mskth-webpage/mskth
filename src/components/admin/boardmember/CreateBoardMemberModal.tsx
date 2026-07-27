"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { useTranslations } from "next-intl";

import type {
  AdminBoardMember,
  BoardMemberModalInput,
} from "@/types/adminBoardMembers";


type Props = {
  initialValues?: AdminBoardMember;
  memberCount: number;
  onSave: (input: BoardMemberModalInput) => void;
  onCancel: () => void;
};


export default function CreateBoardMemberModal({
  initialValues,
  memberCount,
  onSave,
  onCancel,
}: Props) {
  const t = useTranslations("BoardMemberModal");

  const [name, setName] = useState(initialValues?.name ?? "");
  const [role_eng, setRoleEng] = useState(initialValues?.role_eng ?? "");
  const [role_sv, setRoleSv] = useState(initialValues?.role_sv ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [story_eng, setStoryEng] = useState(initialValues?.story_eng ?? "");
  const [story_sv, setStorySv] = useState(initialValues?.story_sv ?? "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues?.image_url ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };
  
  const maxOrder = initialValues ? memberCount : memberCount + 1; // For defaulting last order for new member, and setting a max order when editing  
  const [displayOrder, setDisplayOrder] = useState((initialValues?.display_order ?? maxOrder).toString());
  const [orderMessage, setOrderMessage] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  function validate() {
    const newErrors: Record<string,string> = {};

    if (!name.trim()) {newErrors.name = t('noNameError');}
    if (!role_eng.trim()) {newErrors.role_eng = t('noRoleErrorEng');}
    if (!role_sv.trim()) {newErrors.role_sv = t('noRoleErrorSv');}
    if (!email.trim()) {newErrors.email = t('noEmailError');}
    
    // Check if board email is valid: ends with @mskth.se
    if (email && !/^[^\s@]+@mskth\.se$/.test(email)) {newErrors.email = t('invalidEmailError');}

    if (!displayOrder) {newErrors.displayOrder = t('noDisplayOrderError');}
    if (displayOrder && Number(displayOrder) < 1) {newErrors.displayOrder = t('invalidDisplayOrderError');} 

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
        form.append("folder", "board_members");

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
        role_eng: role_eng.trim(),
        role_sv: role_sv.trim(),
        email: email.trim(),
        image_url,
        display_order: Number(displayOrder),
        story_eng: (story_eng ?? "").trim(), // avoid null exception
        story_sv: (story_sv ?? "").trim(),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-muted-foreground/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-xl bg-background shadow-lg border border-border">
        <div className="overflow-y-auto p-6 space-y-4">

          <h2 className="text-xl font-semibold"> {initialValues ? t('modalEditMemberTitle') : t('modalCreateNewMemberTitle')} </h2>

          {/* Name */}
          <Field label={t('name')} error={errors.name}>
            <input value={name} 
              onChange={(e) => setName(e.target.value)}
              className={inputClass(!!errors.name)}
            />
          </Field>

          {/* Role */}
          <Field label={t('roleEng')} error={errors.role_eng}>
            <input value={role_eng}
              onChange={(e) => setRoleEng(e.target.value)}
              className={inputClass(!!errors.role_eng)}
            />
          </Field>

          <Field label={t('roleSv')} error={errors.role_sv}>
            <input value={role_sv}
              onChange={(e) => setRoleSv(e.target.value)}
              className={inputClass(!!errors.role_sv)}
            />
          </Field>

          {/* Email */}
          <Field label={t('email')} error={errors.email}>
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass(!!errors.email)}
            />
          </Field>

          {/* Image */}
          <Field label={t('image')} error={errors.image}>
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
                <span className="text-xs">{t('uploadImage')}</span>
              </button>
            )}
          </Field>

          {/* Order */}
          <Field label={t('displayOrder')} error={errors.displayOrder}>
            <input type="number" min={1} max={maxOrder} value={displayOrder}
              onChange={(e) => {
                if (Number(e.target.value) > maxOrder) {
                  setDisplayOrder(maxOrder.toString());  // automatically change display of higher order to max
                  setOrderMessage(`${t('maxDisplayOrderMessage')} ${maxOrder}`);         
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

          {/* My story section */}
          <Field label={t('myStoryEng')}>
            <textarea 
              value={story_eng}
              onChange={(e) => setStoryEng(e.target.value)}
              rows={2}
              className={inputClass(false)}
            />
          </Field>

          <Field label={t('myStorySv')}>
            <textarea 
              value={story_sv}
              onChange={(e) => setStorySv(e.target.value)}
              rows={2}
              className={inputClass(false)}
            />
          </Field>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t border-border p-4">
          <Button variant="outline" className="hover:bg-destructive/10 hover:text-destructive" onClick={onCancel}>{t('cancel')}</Button>
          <Button onClick={handleSave} disabled={isSaving}> 
            {isSaving ? t('saving') : t('save')} 
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