"use client";

import Image from "next/image";
import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from "next-intl";

type TeamMemberCardProps = {
  name: string;
  role_eng: string;
  role_sv: string;
  email: string;
  imageUrl?: string;
  story_eng?: string;
  story_sv?: string;

  // Admin props, only visible to admins
  isAdmin?: boolean,
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function TeamMemberCard({
  name,
  role_eng,
  role_sv,
  email,
  imageUrl,
  story_eng,
  story_sv,
  isAdmin = false, // by default
  onEdit,
  onDelete,
}: TeamMemberCardProps) {  
  const t = useTranslations("TeamMemberCard");
  const locale = useLocale();

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
            <span className="text-2xl font-bold text-muted-foreground">{t('noImage')}</span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="text-left">
        <h3 className="font-serif text-xl font-semibold text-foreground">{name}</h3>

        <p className="mt-1 text-sm text-muted-foreground"> {locale === "sv" ? role_sv : role_eng} </p>

        <p className="mt-1 text-sm text-muted-foreground">{email}</p>
      </div>

      {/* On admin page, KOLLA OM FUNKAR */}
      {isAdmin && (
        <>
        <div className="mt-1 text-sm text-muted-foreground">
          {story_eng && (
            <p className="line-clamp-2">
              <span className="font-medium text-foreground">My story: </span>{" "}
              {story_eng}
            </p>
          )}

          {story_sv && (
            <p className="line-clamp-2">
              <span className="font-medium text-foreground">Min historia: </span>{" "}
              {story_sv}
            </p>
          )}
        </div>

        <div className="mt-3 flex gap-2 space-y-2">
          {onEdit && (<Button variant="secondary" onClick={onEdit}>{t('edit')}</Button>)}

          {onDelete && (<Button variant="destructive" onClick={onDelete}>{t('delete')}</Button>)}          
        </div>
        </>
      )}
    </article>
  );
}
