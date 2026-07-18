"use client";

import Image from "next/image";
import { Button } from '@/components/ui/button';
import { useTranslations } from "next-intl";

type ProjectGroupCardProps = {
  name: string;
  description: string | null;
  contact_email: string | null;
  imageUrl?: string | null;

  // Admin props
  isAdmin?: boolean,
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ProjectGroupCard({
  name,
  description,
  contact_email,
  imageUrl,
  isAdmin = false,
  onEdit,
  onDelete,
}: ProjectGroupCardProps) {  
  const t = useTranslations("ProjectGroupCard"); // we might need to add this to translations, or use generic

  return (
    <article className="mx-auto">
      {/* Image or display text "No Image" */}
      <div className="relative mb-6 h-[180px] w-[180px] overflow-hidden bg-muted rounded-tr-lg">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-2xl font-bold text-muted-foreground">{t('noImage') || "No Image"}</span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="text-left max-w-[180px]">
        <h3 className="font-serif text-xl font-semibold text-foreground line-clamp-2 break-words">{name}</h3>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-3 break-words">{description}</p>
        )}

        {contact_email && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1 break-all">{contact_email}</p>
        )}
      </div>

      {/* On admin page */}
      {isAdmin && (
        <div className="mt-3 flex gap-2 space-y-2">
          {onEdit && (<Button variant="secondary" onClick={onEdit}>{t('edit') || "Edit"}</Button>)}
          {onDelete && (<Button variant="destructive" onClick={onDelete}>{t('delete') || "Delete"}</Button>)}          
        </div>
      )}
    </article>
  );
}
