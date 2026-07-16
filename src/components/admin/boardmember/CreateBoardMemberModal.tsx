"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

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

  const [name, setName] = useState(initialValues?.name ?? "");
  const [role, setRole] = useState(initialValues?.role ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");

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
  
  const [errors, setErrors] = useState<Record<string,string>>({});

  function validate() {
    const newErrors: Record<string,string> = {};

    if (!name.trim()) {newErrors.name = "Name is required";} // translate
    if (!role.trim()) {newErrors.role = "Role is required";}
    if (!email.trim()) {newErrors.email = "Email is required";}
    
    // Check if board email is valid: ends with @mskth.se
    if (email && !/^[^\s@]+@mskth\.se$/.test(email)) {newErrors.email = "Invalid email. Must be of type [role]@mskth.se";}

    if (!displayOrder) {newErrors.displayOrder = "Display order is required";}
    if (displayOrder && Number(displayOrder) < 1) {newErrors.displayOrder = "Display order must be at least 1";} 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;

    let image_url: string | null = null;

    if (imageFile) {
      const form = new FormData();
      form.append("file", imageFile);
      form.append("bucket", "board_members");

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
      role: role.trim(),
      email: email.trim(),
      image_url,
      display_order: Number(displayOrder),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-muted-foreground/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl bg-background shadow-lg border border-border">
        
        <div className="p-6 space-y-4">

          <h2 className="text-xl font-semibold"> {initialValues ? "Edit board member" : "Create board member"} </h2>

          {/* Name */}
          <Field label="Name" error={errors.name}>
            <input value={name} 
              onChange={(e) => setName(e.target.value)}
              className={inputClass(!!errors.name)}
            />
          </Field>

          {/* Role */}
          <Field label="Role" error={errors.role}>
            <input value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass(!!errors.role)}
            />
          </Field>

          {/* Email */}
          <Field label="Email" error={errors.email}>
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass(!!errors.email)}
            />
          </Field>

          {/* Image */}
          <Field label="Image (optional)" error={errors.image}>
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
                <span className="text-xs">Upload image</span>
              </button>
            )}
          </Field>

          {/* Order */}
          <Field label="Display order" error={errors.displayOrder}>
            <input type="number" min={1} max={maxOrder} value={displayOrder}
              onChange={(e) => {
                if (Number(e.target.value) > maxOrder) {
                  setDisplayOrder(maxOrder.toString());  // automatically change display of higher order to max
                  setOrderMessage(`Max order is ${maxOrder}`);          
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
          <Button variant="outline" className="hover:bg-destructive/10 hover:text-destructive" onClick={onCancel}>Cancel</Button>  {/** add translate */}
          <Button onClick={handleSave}>Save</Button> {/** add translate */}
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