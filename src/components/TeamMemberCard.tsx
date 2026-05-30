"use client";

import Image from "next/image";

type TeamMemberCardProps = {
  name: string;
  role: string;
  email: string;
  imageUrl?: string;
};

export default function TeamMemberCard({
  name,
  role,
  email,
  imageUrl,
}: TeamMemberCardProps) {
  return (
    <article className="mx-auto"> {/* Had to change from <article className="w-[260px]"> to <article className="mx-auto"> for centering purpose*/}
      {/* Image */}
      <div className="relative mb-6 h-[180px] w-[180px] overflow-hidden bg-muted rounded-tr-lg">
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
    </article>
  );
}
