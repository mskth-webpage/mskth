"use client";

import Image from "next/image";
import { Button } from '@/components/ui/button';

type TeamMemberCardProps = {
  name: string;
  role: string;
  email: string;
  imageUrl?: string;

  // Admin props, only visible to admins
  isAdmin?: boolean,
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function TeamMemberCard({
  name,
  role,
  email,
  imageUrl,
  isAdmin = false, // by default
  onEdit,
  onDelete,
}: TeamMemberCardProps) {  
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
            <span className="text-2xl font-bold text-muted-foreground">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="text-left">
        <h3 className="font-serif text-xl font-semibold text-foreground">
          {name}
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {role}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {email}
        </p>
      </div>

      {/* On admin page */}
      {isAdmin && (
        <div className="mt-3 flex gap-2 space-y-2">
          {onEdit && (
            <Button variant="secondary" onClick={onEdit}>Edit</Button>
          )}

          {onDelete && (
            <Button variant="destructive" onClick={onDelete}>Delete</Button>
          )}          
        </div>
      )}
    </article>
  );
}
