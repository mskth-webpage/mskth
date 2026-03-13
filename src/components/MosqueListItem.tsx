/** Following format for TeamMemberCard.tsx */

"use client";
import Image from "next/image";

type MosqueListItemProps = {
  name: string;
  highlight: string;
  metroStation: string;
  metroStationLabel: string;
  imageUrl?: string;
};

export default function MosqueListItem({
  name,
  highlight,
  metroStation,
  metroStationLabel,
  imageUrl,
}: MosqueListItemProps) {
  return (
    <article className="mx-auto flex items-center gap-4">
      {/* Image */}
      <div className="relative h-[140px] w-[140px] overflow-hidden bg-muted rounded-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      {/* Text */}
      <div className="text-left">
        <h3 className="font-serif text-lg text-foreground font-semibold">
          {name}
        </h3>

        <p className="mt-1 font-serif text-lg text-blue-brand font-black uppercase">
          {highlight}
        </p>

        <p className="mt-3 font-serif text-base text-muted-foreground font-bold">
          {metroStationLabel}: {metroStation}
        </p>
      </div>
    </article>
  );
}
