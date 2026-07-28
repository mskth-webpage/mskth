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
  onOpenStory?: () => void; // only visible to users

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
  onOpenStory,
  isAdmin = false, // by default
  onEdit,
  onDelete,
}: TeamMemberCardProps) {  
  const t = useTranslations("TeamMemberCard");
  const locale = useLocale();
  const hasStory = locale === "sv" ? !!story_sv : !!story_eng;

  return (
    <article 
      className={`group mx-auto w-[200px] p-[10px] transition-all duration-200 ${!isAdmin && hasStory ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:rounded-2xl" : ""}`}
      onClick={!isAdmin && hasStory ? onOpenStory : undefined}> {/* Display my story if card is clicked. Only works for normal users, not admins.*/}

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

        {!isAdmin && hasStory && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
          <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-md">{t('pressToReadStory')}</span>
        </div>
      )}
      </div>

      {/* Text */}
      <div className="text-left">
        <h3 className="font-serif text-xl font-semibold text-foreground">{name}</h3>

        <p className="mt-1 text-sm text-muted-foreground"> {locale === "sv" ? role_sv : role_eng} </p>

        <p className="mt-1 text-sm text-muted-foreground">{email}</p>
      </div>

      {/* On admin page */}
      {isAdmin && (
        <>
        {/* Display my story section in both languages if it exists */}
        <div className="text-sm text-muted-foreground">
          {story_eng && (
            <p className="mt-1 line-clamp-2">
              <span className="font-medium text-foreground">My story: </span>{" "}
              {story_eng}
            </p>
          )}
          {story_sv && (
            <p className="mt-1 line-clamp-2">
              <span className="font-medium text-foreground">Min historia: </span>{" "}
              {story_sv}
            </p>
          )}
        </div>

        {/* Edit and delete buttons */}
        <div className="mt-3 flex gap-2 space-y-2">
          {onEdit && (<Button variant="secondary" onClick={onEdit}>{t('edit')}</Button>)}

          {onDelete && (<Button variant="destructive" onClick={onDelete}>{t('delete')}</Button>)}          
        </div>
        </>
      )}
    </article>
  );
}
