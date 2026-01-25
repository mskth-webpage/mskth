import React from "react";

type AboutHeaderProps = { 
    title: string;
    description: string;
};

export default function AboutHeader({ title, description }: AboutHeaderProps) {
    return (
        <section className="w-full bg-background text-center py-24">
        <h1 className="font-serif text-4xl font-semibold tracking-wide text-neutral-black">
          {title.toUpperCase()}
        </h1>
  
        <p className="mt-4 font-serif text-base text-muted-foreground">
          {description}
        </p>
      </section>
    );
}