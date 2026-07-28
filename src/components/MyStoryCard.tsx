"use client";

import Image from "next/image";
import { X } from "lucide-react";

type MyStoryCardProps = {
  name: string;
  role: string
  story?: string;
  imageUrl?: string;
  onClose: () => void;
};

export default function MyStoryCard({
  name,
  role,
  story,
  imageUrl,
  onClose,
}: MyStoryCardProps) {  

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={onClose} // Pressing backround closes card
    >
      <article 
            className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-background shadow-xl"
            onClick={(e) => e.stopPropagation()}
        >

        {/* Close button */}
        <button type="button" 
            onClick={onClose} 
            className="absolute right-4 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/50 text-background hover:bg-foreground/70">
            <X className="h-3 w-3" />
        </button>

        {/* Image */}
        {imageUrl && (
            <div className="relative h-64 w-full">
                <Image src={imageUrl} alt={name} fill className="object-cover"/>
            </div>
        )}

        {/* Text */}
        <div className="flex-1 overflow-y-auto border-t p-6">
          <h2 className="text-2xl font-semibold">{name}</h2>

          <p className="mt-1 text-muted-foreground">
            {role}
          </p>

          {story && (
            <p className="mt-6 whitespace-pre-wrap leading-7">
              {story}
            </p>
          )}
        </div>
      </article>
    </div>
  );
}