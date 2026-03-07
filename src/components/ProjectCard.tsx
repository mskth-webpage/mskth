/** Following format for TeamMemberCard.tsx */

"use client";
import Image from "next/image";

type ProjectCardProps = {
  name: string;
  project_members: string;
  imageUrl?: string;
};

export default function ProjectCard({
  name,
  project_members,
  imageUrl,
}: ProjectCardProps) {
  return (
    <article className="mx-auto">
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
          {project_members}
        </p>
      </div>
    </article>
  );
}
